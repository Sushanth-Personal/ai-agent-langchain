import { tool } from "@langchain/core/tools";
import { z } from "zod";
import nodemailer from "nodemailer";
import "dotenv/config";

// Zod schema for input validation and model guidance
const emailSchema = z.object({
  to: z.string().email().describe("The recipient's email address."),
  subject: z.string().describe("The subject of the email."),
  textContent: z.string().describe("The plain text body of the email."),
});


// Send email logic
const sendEmail = async ({ to, subject, textContent }) => {
  console.log("Mail fucntion activated");
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: `${process.env.EMAIL_USER}`,
    to,
    subject,
    text: textContent,  // 👈 use text here
  });

  return `Email sent successfully to ${to} with subject: "${subject}". Message ID: ${info.messageId}`;
};


// LangChain-compatible tool using zod
export const emailTool = tool(
  async ({ to, subject, textContent }) => {
    console.log("Email tool activated");
    return await sendEmail({ to, subject, textContent });
  },
  {
    name: "send_email",
    description: "Send a plain text email to a specified address with subject and body.",
    schema: emailSchema,
  }
);

