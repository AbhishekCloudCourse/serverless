const { v4: uuidv4 } = require('uuid');
const { pool } = require("./config");

exports.consumeUserMessage = (message, context) => {
    const pubSubMessage = message.data
      ? JSON.parse(Buffer.from(message.data, 'base64').toString())
      : null;
  require('dotenv').config();
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  console.log(process.env.SENDGRID_API_KEY);
  
  const functions = require('@google-cloud/functions-framework');
  
    // The Pub/Sub message is passed as the CloudEvent's data payload.
    const msg = {
      to: pubSubMessage.username,
      from: 'abhishekunnithan@gmail.com', // Use the email address or domain you verified above
      subject: 'Verify your email',
      html: `<strong>Click the below link</strong><br><a href="https://abhishekforce.me/verify/${pubSubMessage.id}>Click here</a>`,
    };
    //ES6
    sgMail
      .send(msg)
      .then(async () => {
        const uuid = uuidv4();
        const expiryDate = new Date();
        expiryDate.setMinutes(expiryDate.getMinutes() + 2);
        await pool.query('UPDATE users SET token = $1, tokenExpiry = $2 WHERE username = $3', [uuid, expiryDate, pubSubMessage.username]);
        console.log(`Updated user ${pubSubMessage.username} with UUID: ${uuid} and expiry date: ${expiryDate}`);
      }, error => {
        console.error(error);
        if (error.response) {
          console.error(error.response.body)
        }
      });
  
  
    console.log(`Received message with ID: ${context.eventId}`);
    console.log(`  Data: ${pubSubMessage}`);
  };