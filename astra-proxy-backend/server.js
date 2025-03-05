// server.js (Example modification)
const express = require('express');
const cors = require('cors');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const csvFilePath = path.join(__dirname, 'survey_results_public_astra_cleaned.csv');
const documents = [];

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row) => {
    documents.push(row);
  })
  .on('end', () => {
    console.log(`CSV file processed. Total rows: ${documents.length}`);
  });

// New endpoint to get a summary of CSV data
app.get('/api/csvsummary', (req, res) => {
  // For example, only include the first 10 rows as a sample.
  const sampleRows = documents.slice(0, 10);
  // Or generate any summary you find useful (e.g., counts, averages, etc.)
  res.json({ sample: sampleRows, total: documents.length });
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
