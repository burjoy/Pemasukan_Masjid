const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path'); 

async function drawGrid() {
  // 1. Load your specific PDF
  const pdfPath = path.join(__dirname, 'Nota_Zakat_2025.pdf');
  const existingPdfBytes = fs.readFileSync(pdfPath);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  const { width, height } = firstPage.getSize();
  console.log(`Document size: ${width} x ${height} points`);

  // 2. Draw vertical and horizontal lines every 50 points
  for (let x = 0; x < width; x += 50) {
    firstPage.drawLine({ start: { x, y: 0 }, end: { x, y: height }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });
    firstPage.drawText(x.toString(), { x: x + 2, y: 10, size: 8, color: rgb(1, 0, 0) });
  }

  for (let y = 0; y < height; y += 50) {
    firstPage.drawLine({ start: { x: 0, y }, end: { x: width, y }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });
    firstPage.drawText(y.toString(), { x: 10, y: y + 2, size: 8, color: rgb(1, 0, 0) });
  }

  // 3. Save the "grid" version
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('Nota_Zakat_Grid.pdf', pdfBytes);
  console.log('Grid PDF saved! Open Nota_Zakat_Grid.pdf to see the coordinates.');
}

module.exports = { drawGrid };