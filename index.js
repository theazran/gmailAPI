const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");
const env = require("dotenv").config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use(
    cors({
        origin: "https://yourdomainfrontend.com",
    }),
);

app.post("/send-email", async (req, res) => {
    const { message, receiverEmail, subject, from } = req.body;

    try {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL,
                pass: process.env.KEY,
            },
        });

        let mailOptions = {
            from: from,
            to: receiverEmail,
            subject: subject,
            text: message,
        };

        let info = await transporter.sendMail(mailOptions);
        console.log("Email terkirim: ", info.messageId);

        res.json({ success: true, message: "Email berhasil dikirim!" });
    } catch (error) {
        console.error("Error saat mengirim email: ", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat mengirim email.",
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));
