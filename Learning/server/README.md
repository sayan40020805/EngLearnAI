Development server proxy for EngLearnAI

This minimal Express server provides three endpoints:

- POST /api/generate-exam
  - Body: { prompt: string }
  - Calls pollinations.ai server-side to avoid browser CORS and returns the text response.

- POST /api/exam-results
  - Body: any JSON (e.g. { userId, examId, score, totalQuestions, percentage, results })
  - Stores the payload in `data/examResults.json` (simple append, development use only)

- GET /api/dashboard
  - Optional query: ?userId=...
  - Returns stored exam results (filtered by userId when provided)

How to run locally

1. Install dependencies (from the `Learning/server` folder):

   npm install

2. Start the server:

   npm start

3. Update frontend to use the local server during development:

   In `Learning/src/utils/api.js`, set `baseURL` to `http://localhost:5000` (or use an env variable) so the frontend axios instance talks to this server.

Notes

- This server is intentionally minimal and stores results in a JSON file. For production, use a proper database and authentication.
- The generate-exam endpoint forwards pollinations.ai responses; you may want to sanitize or validate the response before returning it to clients.
