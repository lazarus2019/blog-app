const expressAsyncHandler = require("express-async-handler");
const EmailMsg = require("../../model/EmailMessaging/EmailMessaging");
const {
  mailgun,
  mailHeader,
  basicEmailTemplate,
} = require("../../utils/mailgun");
const validateMongodbId = require("../../utils/validateMongodbID");

//// Send
const sendEmailMsgCtrl = expressAsyncHandler(async (req, res) => {
  const { to, subject, message } = req.body;

  try {
    const msg = mailHeader({
      email: to,
      firstName: req?.user?.firstName,
      lastName: req?.user?.lastName,
      subject,
      html: basicEmailTemplate({
        message,
        author: "Freecodeweb",
      }),
    });

    await mailgun()
      .messages()
      .send(msg, (error, body) => {
        if (error) {
          console.log(error);
        } else {
          console.log(body);
        }
      });

    const email = await EmailMsg.create({
      sentBy: req?.user?._id,
      subject,
      message,
      toEmail: to,
      fromEmail: req?.user?.email,
    });

    res.json(email);
  } catch (error) {
    res.json(error);
  }
});

module.exports = { sendEmailMsgCtrl };
