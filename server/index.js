import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import pdf from "html-pdf";
 
import invoiceRoutes from "./routes/invoices.js";
import clientRoutes from "./routes/clients.js";
import userRoutes from "./routes/userRoutes.js";
import profile from "./routes/profile.js";
import pdfTemplate from "./documents/index.js";
import emailTemplate from "./documents/email.js";

 

const app = express();
dotenv.config();

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests from specific frontend domain
      if (
        !origin ||
        origin.includes("https://pizeonflyinvoiceapp.vercel.app")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use("/invoices", invoiceRoutes);
app.use("/clients", clientRoutes);
app.use("/users", userRoutes);
app.use("/profiles", profile);

// NODEMAILER TRANSPORT FOR SENDING INVOICE VIA EMAIL
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// DYNAMIC PDF GENERATION OPTIONS (DEFAULT TO A4)
const calculateDynamicPageSize = (contentLength) => {
  // You can add more sophisticated logic here based on actual content
  const pageHeight = contentLength > 1000 ? "297mm" : "210mm"; // Dynamic height based on content length
  return {
    width: "210mm", // Fixed width
    height: pageHeight, // Adjust height dynamically
    border: "10mm",
  };
};

// SEND PDF INVOICE VIA EMAIL
app.post("/send-pdf", (req, res) => {
  const { email, company } = req.body;
  const htmlContent = pdfTemplate(req.body);
  const dynamicOptions = calculateDynamicPageSize(htmlContent.length);

  // Create PDF with dynamic options
  pdf.create(htmlContent, dynamicOptions).toFile("invoice.pdf", (err) => {
    if (err) {
      return res.send(Promise.reject());
    }

    // Send email with the generated PDF
    transporter.sendMail(
      {
        from: `${
          company.businessName ? company.businessName : company.name
        } <info@pizeonfly.com>`,
        to: `${email}`,
        replyTo: `${company.email}`,
        subject: `Invoice from ${
          company.businessName ? company.businessName : company.name
        }`,
        text: `Invoice from ${
          company.businessName ? company.businessName : company.name
        }`,
        html: emailTemplate(req.body),
        attachments: [
          {
            filename: "invoice.pdf",
            path: `${__dirname}/invoice.pdf`,
          },
        ],
      },
      (error, info) => {
        if (error) {
          return res.status(500).send({ error });
        }
        res.status(200).send({ message: "Invoice sent successfully!", info });
      }
    );
  });
});

// CREATE AND SEND PDF INVOICE
app.post("/create-pdf", (req, res) => {
  const htmlContent = pdfTemplate(req.body);
  const dynamicOptions = calculateDynamicPageSize(htmlContent.length);

  // Create PDF with dynamic options
  pdf.create(htmlContent, dynamicOptions).toFile("invoice.pdf", (err) => {
    if (err) {
      return res.send(Promise.reject());
    }
    res.send(Promise.resolve());
  });
});

// FETCH PDF INVOICE
app.get("/fetch-pdf", (req, res) => {
  res.sendFile(`${__dirname}/invoice.pdf`);
});

// SERVER STATUS CHECK
app.get("/", (req, res) => {
  res.send("SERVER IS RUNNING");
});

// DATABASE CONNECTION AND SERVER START
const DB_URL = process.env.DB_URL;
const PORT = process.env.PORT || 5600;

mongoose
  .connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
  )
  .catch((error) => console.log(error.message));

mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
