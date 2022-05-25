const { User } = require("../models");
const bcrypt = require("bcrypt");
const Validator = require("fastest-validator");
const v = new Validator();
const jwt = require("jsonwebtoken");
const { google } = require("googleapis");

const {
  OAUTH_CLIENT_ID,
  OAUTH_CLIENT_SECRET,
  SERVER_ROOT_URL,
  SERVER_LOGIN_ENDPOINT,
  JWT_SECRET_KEY,
} = process.env;

const oauth2Client = new google.auth.OAuth2(
  OAUTH_CLIENT_ID,
  OAUTH_CLIENT_SECRET,
  `${SERVER_ROOT_URL}/${SERVER_LOGIN_ENDPOINT}`
);

const generateAuthUrl = () => {
  const scopes = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
  ];

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    response_type: "code",
    scope: scopes,
  });

  return url;
};

const setCredentials = async (code) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);

      return resolve(tokens);
    } catch (err) {
      return reject(err);
    }
  });
};

const getUserInfo = () => {
  return new Promise(async (resolve, reject) => {
    try {
      var oauth2 = google.oauth2({
        auth: oauth2Client,
        version: "v2",
      });

      const data = oauth2.userinfo.get((err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(res);
      });
    } catch (err) {
      return reject(err);
    }
  });
};

module.exports = {
  // login
  login: async (req, res, next) => {
    try {
      const schema = {
        email: "email|required",
        password: "string|required",
      };

      const result = v.validate(req.body, schema);
      if (result.length) {
        return res.status(400).json({
          status: false,
          message: "Invalid input",
          data: result,
        });
      }

      const user = await User.findOne({
        where: { email: req.body.email },
      });
      if (!user) {
        return res.status(400).json({
          status: false,
          message: "User not found",
          data: null,
        });
      }

      const isPasswordValid = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (!isPasswordValid) {
        return res.status(400).json({
          status: false,
          message: "Invalid password",
          data: null,
        });
      }

      const data = {
        id: user.id,
        f_name: user.f_name,
        l_name: user.l_name,
        email: user.email,
        role: user.role,
      };

      const secretKey = process.env.JWT_SECRET_KEY;
      const token = jwt.sign(data, secretKey, { expiresIn: "1h" });

      return res.status(200).json({
        status: true,
        message: "Login success",
        data: {
          ...data,
          token,
        },
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: err.message,
        data: null,
      });
    }
  },

  // google oauth
  googleOAuth: async (req, res, next) => {
    try {
      const code = req.query.code;

      if (!code) {
        // generate url for google login
        const loginUrl = generateAuthUrl();

        // redirect to google login url
        return res.redirect(loginUrl);
      }

      // set credentials
      await setCredentials(code);

      // get user info
      const { data } = await getUserInfo();

      const user = {
        login_type: "google-oauth2",
        id: data.id,
        email: data.email,
      };

      const token = jwt.sign(user, JWT_SECRET_KEY);

      return res.status(200).json({
        status: true,
        message: "Login success",
        data: {
          ...user,
          token,
        },
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: err.message,
        data: null,
      });
    }
  },
};
