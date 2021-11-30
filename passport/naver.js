const passport = require("passport");
const NaverStrategy = require("passport-naver").Strategy;
const { User } = require("../models");

module.exports = () => {
  passport.use(
    new NaverStrategy(
      {
        clientID: process.env.NAVER_ID,
        clientSecret: process.env.NAVER_SECRET,
        callbackURL: "http://localhost:8080/auth/naver/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log(profile);
          const exUser = await User.findOne({
            where: {
              snsId: profile.id,
              provider: "naver",
            },
          });
          if (exUser) {
            return done(null, exUser);
          }
          const newUser = await User.create({
            snsId: profile.id,
            provider: "naver",
          });
          return done(null, newUser);
        } catch (err) {
          console.error(err);
          done(err);
        }
      }
    )
  );
};
