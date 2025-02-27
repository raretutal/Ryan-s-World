import express from 'express';
import { google } from 'googleapis';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const OAuth2 = google.auth.OAuth2;

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

const oauth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);

const scopes = [
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.readonly'
];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes
});

console.log('Authorize this app by visiting this url:', authUrl);

app.get('/oauth2callback', async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    console.log('Access Token:', tokens.access_token);
    console.log('Refresh Token:', tokens.refresh_token);
    res.send('Authorization successful! You can close this tab.');
  } catch (error) {
    console.error('Error retrieving tokens:', error);
    res.send('Error retrieving tokens');
  }
});

// Create an instance of the Gmail API client
const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

app.post('/send-email', async (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: 'phanstherese@gmail.com', // YOUR_EMAIL_ADDRESS
    to: 'certifbai@gmail.com', // RECIPIENT_EMAIL_ADDRESS
    subject: `Contact Form Submission from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
  };

  const raw = Buffer.from(
    `From: ${mailOptions.from}\r\n` +
    `To: ${mailOptions.to}\r\n` +
    `Subject: ${mailOptions.subject}\r\n\r\n` +
    `${mailOptions.text}`
  ).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  try {
    await gmail.users.messages.send({
      userId: 'me',
      resource: {
        raw: raw
      }
    });
    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error); // Log the error details
    res.status(500).send(`Error sending email: ${error.message}`);
  }
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});