import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/EnhancedExamPage.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function EnhancedExamPage() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
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
      const response = await fetch(`${API_URL}/enhanced-exams/subjects`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSubjects(data.subjects || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      setSubjects([]);
    }
  };

  const generateExam = async () => {
    if (!selectedSubject) {
      setError('Please select a subject');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/enhanced-exams/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: selectedSubject,
          questionCount: parseInt(questionCount),
          difficulty: difficulty
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate exam');
      }

      if (!data.exam || !data.exam.questions) {
        throw new Error('Invalid exam data received');
      }

      setExam(data.exam);
      setExamStarted(true);
      setCurrentQuestion(0);
      setAnswers({});
    } catch (error) {
      console.error('Error generating exam:', error);
      setError(error.message || 'Failed to generate exam. Please try again.');
    } finally {
      setLoading(false);
    }
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
      const response = await fetch(`${API_URL}/enhanced-exams/submit-and-score`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: localStorage.getItem('userId') || 'guest',
          examId: exam.id,
          answers: Object.values(answers)
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit exam');
      }

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
            <h3>Your Score: {results.score}%</h3>
            <p>{results.correctAnswers} out of {results.totalQuestions} questions correct</p>
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
                <option key={subject.key} value={subject.key}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

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
            disabled={loading || !selectedSubject}
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
      <div className="exam-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentQuestion + 1) / exam.questions.length) * 100}%` }}
          ></div>
        </div>
        <p>Question {currentQuestion + 1} of {exam.questions.length}</p>
      </div>

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
