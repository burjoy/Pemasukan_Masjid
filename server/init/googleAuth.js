require('dotenv').config();
const { google } = require('googleapis');
const credentials = JSON.parse(process.env.SERVICE_ACC_CREDS);

let sheetsClient = null;

async function initGoogleSheets() {
    if (sheetsClient) return sheetsClient; // Return existing client if already initialized

    try {
        const auth = new google.auth.GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'], // Use read-write scope if needed
        });

        const client = await auth.getClient();

        // Create the sheets instance ONCE
        sheetsClient = google.sheets({ version: 'v4', auth: client });
        
        console.log('✅ Google Sheets API successfully authenticated.');
        return sheetsClient;
    } catch (error) {
        console.error('❌ Error initializing Google Sheets:', error);
        throw error;
    }
}

// Helper function to get the client later
function getSheetsClient() {
    if (!sheetsClient) {
        throw new Error("Sheets client not initialized. Call initGoogleSheets() first.");
    }
    return sheetsClient;
}

module.exports = { initGoogleSheets, getSheetsClient };