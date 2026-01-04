import * as dotenv from "dotenv";
dotenv.config();

import SibApiV3Sdk from "sib-api-v3-sdk";

console.log("Sender:", process.env.BREVO_SENDER_EMAIL);
console.log("API Key exists:", !!process.env.BREVO_API_KEY);

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

const email = {
  sender: {
    email: process.env.BREVO_SENDER_EMAIL,
    name: "News Digest",
  },
  to: [{ email: "snehanagaraj0208@gmail.com" }], // use your real email
  subject: "Brevo Test Success 🎉",
  htmlContent: "<h2>Brevo email is finally working 🚀</h2>",
};

apiInstance
  .sendTransacEmail(email)
  .then(() => console.log("✅ Email sent successfully"))
  .catch(console.error);
