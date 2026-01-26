const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const credentials = JSON.parse(process.env.SERVICE_ACC_CREDS);
const { google } = require('googleapis');
const { initGoogleSheets, getSheetsClient } = require('./init/googleAuth');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
  res.send('Welcome to the Masjid Website Backend!');
});

initGoogleSheets().then(() => {
    app.listen(3000, () => {
        console.log('🚀 Server is running on port 3000');
    });
}).catch(console.error);

app.get('/get-sheet-data', async (req, res) => {
  try {
    // const auth = new google.auth.GoogleAuth({
    //     credentials,
    //     scopes: ['https://www.googleapis.com/auth/spreadsheets'], // Read-only scope for GET
    // });
    // // Authenticate and get the sheets client
    // const client = await auth.getClient();
    // console.log('Authenticated Google Sheets client:', client);
    const googleSheets = getSheetsClient();

    const spreadsheetId = process.env.SPREADSHEET_ID; // The ID found in your Google Sheet URL
    const range = 'Sheet1!A:D'; // The range you want to retrieve (e.g., A1 notation)

    // Get metadata about the spreadsheet
    const metadata = await googleSheets.spreadsheets.get({
      spreadsheetId,
    });

    // Get the actual data from the specified range
    const getRows = await googleSheets.spreadsheets.values.get({
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

app.post('/test-post-data', async (req, res) => {
  try {
    const googleSheets = getSheetsClient();
    const spreadsheetId = process.env.SPREADSHEET_ID;
    const response = await googleSheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A3',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [
          ['Test', 'Data', 'From', 'POST Request']
        ],
      },
    });
    res.status(200).json({ message: 'Data appended successfully', response });
  } catch (error) {
    console.log('Error appending data to Google Sheets:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/submit-form', async (req, res) => {
  try {
    const formData = req.body;
    console.log('Received form data:', formData);

    const googleSheets = getSheetsClient();
    const spreadsheetId = process.env.SPREADSHEET_ID;

    // Prepare the data to be appended
    const values = [
      [
        formData.nama_lengkap,
        formData.jumlah_anggota_keluarga,
        formData.tipe_zakat,
        formData.tipe_pemasukan,
        formData.jumlah_pemasukan,
        formData.satuan_pemasukan,
        formData.karat_emas,
        formData.infaq
      ]
    ];

    // Append the data to the Google Sheet
    const response = await googleSheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A2', // Adjust the range as needed
      valueInputOption: 'USER_ENTERED',
      resource: {
        values,
      },
    });

    res.status(200).json({ message: 'Form data submitted successfully', response });
  } catch (error) {
    console.error('Error submitting form data to Google Sheets:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});