const nodemailer = require("nodemailer");

const sendVerifyEmail = async (email, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      transportMethod: "SMTP",
      secureConnection: true,
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Change Password",
      html: `
      <!DOCTYPE html>
      <html>
        <head>
        <meta charset="UTF-8">
        <title>Email Verification</title>
        </head>
        <body>
          <div class="container">
            <h2>Verify Your Email Address</h2>
            <p>
              Dear User,
            </p>
            <p>
              You are receiving this email because we were notified that you forgot your email,
              in case you didn't send this request please make sure to change your password and not share this email with anyone
              otherwise click the link below to change the password directly
            </p>
            <a href="http://${text}" class="button">
              Change Password
            </a>
            <p>
              If the button above doesn't work, please copy and paste the following link into your web browser:
            </p>
            <p>
              <a href="http://${text}" class="fallback-link">http://${text}</a>
            </p>
          </div>
        </body>
      </html>
      `,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendVerifyEmail