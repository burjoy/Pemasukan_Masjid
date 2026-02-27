const { getSheetsClient } = require("../init/googleAuth");
require('dotenv').config();
const { google } = require('googleapis');

async function getLastRow(s) {
  // Define the range to fetch all possible data in column A
  const googleSheets = getSheetsClient();
  const spreadsheetId = process.env.SPREADSHEET_ID;
  const range = `Sheet1!A:A`; 

  try {
    const response = await googleSheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: range,
    });

    const values = response.data.values;

    if (values && values.length > 0) {
      // The length of the 'values' array is the last filled row number
      const lastRow = values.length; 
      console.log(`The last filled row is: ${lastRow}`);
      return lastRow;
    } else {
      console.log('No data found.');
      return 0; // Or 1 if you consider the header as the first row
    }
  } catch (err) {
    console.error('The API returned an error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
    throw err;
  }
}

module.exports = { getLastRow };