const { User } = require("../models");
const bcrypt = require("bcrypt");
const Validator = require("fastest-validator");
const v = new Validator();

module.exports = {
  // create user
  createUser: async (req, res, next) => {
    try {
      const schema = {
        f_name: "string|required",
        l_name: "string|required",
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

      // check email exist
      const emailExist = await User.findOne({
        where: {
          email: req.body.email,
        },
      });
      if (emailExist) {
        return res.status(400).json({
          status: false,
          message: "Email already exist",
          data: result,
        });
      }

      const { password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        ...req.body,
        password: hashedPassword,
        role: "user",
      });

      return res.status(201).json({
        status: true,
        message: "User created successfully",
        data: newUser,
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
