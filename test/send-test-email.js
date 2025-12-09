import { sendMatchesEmail } from "../services/gmail.service.js";

const run = async () => {
  const emails = ["yvanega@gmail.com"]; // tu correo , "lbetancourtoliva@gmail.com"
  emails.forEach((email) => {
        sendMatchesEmail(email);
  })
};

run();
