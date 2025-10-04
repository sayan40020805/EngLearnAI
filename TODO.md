# TODO: Replace Gemini with Deepseek in Chat and Exam

## Completed Tasks
- [x] Update ChatBox.jsx endpoint from /api/gemini/ask to /api/deepseek/ask
- [x] Change ChatBox.jsx title from "Gemini Chat" to "Deepseek Chat"
- [x] Update ChatBox.jsx error messages to reference Deepseek instead of Gemini
- [x] Update vite.config.js proxy target to https://deepseek-backend-1-gq8i.onrender.com/api
- [x] Update README.md references from gemini-backend to deepseek-backend

## Notes
- Exam functionality uses /api/enhanced-exams/generate which internally uses Deepseek API, no frontend changes needed
- Backend is already configured to use Deepseek API with DEEPSEEK_API_KEY
- Proxy configuration updated to point to new backend URL
