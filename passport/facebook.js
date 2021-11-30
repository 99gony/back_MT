const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const { User } = require("../models");

module.exports = () => {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: "http://localhost:8080/auth/facebook/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const exUser = await User.findOne({
            where: {
              snsId: profile.id,
              provider: "facebook",
            },
          });
          if (exUser) {
            return done(null, exUser);
          }
          const newUser = await User.create({
            snsId: profile.id,
            provider: "facebook",
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
