# Masjid Zakat Management System

A full-stack web application for managing zakat (Islamic charitable contributions) for a mosque. The system allows intake of zakat donations, records them in Google Sheets, and generates detailed PDF receipts.

## Project Overview

This application provides:
- **Web-based form** for collecting zakat donations from families and individuals
- **Google Sheets integration** for data persistence and reporting
- **Automated PDF generation** for zakat receipts (Nota Zakat)
- **Multi-type support** for various zakat forms (cash, rice, gold, etc.)
- **Family-based entries** to track zakat collections per household

## Project Structure

```
Pemasukan_Masjid/
├── frontend-masjid/          # React + Vite frontend application
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── FormPage.jsx  # Main zakat form component
│   │   │   └── Login.jsx     # Authentication component
│   │   ├── partials/         # UI sections
│   │   │   ├── Headers.jsx   # Header component
│   │   │   └── Footer.jsx    # Footer component
│   │   ├── App.jsx           # Root component
│   │   └── main.jsx          # Entry point
│   └── package.json          # Frontend dependencies
│
└── server/                   # Express.js backend
    ├── index.js              # Main server entry point
    ├── package.json          # Backend dependencies
    ├── .env                  # Environment variables
    ├── init/                 # Initialization modules
    │   └── googleAuth.js     # Google API authentication
    ├── get_last_row/         # Google Sheets row management
    │   └── getLastRow.js     # Fetch last row in sheet
    └── pdf_modification/     # PDF generation utilities
        ├── find-coords.js    # Coordinate detection for PDF
        ├── test-coords.js    # PDF coordinate testing
```

## Tech Stack

### Frontend
- **React** 19.1.1 - UI library
- **Vite** 7.1.7 - Build tool and dev server
- **ESLint** - Code quality linter

### Backend
- **Express.js** 5.2.1 - Web framework
- **Google APIs** - Google Sheets & Drive integration
- **pdf-lib** 1.17.1 - PDF manipulation library
- **CORS** - Cross-origin request handling
- **Body Parser** - Request parsing middleware
- **dotenv** 17.2.3 - Environment configuration

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Google Cloud credentials (for Google Sheets API)

### Installation

1. **Clone and Install Frontend**
```bash
cd frontend-masjid
npm install
```

2. **Install Backend Dependencies**
```bash
cd ../server
npm install
```

3. **Configure Environment Variables**

Create a `.env` file in the `server/` directory:
```env
PORT=3000
SPREADSHEET_ID=your_google_sheet_id
SERVICE_ACC_CREDS={"type":"service_account","project_id":"..."}
CREDS={"web":{"client_id":"...","client_secret":"..."}}
NOTA_ZAKAT_ID=your_drive_folder_id
```

### Running the Application

1. **Start the Backend**
```bash
cd server
npm start
# Server runs on http://localhost:3000
```

2. **Start the Frontend (in another terminal)**
```bash
cd frontend-masjid
npm run dev
# Frontend runs on http://localhost:5173
```

## Available Scripts

### Frontend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run lint` - Run ESLint code quality checks
- `npm run preview` - Preview production build

### Backend
- `npm start` - Start production server (requires `"start"` script in package.json)

## 📡 API Endpoints

### GET Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /` | Welcome message |
| `GET /get-sheet-data` | Fetch all zakat records from Google Sheets |
| `GET /last-row` | Get the last row number in the spreadsheet |
| `GET /draw-grid` | Generate PDF with grid coordinates |
| `GET /test-coords` | Test PDF coordinate system |

### POST Endpoints

| Endpoint | Description |
|----------|-------------|
| `POST /test-post-data` | Test data submission to Google Sheets |

## Form Fields

The zakat collection form includes:

**Family Information:**
- Family name (Nama Keluarga)
- Number of family members
- Address (Alamat)
- Date (Tanggal)

**Zakat Types Supported:**
- **Cash** (Uang) - in Rupiah
- **Rice** (Beras) - in Liters
- **Gold** (Emas) - in Grams with carat specification

**Additional Fields:**
- Individual/household infaq entries
- Income type tracking
- Quantity and unit specification
- Gold purity (karat) for precious metals

## 📊 Data Storage

- **Primary**: Google Sheets for structured data storage
- **Secondary**: Google Drive for generated PDF receipts
- All zakat records are stored with timestamps and personal information

## Docker Support

A `dockerfile` is included for containerization:
```bash
docker build -t masjid-zakat-app .
docker run -p 3000:3000 -p 5173:5173 masjid-zakat-app
```

## Workflow

1. User accesses the web form
2. Enters family/household zakat information
3. Specifies zakat type and amount for each family member
4. Submits form to backend
5. Backend validates and appends data to Google Sheets
6. System generates PDF receipt (Nota Zakat) and stores in Google Drive
7. User receives confirmation with receipt details

## Configuration

### Environment Variables Required:
- `PORT` - Server port (default: 3000)
- `SPREADSHEET_ID` - Google Sheets ID for storing zakat data
- `SERVICE_ACC_CREDS` - Service account JSON credentials
- `CREDS` - OAuth credentials for Google APIs
- `NOTA_ZAKAT_ID` - Google Drive folder ID for storing PDFs

## Contributing

When contributing to this project:
1. Follow the existing code structure
2. Use ESLint for code quality in frontend
3. Add environment variables to `.env` (never commit secrets)
4. Test API endpoints before deployment

## Notes

- The `.env` file contains sensitive credentials - never commit to version control
- Ensure `.gitignore` includes `.env`, `node_modules/`, and generated PDFs
- PDF generation coordinates are tested via `/test-coords` endpoint
- Service account permissions must include Sheets and Drive APIs

## Troubleshooting

**Frontend not connecting to backend:**
- Ensure backend is running on port 3000
- Check CORS configuration in backend
- Verify API URLs in frontend components

**Google Sheets API errors:**
- Verify SERVICE_ACC_CREDS are valid JSON
- Check SPREADSHEET_ID is correct and accessible
- Ensure service account has Sheets API enabled

**PDF generation fails:**
- Verify NOTA_ZAKAT_ID folder exists in Google Drive
- Check pdf-lib installation
- Review server logs for coordinate errors

---

**Last Updated:** March 2026
