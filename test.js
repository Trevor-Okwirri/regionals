const {google} = require('googleapis');
const nodemailer = require('nodemailer');
const {OAuth2Client} = google.auth;

// Replace with your client ID and client secret.
const CLIENT_ID = '51702236510-o3v13mchvthu30r83noikmkn8iboj556.apps.googleusercontent.com';
const CLIENT_SECRET = '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';

// Replace with the redirect URI you set up in the Google API Console.
const REDIRECT_URI = "http://localhost";

// Replace with the scopes you need for your application.
const SCOPES =  ['https://www.googleapis.com/auth/gmail.send', 'https://www.googleapis.com/auth/gmail.compose'];

const oAuth2Client =  new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Use the following URL to authorize the application and get the authorization code:
const authorizeUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
});

console.log('Authorize this app by visiting this url:', authorizeUrl);

// Enter the authorization code obtained from the URL above.
const authorizationCode = 'YOUR_AUTHORIZATION_CODE';

// Use the authorization code to get the access token and refresh token.
oAuth2Client.getToken(authorizationCode, (err, token) => {
  if (err) {
    return console.error('Error retrieving access token', err);
  }

  console.log(`Access token: ${token.access_token}`);
  console.log(`Refresh token: ${token.refresh_token}`);

  // Use the refresh token to obtain new access tokens when needed.
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: 'anonymousjusticeke@gmail.com',
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: token.refresh_token,
      accessToken: token.access_token,
      expires: token.expiry_date
    }
  });

  transporter.sendMail({
    from: 'anonymousjusticeke@gmail.com',
    to: 'trevorokwirri@gmail.com',
    subject: 'Test email',
    text: 'Hello, world!'
  }, (err, info) => {
    if (err) {
      console.error('Error sending email', err);
    } else {
      console.log('Email sent', info);
    }
  });
});
