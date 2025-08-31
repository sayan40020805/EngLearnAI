import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from "../utils/api";
import '../styles/Exam.css';

const TraditionalExamList = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await API.get("/api/exams");
      setExams(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching exams:', error);
      setError('Failed to load exams. Please try again later.');
      setLoading(false);
    }
  };

  const startExam = (exam) => {
    setSelectedExam(exam);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setResults(null);
  };

  const handleAnswerSelect = (questionIndex, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const submitExam = async () => {
    if (!selectedExam) return;

    let correctAnswers = 0;
    const detailedResults = selectedExam.questions.map((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) correctAnswers++;

      return {
        question: question.question,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect
      };
    });

    const score = (correctAnswers / selectedExam.questions.length) * 100;

    setResults({
      score: Math.round(score),
      correctAnswers,
      totalQuestions: selectedExam.questions.length,
      detailedResults
    });
    setShowResults(true);

    // Submit to backend to save history
    try {
      await API.post("/api/exams/submit", {
        userId: localStorage.getItem('userId') || 'guest',
        examId: selectedExam._id,
        answers: Object.values(answers)
      });

      // Dispatch event to refresh dashboard
      window.dispatchEvent(new CustomEvent('examSubmitted'));
    } catch (error) {
      console.error('Error submitting exam:', error);
    }
  };

  const resetExam = () => {
    setSelectedExam(null);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setResults(null);
  };

  if (loading) {
    return (
      <div className="exam-container">
        <div className="loading">Loading available exams...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="exam-container">
        <div className="error">{error}</div>
        <button onClick={fetchExams} className="btn-primary">Retry</button>
      </div>
    );
  }

  if (selectedExam && !showResults) {
    const question = selectedExam.questions[currentQuestion];
    
    return (
      <div className="exam-container">
        <div className="exam-header">
          <h2>{selectedExam.title}</h2>
          {/* Removed progress text */}
          {/* <div className="progress">
            Question {currentQuestion + 1} of {selectedExam.questions.length}
          </div> */}
        </div>

        <div className="question-card">
          <h3>{question.question}</h3>
          
          <div className="options">
            {question.options.map((option, index) => (
              <label key={index} className="option">
                <input
                  type="radio"
                  name={`question-${currentQuestion}`}
                  value={option}
                  checked={answers[currentQuestion] === option}
                  onChange={(e) => handleAnswerSelect(currentQuestion, e.target.value)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>

          <div className="navigation">
            <button 
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className="btn-secondary"
            >
              Previous
            </button>
            
            {currentQuestion === selectedExam.questions.length - 1 ? (
              <button onClick={submitExam} className="btn-primary">
                Submit Exam
              </button>
            ) : (
              <button 
                onClick={() => setCurrentQuestion(prev => Math.min(selectedExam.questions.length - 1, prev + 1))}
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

  if (showResults && results) {
    return (
      <div className="exam-container">
        <div className="results-card">
          <h2>Exam Results</h2>
          <div className="score-display">
            <h3>Your Score: {results.score}%</h3>
            <p>{results.correctAnswers} out of {results.totalQuestions} questions correct</p>
          </div>

          <div className="results-details">
            {results.detailedResults.map((result, index) => (
              <div key={index} className={`result-item ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                <h4>Question {index + 1}</h4>
                <p>{result.question}</p>
                <p><strong>Your Answer:</strong> {result.userAnswer || 'Not answered'}</p>
                <p><strong>Correct Answer:</strong> {result.correctAnswer}</p>
              </div>
            ))}
          </div>

          <div className="action-buttons">
            <button onClick={resetExam} className="btn-primary">Take Another Exam</button>
            <button onClick={() => navigate('/')} className="btn-secondary">Back to Home</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="exam-container">
      <h2>Available Exams</h2>
      
      {exams.length === 0 ? (
        <div className="no-exams">
          <p>No exams available at the moment.</p>
          <p>Please check back later or contact your administrator.</p>
        </div>
      ) : (
        <div className="exam-grid">
          {exams.map(exam => (
            <div key={exam._id} className="exam-card">
              <h3>{exam.title}</h3>
              <p><strong>Department:</strong> {exam.department}</p>
              <p><strong>Semester:</strong> {exam.semester}</p>
              <p><strong>Questions:</strong> {exam.questions.length}</p>
              <button onClick={() => startExam(exam)} className="btn-primary">
                Start Exam
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TraditionalExamList;
