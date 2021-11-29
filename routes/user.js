const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../models");
const passport = require("passport");

const router = express.Router();

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, reason) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    if (reason) {
      return res.status(401).send(reason.message);
    }
    return req.login(user, async (loginErr) => {
      if (loginErr) {
        console.error(err);
        return next(loginErr);
      }
      return res.json(user);
    });
  })(req, res, next);
});

router.post("/join", async (req, res, next) => {
  try {
    const { nickname, mbti, gender, character, email, password } = req.body;
    const exUser = await User.findOne({
      where: {
        email,
      },
    });
    if (exUser) {
      return res.status(403).send("이미 사용중인 이메일입니다.");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      nickname,
      mbti,
      gender,
      character,
      email,
      password: hashedPassword,
    });
    res.json(newUser);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get("/logout", (req, res) => {
  req.logout();
  req.session.destroy();
  res.send("ok");
});

module.exports = router;
