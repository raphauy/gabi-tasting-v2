import { config } from "dotenv"
import { sendWineryUserInvite } from "./email-services";

config();

function main() {
  const email = "gabi@tinta.wine";
  const inviterName = "Raphael";
  const invitedName = "Gabi Zimmer";
  const wineryName = "Tinta Wines";
  const ctaLink = "http://192.168.0.29:3000/login?email=" + email;

  sendWineryUserInvite(email, inviterName, invitedName, wineryName, ctaLink);
}

//main();