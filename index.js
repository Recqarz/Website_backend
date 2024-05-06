const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv')

const app = express();

dotenv.config({
    path: "./config.env"
});

const PORT = process.env.PORT || 5000;

const userid=process.env.userid
const pass=process.env.pass

console.log("sdfghj", userid)

// Create a Nodemailer transporter using SMTP for Outlook
const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com', // Outlook SMTP server hostname
  port: 587, // Port for secure SMTP (TLS)
  secure: false, // Set to true if your SMTP server requires secure connection (TLS)
  auth: {
    user: "shweta.singh@recqarz.com", // Your Outlook email address
    pass: "Buw14365", // Your Outlook password
  },
});

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(cors());



// API endpoint to handle form submissions
app.post('/api/contact', async (req, res) => {
  const { name, email,number, jobtitle, organization, message } = req.body;

  try {
    // Send email using Outlook
    await transporter.sendMail({
      from: userid, // Sender address (your Outlook email address)
      to: 'shweta.singh@recqarz.com', // Recipient address (where you want to receive form data)
      subject: 'New Contact Form Submission', // Subject line
      text: `
        Name: ${name}
        Email: ${email}
        Number: ${number}
        Job Title: ${jobtitle}
        Organization: ${organization}
        Message: ${message}
      `, // Plain text body
    });

    // Send a thank you email to the visitor
    await transporter.sendMail({
      from: userid, // Sender address (your Outlook email address)
      to: email, // Visitor's email address
      subject: 'Thank You for Contacting Us', // Subject line
      text: 'Thank you for contacting us. We will get back to you as soon as possible!', // Plain text body
      
    });

    // Send a response back to the client
    res.status(200).json({ message: 'Form submission successful!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api',(req,res)=>{
    res.status(200).json({message:"api is running..."})
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
