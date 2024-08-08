import nodemailer from "nodemailer";

export const mail = async ({
  email,
  emailType,
  url,
}: {
  email: string;
  emailType: string;
  url?: string;
}) => {
  try {
    await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_ADDRESS,
        pass: process.env.MAIL_PASSWORD,
      },
    });
    let subject = "";
    let html = "";
    if (emailType === "verify") {
      subject = "Verify Your donkeytype account";
      if (url) {
        html = `<h1>Hi, this is a verification email from donkeytype</h1><br><b>Please click on the below link to verify your donkeytype account</b><br><a href=${url} target="_blank">Verify Account</a><br><i>Node that it is valid for 12 hours only</i>`;
      }
    }
    if (emailType === "forgotpassword") {
      subject = "Change password of Donkeytype";
      if (url) {
        html = `<h1>Hi, this is an email from donkeytype to change your password</h1><br><b>Please click on the below link to change password of your donkeytype account</b><br><a href=${url} target="_blank">Verify Account</a><br><i>Node that it is valid for 30 minutes only</i>`;
      }
    }
    const mailOptions = {
      from: process.env.MAIL_ADDRESS,
      to: email,
      subject,
      html,
    };
    await transporter.sendMail(mailOptions);
    return true;
  } catch (e) {
    return false;
  }
};
