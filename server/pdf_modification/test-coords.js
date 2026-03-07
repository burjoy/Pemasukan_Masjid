const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function testCoordinates() {
  try {
    const pdfPath = path.join(__dirname, 'Nota_Zakat_2025.pdf');
    const existingPdfBytes = fs.readFileSync(pdfPath);
    
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const firstPage = pdfDoc.getPages()[0];

    const textSize = 10; //default 12
    const textColor = rgb(0.2, 0.2, 0.8);

    const writeText = (text, x, y) => {
      firstPage.drawText(text, { x, y, size: textSize, color: textColor });
    };

    // --- IDENTITAS & NOMINAL ---
    // Pushed X to 155 to clear the colons
    writeText('Luqman Hadiwinata', 150, 300); // Nama Keluarga
    writeText('Jl. Margonda Raya, Depok', 150, 283); // Alamat (Dropped Y by 25)
    
    writeText('Rp 150.000', 155, 260); // Zakat Fitrah
    writeText('Rp 500.000', 155, 244); // Zakat Mal
    writeText('4', 155, 227); // Dari Sejumlah (jiwa)
    
    // Zakat Beras & Infaq on the right side
    writeText('5 Kg', 445, 260); // Zakat Beras
    writeText('Rp 50.000', 445, 245); // Infaq

    // --- ANGGOTA KELUARGA ---
    // Using a consistent Y-drop of 18 points per line for perfect alignment
    
    const leftX = 80;  // Clears the numbers 1-5
    const rightX = 360; // Clears the numbers 6-10
    
    // Kiri (1-5)
    writeText('Anggota 1', leftX, 212);
    writeText('Anggota 2', leftX, 197);
    writeText('Anggota 3', leftX, 179);
    writeText('Anggota 4', leftX, 163);
    writeText('Anggota 5', leftX, 148);

    // Kanan (6-10) - Y coordinates match the left side perfectly
    writeText('Anggota 6', rightX, 212);
    writeText('Anggota 7', rightX, 197);
    writeText('Anggota 8', rightX, 179);
    writeText('Anggota 9', rightX, 163);
    writeText('Anggota 10', rightX, 148);

    // Tanggal Depok
    writeText('5 Maret 2026', 382, 120); // Adjust Y based on the signature line

    const outputPath = path.join(__dirname, 'Nota_Zakat_Test.pdf');
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(outputPath, pdfBytes);
    
    console.log('✅ Corrected Test PDF generated! Open Nota_Zakat_Test.pdf');

  } catch (error) {
    console.error('❌ Error testing coordinates:', error);
  }
}

module.exports = { testCoordinates };