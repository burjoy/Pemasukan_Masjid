const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const credentials = JSON.parse(process.env.SERVICE_ACC_CREDS);
const { google } = require('googleapis');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Welcome to the Masjid Website Backend!');
});

app.get('/get-sheet-data', async (req, res) => {
  try {
    const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'], // Read-only scope for GET
    });
    // Authenticate and get the sheets client
    const client = await auth.getClient();
    console.log('Authenticated Google Sheets client:', client);
    const googleSheets = google.sheets({ version: 'v4', auth: client });

    const spreadsheetId = process.env.SPREADSHEET_ID; // The ID found in your Google Sheet URL
    const range = 'Sheet1!A:D'; // The range you want to retrieve (e.g., A1 notation)

    // Get metadata about the spreadsheet
    const metadata = await googleSheets.spreadsheets.get({
      auth,
      spreadsheetId,
    });

    // Get the actual data from the specified range
    const getRows = await googleSheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range,
    });

    const rows = getRows.data.values;

    if (rows.length) {
      res.status(200).json({ data: rows });
    } else {
      res.status(404).json({ message: 'No data found.' });
    }

  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});