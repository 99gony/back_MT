const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const { User } = require("../models");
const bcrypt = require("bcrypt");

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne({
            where: { email },
          });
          if (!user) {
            return done(null, false, {
              message: "존재하지 않는 이메일입니다.",
            });
          }

          const result = await bcrypt.compare(password, user.password);
          if (result) {
            return done(null, user);
          }

          return done(null, false, { message: "잘못된 비밀번호입니다." });
        } catch (err) {
          console.error(err);
          return done(err);
        }
      }
    )
  );
};
