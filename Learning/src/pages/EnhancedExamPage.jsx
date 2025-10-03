import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from "../utils/api";
import '../styles/EnhancedExamPage.css';

export default function EnhancedExamPage() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [subjectMode, setSubjectMode] = useState('select'); // 'select' or 'custom'
  const [questionCount, setQuestionCount] = useState(10);
  const [difficulty, setDifficulty] = useState('medium');
  const [exam, setExam] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await API.get("/api/enhanced-exams/subjects");
      setSubjects(response.data.subjects || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      setSubjects([]);
    }
  };

  const generateExam = async () => {
    const subjectToUse = subjectMode === 'select' ? selectedSubject : customSubject.trim();
    if (!subjectToUse) {
      setError(subjectMode === 'select' ? 'Please select a subject' : 'Please enter a subject');
      return;
    }

    setLoading(true);
    setError(null);

    const maxRetries = 3;
    let attempt = 0;
    let lastError = null;

    while (attempt < maxRetries) {
      try {
        const response = await API.post("/api/enhanced-exams/generate", {
          subject: subjectToUse,
          questionCount: parseInt(questionCount),
          difficulty: difficulty
        });

        const data = response.data;

        if (!data.exam || !data.exam.questions) {
          throw new Error('Invalid exam data received');
        }

        // Map questions to include _id for frontend usage if missing
        const questionsWithId = data.exam.questions.map((q, index) => ({
          _id: q._id || `q${index + 1}`,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation
        }));

        setExam({
          ...data.exam,
          questions: questionsWithId
        });
        setExamStarted(true);
        setCurrentQuestion(0);
        setAnswers({});
        return; // Success, exit
      } catch (error) {
        console.error(`Error generating exam (attempt ${attempt + 1}):`, error);
        lastError = error;

        // Check if it's a server error (5xx) or network error, retry
        if (error.response && error.response.status >= 500) {
          attempt++;
          if (attempt < maxRetries) {
            const delay = Math.pow(2, attempt) * 1000; // Exponential backoff: 1s, 2s, 4s
            setError(`Server error. Retrying in ${delay / 1000} seconds... (Attempt ${attempt + 1}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
        } else {
          // Client error or other, don't retry
          break;
        }
      }
    }

    // If we reach here, all retries failed or non-retryable error
    let errorMessage = 'Failed to generate exam. Please try again.';
    if (lastError.response) {
      errorMessage = `Server Error: ${lastError.response.data.message || 'Please try again later.'}`;
    } else if (lastError.code === 'NETWORK_ERROR') {
      errorMessage = 'Network error. Please check your connection and try again.';
    }
    setError(errorMessage);
    setLoading(false);
  };

  const handleAnswerSelect = (questionIndex, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < exam.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const submitExam = async () => {
    if (Object.keys(answers).length !== exam.questions.length) {
      const confirmSubmit = window.confirm(
        `You have answered ${Object.keys(answers).length} out of ${exam.questions.length} questions. Do you want to submit anyway?`
      );
      if (!confirmSubmit) return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const storedUser = localStorage.getItem('user');
      let userId;
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          userId = parsedUser?._id || parsedUser?.id;
        } catch (e) {
          console.error("Failed to parse user from localStorage", e);
        }
      }
      const response = await API.post("/api/enhanced-exams/submit-and-score", {
        userId: userId || 'guest',
        examId: exam.id || exam._id,
        answers: Object.keys(answers).map(index => ({
          questionId: exam.questions[parseInt(index)]._id,
          answer: answers[index]
        }))
      });

      const data = response.data;
      
      setResults(data);
      setExamStarted(false);
      
      // Trigger dashboard refresh
      window.dispatchEvent(new CustomEvent('examSubmitted'));
    } catch (error) {
      console.error('Error submitting exam:', error);
      setError(error.message || 'Failed to submit exam. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const restartExam = () => {
    setExam(null);
    setCurrentQuestion(0);
    setAnswers({});
    setResults(null);
    setExamStarted(false);
    setError(null);
  };

  if (results) {
    return (
      <div className="exam-container">
        <div className="results-card">
          <h2>Exam Results</h2>
          <div className="score-display">
            <h3>Your Score: {results.percentage}%</h3>
            <p>{results.score} out of {results.totalQuestions} questions correct</p>
          </div>
          
          <div className="results-details">
            {results.results.map((result, index) => (
              <div key={index} className={`result-item ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                <h4>Question {index + 1}</h4>
                <p>{result.question}</p>
                <p><strong>Your Answer:</strong> {result.userAnswer}</p>
                <p><strong>Correct Answer:</strong> {result.correctAnswer}</p>
                {!result.isCorrect && <p><strong>Explanation:</strong> {result.explanation}</p>}
              </div>
            ))}
          </div>

          <div className="action-buttons">
            <button onClick={restartExam} className="btn-primary">Take Another Exam</button>
            <button onClick={() => navigate('/')} className="btn-secondary">Back to Home</button>
          </div>
        </div>
      </div>
    );
  }

  if (!examStarted) {
    return (
      <div className="exam-container">
        <div className="exam-setup">
          <h2>Generate Your Custom Exam</h2>
          
          {error && (
            <div className="error-message" style={{color: 'red', marginBottom: '1rem'}}>
              {error}
            </div>
          )}
          
          <div className="form-group">
            <label>Subject Selection Mode:</label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <label>
                <input
                  type="radio"
                  value="select"
                  checked={subjectMode === 'select'}
                  onChange={(e) => setSubjectMode(e.target.value)}
                />
                Select from list
              </label>
              <label>
                <input
                  type="radio"
                  value="custom"
                  checked={subjectMode === 'custom'}
                  onChange={(e) => setSubjectMode(e.target.value)}
                />
                Enter custom subject
              </label>
            </div>
          </div>

          {subjectMode === 'select' ? (
            <div className="form-group">
              <label>Select Subject:</label>
              <select
                value={selectedSubject}
                onChange={(e) => {
                  setSelectedSubject(e.target.value);
                  setError(null);
                }}
                className="form-control"
              >
                <option value="">Choose a subject</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="form-group">
              <label>Enter Subject:</label>
              <input
                type="text"
                value={customSubject}
                onChange={(e) => {
                  setCustomSubject(e.target.value);
                  setError(null);
                }}
                className="form-control"
                placeholder="e.g., Artificial Intelligence"
              />
            </div>
          )}

          <div className="form-group">
            <label>Number of Questions:</label>
            <select 
              value={questionCount} 
              onChange={(e) => setQuestionCount(e.target.value)}
              className="form-control"
            >
              <option value={5}>5 Questions</option>
              <option value={10}>10 Questions</option>
              <option value={15}>15 Questions</option>
              <option value={20}>20 Questions</option>
            </select>
          </div>

          <div className="form-group">
            <label>Difficulty Level:</label>
            <select 
              value={difficulty} 
              onChange={(e) => setDifficulty(e.target.value)}
              className="form-control"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <button
            onClick={generateExam}
            disabled={loading || !(subjectMode === 'select' ? selectedSubject : customSubject.trim())}
            className="btn-primary"
          >
            {loading ? 'Generating...' : 'Generate Exam'}
          </button>
        </div>
      </div>
    );
  }

  if (!exam || !exam.questions) {
    return (
      <div className="exam-container">
        <div className="error-message">
          <h2>Error Loading Exam</h2>
          <p>Unable to load exam questions. Please try again.</p>
          <button onClick={restartExam} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="exam-container">
      {/* Removed exam-progress section with progress bar */}
      {/* <div className="exam-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentQuestion + 1) / exam.questions.length) * 100}%` }}
          ></div>
        </div>
        <p>Question {currentQuestion + 1} of {exam.questions.length}</p>
      </div> */}

      <div className="exam-question">
        <h3>{exam.questions[currentQuestion]?.question}</h3>
        
        <div className="options">
          {exam.questions[currentQuestion]?.options?.map((option, index) => (
            <div key={index} className="option">
              <label>
                <input
                  type="radio"
                  name={`question-${currentQuestion}`}
                  value={String.fromCharCode(65 + index)} // A, B, C, D
                  checked={answers[currentQuestion] === String.fromCharCode(65 + index)}
                  onChange={(e) => handleAnswerSelect(currentQuestion, e.target.value)}
                />
                <span>{option}</span>
              </label>
            </div>
          ))}
        </div>

        <div className="navigation-buttons">
          <button 
            onClick={handlePreviousQuestion} 
            disabled={currentQuestion === 0}
            className="btn-secondary"
          >
            Previous
          </button>
          
          {currentQuestion === exam.questions.length - 1 ? (
            <button 
              onClick={submitExam} 
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Submitting...' : 'Submit Exam'}
            </button>
          ) : (
            <button 
              onClick={handleNextQuestion}
              className="btn-primary"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
