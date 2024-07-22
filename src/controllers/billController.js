const path = require('path');
const fs = require('fs');
const { extractText } = require('../services/ocrService');
const { parseBill } = require('../services/openaiService');

const analyzeBill = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }

  const filePath = path.join(__dirname, '../../uploads', req.file.filename);
  const languageHints = req.body.languages ? JSON.parse(req.body.languages) : ['en'];

  try {
    console.info(`Extracting text from image (languages: ${languageHints})...`);
    const lines = await extractText(filePath, languageHints);

    console.info('Parsing bill with OpenAI...');
    const parsedBill = await parseBill(lines);

    console.debug(`Parsed bill: \n${parsedBill}`);

    console.info(`Parsing bill to JSON...`);
    const billJson = JSON.parse(parsedBill);
    

    res.status(200).json(billJson);
    //res.status(200).json({ items: itemsArr });
  } catch (error) {
    console.error('Error analyzing bill:', error);
    res.status(500).send('Error analyzing the bill');
  } finally {
    // Delete the uploaded file
    fs.unlink(filePath, (error) => {
      if (error) {
        console.error('Error deleting file:', error);
      } else {
        console.log('Uploaded file deleted');
      }
    })
  }
};

module.exports = {
  analyzeBill,
};
