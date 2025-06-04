import nodemailer from "nodemailer";
import renderTemplateToHtml from "@/utils/RenderToHtml";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export async function POST(request) {
  try {
    const body = await request.json();
    const { userEmail, to, cc, bcc, subject, templateData, attachments, templateId } = body;

    if (!to || !subject || !templateData) {
      return new Response(JSON.stringify({ error: "Missing required fields." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

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
      from: userEmail,
      to,
      cc,
      bcc,
      subject,
      html: htmlContent,
      attachments: mailAttachments,
    };

    await transporter.sendMail(mailOptions);

    // Update template stats after successful email send
    if (templateId && userEmail) {
      try {
        // Get current template stats
        const template = await convex.query(api.emailTemplate.GetTemplateDesign, {
          tId: templateId,
          email: userEmail
        });

        // Update sent count
        await convex.mutation(api.emailTemplate.updateTemplateStats, {
          tId: templateId,
          email: userEmail,
          sentCount: (template?.sentCount || 0) + 1,
          lastSent: Date.now()
        });
      } catch (error) {
        console.error("Error updating template stats:", error);
        // Don't throw error here as email was sent successfully
      }
    }

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


