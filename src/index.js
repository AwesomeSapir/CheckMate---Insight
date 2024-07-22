require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const { analyzeBill } = require('./controllers/billController');
const { healthCheck } = require('./controllers/healthController');

const app = express();
const port = process.env.PORT || 3000;

const upload = multer({ dest: 'uploads/' });

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/analyze', upload.single('bill'), analyzeBill);

app.get('/api/health', healthCheck);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
