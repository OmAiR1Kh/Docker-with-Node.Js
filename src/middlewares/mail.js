const nodemailer = require("nodemailer");

const sendMail = async (email, subject, text) => {
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
      subject: subject,
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
              Thank you for signing up with us! We're excited to have you on board. To get started, we need to verify your email address by clicking the button below:
            </p>
            <a href="http://${text}" class="button">
              Verify Email Address
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

module.exports = sendMail;
