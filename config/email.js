const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
let appDir = path.dirname(require.main.filename);

const sendMail = async (email, res) => {
  try {
    let authCode = Math.random().toString().substring(2, 6);
    let emailTemplete;
    ejs.renderFile(
      `${appDir}/template/authMail.ejs`,
      { authCode },
      (err, data) => {
        if (err) {
          return console.error(err);
        }
        emailTemplete = data;
      }
    );
    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: process.env.MAIL_EMAIL,
        pass: process.env.MAIL_PASSWORD,
      },
    });
    let message = {
      from: `"엠티" ${process.env.MAIL_EMAIL}`,
      to: email,
      subject: "이메일 인증 요청 메일입니다.",
      html: emailTemplete,
    };
    await transporter.sendMail(message, (err) => {
      if (err) {
        if (err.message === "No recipients defined") {
          return res.status(404).send("존재하지 않는 이메일입니다.");
        }
        return console.error(err);
      }
      return res.send("이메일로 인증번호가 전송되었습니다.");
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = sendMail;
