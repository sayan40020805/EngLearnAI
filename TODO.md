# TODO: Update Enhanced Exam to Use Gemini API

## Current Status
- EnhancedExamPage.jsx uses pollinations.ai for question generation
- Backend is configured for Gemini API at gemini-backend-1-gq8i.onrender.com
- Need to update frontend to call /api/enhanced-exams/generate endpoint

## Tasks
- [x] Update generateExam function in EnhancedExamPage.jsx to use API.post instead of fetch to pollinations.ai
- [ ] Change payload to { subject, questionCount, difficulty }
- [ ] Update response handling to expect questions array directly
- [ ] Test the integration by generating an exam
- [ ] Verify questions are generated correctly
- [ ] Check for any errors and fix if needed

## Notes
- Backend handles prompt generation and JSON formatting
- Fallback to mock responses if API fails (as per summary)
