require('dotenv').config();
const { google } = require('googleapis');
const credentials = JSON.parse(process.env.SERVICE_ACC_CREDS);

let sheetsClient = null;
let driveClient = null;

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

// Function for google drive initialization
async function initGoogleDrive() {
    try {
        const auth = new google.auth.GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/drive.readonly'], // Use read-write scope if needed
        });

        const client = await auth.getClient();

        // store client globally
        driveClient = google.drive({ version: 'v3', auth: client });
        console.log('✅ Google Drive API successfully authenticated.');
        return driveClient;
    } catch (error) {
        console.error('❌ Error initializing Google Drive:', error);
        throw error;
    }
}

function getDriveClient() {
    if (!driveClient) {
        throw new Error("Drive client not initialized. Call initGoogleDrive() first.");
    }
    return driveClient;
}

module.exports = { initGoogleSheets, getSheetsClient, initGoogleDrive, getDriveClient };