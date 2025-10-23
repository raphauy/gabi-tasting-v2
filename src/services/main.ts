import { config } from "dotenv"
import { sendWineryUserInvite } from "./email-services";

config();

function main() {
  const email = "rapha.uy@rapha.uy";
  const inviterName = "Raphael";
  const invitedName = "Gabi Zimmer";
  const wineryName = "Tinta Wines";
  const tastingName = "Tim Atkin MW Uruguay 2025 Special Report";
  const ctaLink = "http://192.168.0.29:3000/login?email=" + email;

  sendWineryUserInvite(email, inviterName, invitedName, wineryName, tastingName, ctaLink);
}

//main();