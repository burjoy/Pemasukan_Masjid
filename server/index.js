const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const credentials = JSON.parse(process.env.SERVICE_ACC_CREDS);
const { google } = require('googleapis');
const { initGoogleSheets, getSheetsClient } = require('./init/googleAuth');
const { getLastRow } = require('./get_last_row/getLastRow');
const { drawGrid } = require('./pdf_modification/find-coords');
const { testCoordinates } = require('./pdf_modification/test-coords');

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
    const last_row_response = await getLastRow();
    console.log('Last row response:', last_row_response);
    const response = await googleSheets.spreadsheets.values.append({
      spreadsheetId,
      range: `Sheet1!A${last_row_response + 1}`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [
          [`Test${last_row_response}`, 'Data', 'From', 'POST Request']
        ],
      },
    });
    res.status(200).json({ message: 'Data appended successfully', response });
  } catch (error) {
    console.log('Error appending data to Google Sheets:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/last-row', async(req, res) => {
  getLastRow();
});

app.get('/draw-grid', async (req, res) => {
  try {
    await drawGrid();
    res.status(200).json({ message: 'Grid drawn successfully. Check the server directory for Nota_Zakat_Grid.pdf' });
  } catch (error) {
    console.error('Error drawing grid on PDF:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/test-coords', async (req, res) => {
  try {
    await testCoordinates();
    res.status(200).json({ message: 'Test coordinates executed successfully. Check the server directory for Nota_Zakat_Test.pdf' });
  } catch (error) {
    console.error('Error testing coordinates on PDF:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/test-form', async (req, res) => {
  try {
    const formData = req.body;
    const googleSheets = getSheetsClient();
    const last_row_response = await getLastRow();
    const spreadsheetId = process.env.SPREADSHEET_ID;
    let valueToAppend = [formData.nama_lengkap, formData.tanggal, formData.alamat];
    formData.familyEntries.forEach(entry => {
      valueToAppend.push(entry.namaKeluarga);
    });
    const response = await googleSheets.spreadsheets.values.append({
      spreadsheetId,
      range: `Sheet1!A${last_row_response + 1}`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [valueToAppend],
      },
    });
    console.log('Received form data:', formData);
    for(let index in formData.familyEntries){
      console.log(`Entry ${index}:`, formData.familyEntries[index]);
    }
    res.status(200).json({ message: 'Form data received successfully', success: response });
  } catch (error) {
    console.error('Error processing form data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/submit-form', async (req, res) => {
  try {
    const formData = req.body;
    console.log('Received form data:', formData);

    const googleSheets = getSheetsClient();
    const last_row_response = await getLastRow();
    const spreadsheetId = process.env.SPREADSHEET_ID;

    // Build all updates in a single data array
    const dataToUpdate = [];
    let valueToAppend = [
      last_row_response, // Row number for the first entry
      formData.tanggal,
      formData.nama_lengkap, 
      // formData.alamat, // Uncomment if you want to include alamat in the sheet
    ];
    formData.familyEntries.forEach(entry => {
      valueToAppend.push(entry.namaKeluarga);
    });
    // Append the first row with common data (alamat, nama_lengkap, etc.)
    dataToUpdate.push({
      range: `Sheet1!A${last_row_response + 1}:M${last_row_response + 1}`,
      values: [valueToAppend],
    });
    dataToUpdate.push({
      range: `Sheet1!N${last_row_response + 1}`,
      values: [[formData.alamat]],
    });
    let jumlahColumn = '';

      // Determine which column for jumlah based on tipe_pemasukan
    if(formData.individualZakatEntries[0].tipe_pemasukan === 'Zakat Fitrah' && formData.individualZakatEntries[0].tipe === 'uang'){
        jumlahColumn = 'O';
    } else if(formData.individualZakatEntries[0].tipe_pemasukan === 'Zakat Fitrah' && formData.individualZakatEntries[0].tipe === 'beras'){
        jumlahColumn = 'P';
    } else if(formData.individualZakatEntries[0].tipe_pemasukan === 'Zakat Mal'){
        jumlahColumn = 'R';
    } else if(formData.individualZakatEntries[0].tipe_pemasukan === 'Fidyah'){
        jumlahColumn = 'S';
    } else if(formData.individualZakatEntries[0].tipe_pemasukan === 'Wakaf'){
        jumlahColumn = 'T';
    }

    dataToUpdate.push({
        range: `Sheet1!${jumlahColumn}${last_row_response + 1}`,
        values: [[formData.individualZakatEntries[0].jumlah]],
    });

      // Add infaq in column K for this row
    dataToUpdate.push({
        range: `Sheet1!Q${last_row_response + 1}`, // masukkin nilai infaq ke current row, nilainya last row + 1
        values: [[formData.individualZakatEntries[0].infaq]],
    });

    
    // For each familyEntry, write a complete row with common and specific data
    // for(let index in formData.familyEntries){
    //   const currentRow = last_row_response + 1 + parseInt(index);
    //   console.log(`Entry ${index}:`, formData.familyEntries[index]);

    //   // Write common data for this entry
    //   const common_values = [[
    //     last_row_response + parseInt(index), // Row number
    //     formData.nama_lengkap,
    //     formData.tanggal,
    //     formData.alamat,
    //     formData.zakatEntries[index].namaKeluarga, // namaKeluarga from the entry
    //   ]];

    //   dataToUpdate.push({
    //     range: `Sheet1!A${currentRow}:E${currentRow}`,
    //     values: common_values,
    //   });

    //   let jumlahColumn = '';

    //   // Determine which column for jumlah based on tipe_pemasukan
    //   if(formData.zakatEntries[index].tipe_pemasukan === 'Zakat Fitrah' && formData.zakatEntries[index].tipe === 'uang'){
    //     jumlahColumn = 'F';
    //   } else if(formData.zakatEntries[index].tipe_pemasukan === 'Zakat Fitrah' && formData.zakatEntries[index].tipe === 'beras'){
    //     jumlahColumn = 'G';
    //   } else if(formData.zakatEntries[index].tipe_pemasukan === 'Zakat Mal'){
    //     jumlahColumn = 'H';
    //   } else if(formData.zakatEntries[index].tipe_pemasukan === 'Fidyah'){
    //     jumlahColumn = 'J';
    //   } else if(formData.zakatEntries[index].tipe_pemasukan === 'Wakaf'){
    //     jumlahColumn = 'I';
    //   }

    //   // Add jumlah in the appropriate column for this row
    //   dataToUpdate.push({
    //     range: `Sheet1!${jumlahColumn}${currentRow}`,
    //     values: [[formData.zakatEntries[index].jumlah]],
    //   });

    //   // Add infaq in column K for this row
    //   dataToUpdate.push({
    //     range: `Sheet1!K${currentRow}`,
    //     values: [[formData.zakatEntries[index].infaq]],
    //   });
    // }

    // Make a single batchUpdate with all data
    const response = await googleSheets.spreadsheets.values.batchUpdate({
      spreadsheetId,
      resource: {
        valueInputOption: 'USER_ENTERED',
        data: dataToUpdate,
      },
      includeValuesInResponse: true,
    });

    res.status(200).json({ message: 'Form data submitted successfully', success: response });
  } catch (error) {
    console.error('Error submitting form data to Google Sheets:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});