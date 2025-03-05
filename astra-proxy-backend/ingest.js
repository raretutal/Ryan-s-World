// ingest.js

require('dotenv').config({ path: './.env' });

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const fetch = require('node-fetch'); // using node-fetch@2

// Debug: Log current working directory and .env contents.
console.log("Current working directory:", process.cwd());
try {
  const envContents = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
  console.log("DEBUG: .env contents:\n", envContents);
} catch (err) {
  console.error("DEBUG: Could not read .env file:", err);
}

console.log("DEBUG: Loaded ASTRA_DB_TOKEN =", process.env.ASTRA_DB_TOKEN);
console.log("DEBUG: Loaded ASTRA_DB_URL =", process.env.ASTRA_DB_URL);
console.log("DEBUG: Loaded ASTRA_KEYSPACE =", process.env.ASTRA_KEYSPACE);
console.log("DEBUG: Loaded COLLECTION_NAME =", process.env.COLLECTION_NAME);

const astraToken = process.env.ASTRA_DB_TOKEN;
const astraUrl = process.env.ASTRA_DB_URL;
const namespace = process.env.ASTRA_KEYSPACE;
const collection = process.env.COLLECTION_NAME;

if (!astraToken || !astraUrl || !namespace || !collection) {
  throw new Error("Missing required environment variables");
}

const csvFilePath = 'survey_results_public_astra_cleaned.csv';
const documents = [];

// Read the CSV file and push each row as a document.
fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row) => {
    documents.push(row);
  })
  .on('end', async () => {
    console.log(`CSV file "${csvFilePath}" processed. Total documents: ${documents.length}`);

    // Function to insert a single document using the base Documents endpoint.
    async function insertDocument(doc, index) {
      // Use the standard endpoint for inserting a document:
      // POST /api/rest/v2/namespaces/<namespace>/collections/<collection>
      const endpoint = `${astraUrl}/api/rest/v2/namespaces/${namespace}/collections/${collection}`;
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Cassandra-Token': astraToken,
          },
          body: JSON.stringify(doc),
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Insert failed: ${response.status} ${errorText}`);
        }
        return response.json();
      } catch (error) {
        throw error;
      }
    }

    // Insert documents sequentially (you can also try parallel insertion if desired)
    for (let i = 0; i < documents.length; i++) {
      try {
        await insertDocument(documents[i], i);
        console.log(`Document ${i + 1} inserted successfully.`);
      } catch (err) {
        console.error(`Error inserting document ${i + 1}:`, err);
      }
    }
  });
