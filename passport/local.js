const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const { User } = require("../models");
const bcrypt = require("bcrypt");

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "uid",
        passwordField: "password",
      },
      async (uid, password, done) => {
        try {
          const user = await User.findOne({
            where: { uid },
          });
          if (!user) {
            return done(null, false, {
              message: "아이디 또는 비밀번호가 잘못 입력되었습니다.",
            });
          }

          const result = await bcrypt.compare(password, user.password);
          if (result) {
            return done(null, user);
          }

          return done(null, false, {
            message: "아이디 또는 비밀번호가 잘못 입력되었습니다.",
          });
        } catch (err) {
          console.error(err);
          return done(err);
        }
      }
    )
  );
};
