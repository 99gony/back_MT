const passport = require("passport");
const { User } = require("../models");

const local = require("./local");
const kakao = require("./kakao");
const google = require("./google");
const naver = require("./naver");
const facebook = require("./facebook");

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({ where: { id } });
      done(null, user);
    } catch (err) {
      console.error(err);
      done(error);
    }
  });

  local();
  kakao();
  google();
  naver();
  facebook();
};
