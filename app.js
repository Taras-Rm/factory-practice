import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

class MessageSender {
  send(message, recipient) {
    throw new Error("send method must be implemented");
  }
}

class EmailSender extends MessageSender {
  constructor(config) {
    super();
    this.senderEmail = config.senderEmail;
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: config.senderEmail,
        pass: config.senderPassword,
      },
    });
  }

  async send(message, toEmail) {
    try {
      // sending real email
      await this.transporter.sendMail({
        from: this.senderEmail,
        to: toEmail,
        subject: "Test email",
        text: message,
      });
      console.log(`Send by email message: ${message}. To: ${toEmail}`);
    } catch (error) {
      console.error(error);
    }
  }
}

class SMSSender extends MessageSender {
  constructor() {
    super();
  }

  send(message, toPhoneNumber) {
    // show sending in console
    console.log(`Send by sms message: ${message}. To: ${toPhoneNumber}`);
  }
}

class PushNotificationSender extends MessageSender {
  constructor() {
    super();
  }

  send(message, toId) {
    // show sending in console
    console.log(`Send by push notification message: ${message}. To: ${toId}`);
  }
}

class SenderFactory {
  create(sender, config) {
    switch (sender) {
      case "email":
        return new EmailSender(config);
      case "sms":
        return new SMSSender();
      case "push":
        return new PushNotificationSender();
      default:
        throw new Error("usupported sender type");
    }
  }
}

// start code execution
const senderFactory = new SenderFactory();

const config = {
  emailConfig: {
    senderEmail: process.env.EMAIL_SENDER_EMAIL,
    senderPassword: process.env.EMAIL_SENDER_PASSWORD,
  },
};

// create senders
const email = senderFactory.create("email", config.emailConfig);
const sms = senderFactory.create("sms");
const pushNotification = senderFactory.create("push");

// send messages using senders
email.send("Hello!", "test@gmail.com");
pushNotification.send("Hi!", "dar75Gjhs");
sms.send("How are you?", "+380967656578");
