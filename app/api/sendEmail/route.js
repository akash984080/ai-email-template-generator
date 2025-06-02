import nodemailer from "nodemailer";
import renderTemplateToHtml from "@/utils/RenderToHtml";
import { google } from 'googleapis';

export async function POST(request) {
  try {
    const body = await request.json();
    const {to, cc, bcc, subject, templateData, attachments, userEmail } = body;

    if (!to || !subject || !templateData || !userEmail) {
      return new Response(JSON.stringify({ error: "Missing required fields." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // More detailed environment variable logging
    console.log("Environment Check:", {
      nodeEnv: process.env.NODE_ENV,
      hasGmailRefreshToken: !!process.env.GMAIL_REFRESH_TOKEN,
      hasGmailUser: !!process.env.GMAIL_USER,
      hasGmailClientId: !!process.env.GMAIL_CLIENT_ID,
      hasGmailClientSecret: !!process.env.GMAIL_CLIENT_SECRET,
      allEnvKeys: Object.keys(process.env).filter(key => key.includes('GMAIL') || key.includes('MAIL')),
    });

    // More detailed debug logging
    console.log("Email Configuration:", {
      userEmail: userEmail,
      provider: body.provider || 'gmail',
      to: to,
      subject: subject,
      emailDomain: userEmail.split('@')[1]
    });

    async function createTransporter(provider) {
      if (provider === "gmail") {
        // Check for required OAuth2 credentials
        if (!process.env.GMAIL_REFRESH_TOKEN || !process.env.GMAIL_USER || 
            !process.env.GMAIL_CLIENT_ID || !process.env.GMAIL_CLIENT_SECRET) {
          console.error("Missing OAuth2 credentials. Please check your .env.local file");
          console.error("Required environment variables:", {
            GMAIL_REFRESH_TOKEN: !!process.env.GMAIL_REFRESH_TOKEN,
            GMAIL_USER: !!process.env.GMAIL_USER,
            GMAIL_CLIENT_ID: !!process.env.GMAIL_CLIENT_ID,
            GMAIL_CLIENT_SECRET: !!process.env.GMAIL_CLIENT_SECRET
          });
          throw new Error("Gmail OAuth2 credentials are not configured. Please check your .env.local file.");
        }

        // Create OAuth2 client
        const oauth2Client = new google.auth.OAuth2(
          process.env.GMAIL_CLIENT_ID,
          process.env.GMAIL_CLIENT_SECRET,
          'https://developers.google.com/oauthplayground'
        );

        oauth2Client.setCredentials({
          refresh_token: process.env.GMAIL_REFRESH_TOKEN
        });

        // Get a new access token
        const { token } = await oauth2Client.getAccessToken();

        console.log("Using Gmail OAuth2 configuration:", {
          host: 'smtp.gmail.com',
          port: 465,
          user: process.env.GMAIL_USER,
          hasRefreshToken: !!process.env.GMAIL_REFRESH_TOKEN,
          hasAccessToken: !!token
        });

        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            type: 'OAuth2',
            user: process.env.GMAIL_USER,
            clientId: process.env.GMAIL_CLIENT_ID,
            clientSecret: process.env.GMAIL_CLIENT_SECRET,
            refreshToken: process.env.GMAIL_REFRESH_TOKEN,
            accessToken: token
          }
        });

        // Verify the transporter configuration
        return new Promise((resolve, reject) => {
          transporter.verify(function(error, success) {
            if (error) {
              console.log("Transporter verification failed:", error);
              if (error.code === 'EAUTH') {
                console.log("OAuth2 Authentication failed. Please check:");
                console.log("1. Are all OAuth2 credentials present in .env.local?");
                console.log("2. Is the refresh token valid?");
                console.log("3. Is the client ID and secret correct?");
                console.log("4. Is the GMAIL_USER email correct?");
                console.log("5. Are the OAuth scopes correct? (should include https://mail.google.com/)");
              }
              reject(error);
            } else {
              console.log("Transporter is ready to send messages");
              resolve(transporter);
            }
          });
        });
      } else if (provider === "outlook") {
        if (!process.env.OUTLOOK_PASSWORD) {
          throw new Error("Outlook Password is not configured. Please check your .env file.");
        }
        return nodemailer.createTransport({
          host: 'smtp-mail.outlook.com',
          port: 587,
          secure: false,
          auth: {
            type: 'login',
            user: userEmail,
            pass: process.env.OUTLOOK_PASSWORD,
          },
          tls: {
            rejectUnauthorized: false
          }
        });
      } else {
        throw new Error("Unsupported provider");
      }
    }

    const transporter = await createTransporter(body.provider || "gmail");

    let htmlContent = renderTemplateToHtml(templateData);
    const mailAttachments = [];

    if (attachments?.length > 0) {
      attachments.forEach((file, index) => {
        const isImage = file.type.startsWith("image/");
        const attachment = {
          filename: file.name,
          content: file.base64,
          encoding: "base64",
          contentType: file.type,
          ...(isImage ? { cid: `image${index}` } : {}),
        };

        mailAttachments.push(attachment);

        if (isImage) {
          htmlContent = htmlContent.replace(
            new RegExp(`{{inlineImage${index + 1}}}`, "g"),
            `cid:image${index}`
          );
        }
      });
    }

    const mailOptions = {
      from: {
        name: 'Email Template Generator',
        address: process.env.GMAIL_USER || userEmail
      },
      to,
      cc,
      bcc,
      subject,
      html: htmlContent,
      attachments: mailAttachments,
    };

    console.log("Sending email with options:", {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
      hasAttachments: mailAttachments.length > 0
    });

    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ message: "Email sent successfully!" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Email send error:", error);
    let errorMessage = "Failed to send email. ";
    if (error.code === 'EAUTH') {
      errorMessage += "Authentication failed. Please check your Gmail OAuth2 settings.";
    } else {
      errorMessage += error.message;
    }
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}


