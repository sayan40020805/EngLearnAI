import EnhancedExam from "../models/EnhancedExam.js";
import Submission from "../models/Submission.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Available subjects
const SUBJECTS = {
  MATH: "Mathematics",
  SCIENCE: "Science",
  ENGLISH: "English",
  PHYSICS: "Physics",
  CHEMISTRY: "Chemistry",
  BIOLOGY: "Biology",
  COMPUTER: "Computer Science",
  HISTORY: "History",
  GEOGRAPHY: "Geography"
};

// POST /api/enhanced-exams/generate
export const generateExam = async (req, res) => {
  try {
    const { subject, questionCount, difficulty = "medium" } = req.body;

    if (!subject || !questionCount) {
      return res.status(400).json({ 
        success: false,
        error: "Subject and question count are required" 
      });
    }

    if (questionCount < 1 || questionCount > 50) {
      return res.status(400).json({ 
        success: false,
        error: "Question count must be between 1 and 50" 
      });
    }

    const prompt = `Generate ${questionCount} multiple choice questions for ${SUBJECTS[subject] || subject} at ${difficulty} difficulty level. 
    Each question should have 4 options (A, B, C, D) with one correct answer.
    Return the response in JSON format with this structure:
    {
      "questions": [
        {
          "question": "question text",
          "options": ["option1", "option2", "option3", "option4"],
          "correctAnswer": "A/B/C/D",
          "explanation": "brief explanation"
        }
      ]
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean and parse the response
    let examData;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Invalid response format from Gemini");
      }
      
      examData = JSON.parse(jsonMatch[0]);
      
      if (!examData.questions || !Array.isArray(examData.questions)) {
        throw new Error("Invalid questions format");
      }
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      return res.status(500).json({ 
        success: false,
        error: "Failed to parse exam data" 
      });
    }
    
    // Create enhanced exam in database
    const exam = new EnhancedExam({
      title: `${SUBJECTS[subject] || subject} Exam - ${questionCount} Questions`,
      subject: subject,
      questionCount: questionCount,
      difficulty: difficulty,
      questions: examData.questions,
      isGenerated: true
    });

    await exam.save();
    
    res.status(201).json({
      success: true,
      message: "Exam generated successfully",
      exam: {
        id: exam._id,
        title: exam.title,
        questions: exam.questions,
        subject: exam.subject,
        questionCount: exam.questionCount
      }
    });
  } catch (err) {
    console.error("Generate exam error:", err.message);
    res.status(500).json({ 
      success: false,
      error: "Failed to generate exam" 
    });
  }
};

// POST /api/enhanced-exams/submit-and-score
export const submitAndScoreExam = async (req, res) => {
  try {
    const { userId, examId, answers } = req.body;

    if (!userId || !examId || !answers) {
      return res.status(400).json({ 
        success: false,
        error: "Missing required fields" 
      });
    }

    const exam = await EnhancedExam.findById(examId);
    if (!exam) {
      return res.status(404).json({ 
        success: false,
        error: "Exam not found" 
      });
    }

    let correctAnswers = 0;
    const results = [];

    exam.questions.forEach((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) correctAnswers++;
      
      results.push({
        question: question.question,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation
      });
    });

    const score = (correctAnswers / exam.questions.length) * 100;
    
    const submission = new Submission({
      userId,
      examId,
      answers,
      score,
      results,
      submittedAt: new Date()
    });

    await submission.save();

    res.status(201).json({
      success: true,
      message: "Exam submitted successfully",
      score: Math.round(score),
      correctAnswers,
      totalQuestions: exam.questions.length,
      results
    });
  } catch (err) {
    console.error("Submit and score exam error:", err.message);
    res.status(500).json({ 
      success: false,
      error: "Failed to submit exam" 
    });
  }
};

// GET /api/enhanced-exams/subjects
export const getAvailableSubjects = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      subjects: Object.entries(SUBJECTS).map(([key, value]) => ({
        key,
        name: value
      }))
    });
  } catch (err) {
    console.error("Get subjects error:", err.message);
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch subjects" 
    });
  }
};

// GET /api/enhanced-exams/user/:userId/history
export const getUserExamHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const submissions = await Submission.find({ userId })
      .populate('examId', 'title subject questionCount')
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      submissions
    });
  } catch (err) {
    console.error("Get user exam history error:", err.message);
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch exam history" 
    });
  }
};
