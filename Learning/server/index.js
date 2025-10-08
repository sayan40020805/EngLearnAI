const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, 'data', 'examResults.json');

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Ensure data folder and file exist
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
}
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// Proxy route to fetch exam from deepseek backend
app.post('/api/deepseek/ask', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Missing message' });

    const url = `https://deepseek-backend-1-gq8i.onrender.com/api/deepseek/ask`;

    const response = await axios.post(url, { message }, { responseType: 'text', timeout: 20000, maxRedirects: 5 });
    // Return text directly; frontend expects to parse JSON out of the response text
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.status(200).send(response.data);
  } catch (err) {
    console.error('enhanced-exams generate proxy error', err.message || err);
    const status = err.response ? err.response.status : 500;
    return res.status(500).json({ error: 'Proxy failed to fetch from deepseek backend', details: err.message || String(err), status });
  }
});

// Proxy route for generating enhanced exams from Gemini backend
app.post('/api/enhanced-exams/generate', async (req, res) => {
  try {
    const { subject, questionCount, difficulty } = req.body;
    if (!subject || !questionCount || !difficulty) {
      return res.status(400).json({ error: 'Missing subject, questionCount, or difficulty' });
    }

    // The URL for your Gemini backend, as mentioned in your TODO file
    const geminiUrl = 'https://gemini-backend-1-gq8i.onrender.com/api/enhanced-exams/generate';

    console.log('Proxying to Gemini backend with payload:', req.body);

    const response = await axios.post(geminiUrl, req.body, {
      timeout: 30000, // Increased timeout for potentially slow AI generation
    });

    // The Gemini backend should return a JSON object with a "questions" array.
    // We just forward this response.
    return res.status(200).json(response.data);
  } catch (err) {
    console.error('enhanced-exams generate proxy error:', err.message || err);
    const status = err.response ? err.response.status : 500;
    return res.status(status).json({ error: 'Proxy failed to fetch from Gemini backend', details: err.message || String(err) });
  }
});

// Proxy route for submitting enhanced exams to Gemini backend
app.post('/api/enhanced-exams/submit-and-score', async (req, res) => {
  try {
    if (!req.body.userId || !req.body.examId || !req.body.answers) {
      return res.status(400).json({ error: 'Missing required fields for submission' });
    }

    const geminiUrl = 'https://gemini-backend-1-gq8i.onrender.com/api/enhanced-exams/submit-and-score';
    console.log('Proxying submission to Gemini backend with payload:', req.body);

    const response = await axios.post(geminiUrl, req.body);
    return res.status(200).json(response.data);
  } catch (err) {
    console.error('enhanced-exams submit proxy error:', err.message || err);
    const status = err.response ? err.response.status : 500;
    return res.status(status).json({ error: 'Proxy failed to submit to Gemini backend', details: err.message || String(err) });
  }
});

// Store exam result
app.post('/api/exam-results', (req, res) => {
  try {
    const payload = req.body;
    if (!payload) return res.status(400).json({ error: 'Missing payload' });

    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const arr = raw ? JSON.parse(raw) : [];

    const entry = {
      id: `r_${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...payload
    };

    arr.push(entry);
    fs.writeFileSync(DATA_FILE, JSON.stringify(arr, null, 2));

    return res.status(201).json({ success: true, entry });
  } catch (err) {
    console.error('save result error', err);
    return res.status(500).json({ error: 'Failed to save result', details: err.message });
  }
});

// Get dashboard data (optionally filter by userId)
app.get('/api/dashboard', (req, res) => {
  try {
    const userId = req.query.userId;
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const arr = raw ? JSON.parse(raw) : [];
    const results = userId ? arr.filter(r => r.userId === userId) : arr;
    return res.status(200).json({ results, count: results.length });
  } catch (err) {
    console.error('dashboard error', err);
    return res.status(500).json({ error: 'Failed to load dashboard data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server proxy listening on http://localhost:${PORT}`);
});
