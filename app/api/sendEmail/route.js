
import nodemailer from "nodemailer";
import renderTemplateToHtml from "@/utils/RenderToHtml";

export async function POST(request) {
  try {
    const body = await request.json();
    const {from, to, cc, bcc, subject, templateData, attachments } = body;

    if (!to || !subject || !templateData) {
      return new Response(JSON.stringify({ error: "Missing required fields." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { GMAIL_USER, GMAIL_PASSWORD } = process.env;



    function createTransporter(provider) {
  if (provider === "gmail") {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });
  } else if (provider === "outlook") {
    return nodemailer.createTransport({
      service: "hotmail", 
      auth: {
        user: process.env.OUTLOOK_USER,
        pass: process.env.OUTLOOK_PASSWORD,
      },
    });
  } else {
    throw new Error("Unsupported provider");
  }
}

    const transporter = createTransporter(body.provider || "gmail");



    

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
      from: from,
      to,
      cc,
      bcc,
      subject,
      html: htmlContent,
      attachments: mailAttachments,
    };

    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ message: "Email sent successfully!" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Email send error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}


