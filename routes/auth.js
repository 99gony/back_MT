const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../models");
const passport = require("passport");
const { frontServer } = require("../config/server");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    if (req.user) {
      const user = await User.findOne({
        where: { id: req.user.id },
      });
      res.json(user);
    } else {
      res.json(null);
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post("/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local", (err, user, reason) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    if (reason) {
      return res.status(401).send(reason.message);
    }
    return req.login(user, (loginErr) => {
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }
      if (req.body.isAutoLogin) {
        req.session.cookie.maxAge = 315360000000; //10년
      }
      return res.json(user);
    });
  })(req, res, next);
});

router.post("/join", isNotLoggedIn, async (req, res, next) => {
  try {
    const { nickname, mbti, gender, character, email, password, id } = req.body;
    if (email && password && !id) {
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
    } else {
      await User.update(
        {
          nickname,
          mbti,
          gender,
          character,
        },
        {
          where: { id },
        }
      );
      const socialUser = await User.findByPk(id);
      console.log(socialUser);
      res.json(socialUser);
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get("/kakao", isNotLoggedIn, passport.authenticate("kakao"));

router.get("/kakao/callback", (req, res, next) => {
  passport.authenticate("kakao", (err, user) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    req.login(user, (loginErr) => {
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }
      return res.redirect(frontServer);
    });
  })(req, res, next);
});

router.get(
  "/google",
  isNotLoggedIn,
  passport.authenticate("google", {
    scope: ["profile"],
    prompt: "select_account",
  })
);

router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", (err, user) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    req.login(user, (loginErr) => {
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }
      return res.redirect(frontServer);
    });
  })(req, res, next);
});

router.get("/naver", isNotLoggedIn, passport.authenticate("naver"));

router.get("/naver/callback", (req, res, next) => {
  passport.authenticate("naver", (err, user) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    req.login(user, (loginErr) => {
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }
      return res.redirect(frontServer);
    });
  })(req, res, next);
});

router.get("/facebook", isNotLoggedIn, passport.authenticate("facebook"));

router.get("/facebook/callback", (req, res, next) => {
  passport.authenticate("facebook", (err, user) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    req.login(user, (loginErr) => {
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }
      return res.redirect(frontServer);
    });
  })(req, res, next);
});

router.get("/logout", isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    const { provider } = req.user;
    req.logout();
    if (provider === "kakao") {
      return res.redirect(frontServer);
    }
    res.send("ok");
  });
});

module.exports = router;
