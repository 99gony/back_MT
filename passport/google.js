const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { User } = require("../models");

module.exports = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: "http://localhost:8080/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const exUser = await User.findOne({
            where: {
              snsId: profile.id,
              provider: "google",
            },
          });
          if (exUser) {
            return done(null, exUser);
          }
          const newUser = await User.create({
            snsId: profile.id,
            provider: "google",
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
