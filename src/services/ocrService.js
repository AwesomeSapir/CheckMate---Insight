const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();

const extractText = async (filePath, languageHints) => {
  const [result] = await client.documentTextDetection({
    image: { source: { filename: filePath } },
    imageContext: {
      languageHints: languageHints,
    },
  });

  if (!result || !result.fullTextAnnotation) {
    throw new Error('No text annotations found');
  }

  const { fullTextAnnotation } = result;
  const pages = fullTextAnnotation.pages;
  const rows = [];

  pages.forEach(page => {
    page.blocks.forEach(block => {
      block.paragraphs.forEach(paragraph => {
        paragraph.words.forEach(word => {
          const boundingBox = word.boundingBox.vertices;
          const text = word.symbols.map(symbol => symbol.text).join('');
          rows.push({ boundingBox, text });
        });
      });
    });
  });

  const table = groupIntoRows(rows);
  return table;
};

const groupIntoRows = (rows) => {
  rows.sort((a, b) => a.boundingBox[0].y - b.boundingBox[0].y);
  
  const groupedRows = [];
  let currentRow = [];
  let currentY = rows[0].boundingBox[0].y;

  rows.forEach(row => {
    if (Math.abs(row.boundingBox[0].y - currentY) < 20) {
      currentRow.push(row.text);
    } else {
      groupedRows.push(currentRow);
      currentRow = [row.text];
      currentY = row.boundingBox[0].y;
    }
  });
  groupedRows.push(currentRow);

  return groupedRows;
};

module.exports = {
  extractText
};
