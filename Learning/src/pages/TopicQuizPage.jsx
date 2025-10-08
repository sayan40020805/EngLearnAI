import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from "../utils/api";
import './TopicQuizPage.css';

const TopicQuizPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { quizData } = location.state || {};

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!quizData) {
      navigate('/');
      return;
    }

    // Convert total time from minutes to seconds
    setTimeLeft(quizData.totalTime * 60);
  }, [quizData, navigate]);

  useEffect(() => {
    if (!quizStarted || quizFinished) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setQuizFinished(true);
          setShowResults(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, quizFinished]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    setLoading(true);
    setError('');

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

      const score = calculateScore();
      const percentage = Math.round((score / quizData.questions.length) * 100);

      // Save quiz results to backend
      const response = await API.post("/api/topic-quiz/save-result", {
        userId: userId || 'guest',
        topic: quizData.topic,
        difficulty: quizData.difficulty || 'medium',
        totalQuestions: quizData.questions.length,
        correctAnswers: score,
        percentage: percentage,
        answers: Object.keys(selectedAnswers).map(index => ({
          questionIndex: parseInt(index),
          selectedAnswer: selectedAnswers[index],
          correctAnswer: quizData.questions[parseInt(index)].correctAnswer
        }))
      });

      if (response.data.success) {
        setQuizFinished(true);
        setShowResults(true);

        // Trigger dashboard refresh
        window.dispatchEvent(new CustomEvent('examSubmitted'));
      } else {
        setError('Failed to save quiz results. Please try again.');
      }
    } catch (err) {
      console.error('Error saving quiz results:', err);
      setError(err.message || 'Failed to save quiz results. Please try again.');
      // Still show results even if saving failed
      setQuizFinished(true);
      setShowResults(true);
    } finally {
      setLoading(false);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    quizData.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  if (!quizData) {
    return <div>Loading...</div>;
  }

  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / quizData.questions.length) * 100);

    return (
      <div className="quiz-results">
        <h2>Quiz Results</h2>
        <div className="score-display">
          <h3>Your Score: {score}/{quizData.questions.length} ({percentage}%)</h3>
        </div>

        <div className="results-breakdown">
          {quizData.questions.map((question, index) => (
            <div key={index} className="result-item">
              <h4>Question {index + 1}: {question.question}</h4>
              <p>Your answer: {question.options[selectedAnswers[index]] || 'Not answered'}</p>
              <p>Correct answer: {question.options[question.correctAnswer]}</p>
              <p className="explanation">{question.explanation}</p>
            </div>
          ))}
        </div>

        <div className="action-buttons">
          <button onClick={() => navigate('/topic-quiz-generator')} className="retry-btn">
            Try Another Quiz
          </button>
          <button onClick={() => navigate('/dashboard')} className="dashboard-btn">
            View Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="quiz-start">
        <h2>Topic: {quizData.topic}</h2>
        <div className="quiz-info">
          <p>Questions: {quizData.totalQuestions}</p>
          <p>Difficulty: {quizData.difficulty || 'Medium'}</p>
          <p>Total Time: {quizData.totalTime} minutes</p>
          <p>Time per Question: {quizData.timePerQuestion} minutes</p>
        </div>
        <button onClick={() => setQuizStarted(true)} className="start-btn">
          Start Quiz
        </button>
      </div>
    );
  }

  const currentQuestion = quizData.questions[currentQuestionIndex];

  return (
    <div className="quiz-page">
      <div className="quiz-header">
        <h2>Topic: {quizData.topic}</h2>
        <div className="quiz-stats">
          <span>Question {currentQuestionIndex + 1} of {quizData.questions.length}</span>
          <span className="timer">Time: {formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="question-container">
        <h3>{currentQuestion.question}</h3>

        <div className="options">
          {currentQuestion.options.map((option, index) => (
            <label key={index} className="option">
              <input
                type="radio"
                name={`question-${currentQuestionIndex}`}
                value={index}
                checked={selectedAnswers[currentQuestionIndex] === index}
                onChange={() => handleAnswerSelect(currentQuestionIndex, index)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>

        <div className="navigation">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="nav-btn"
          >
            Previous
          </button>

          {currentQuestionIndex === quizData.questions.length - 1 ? (
            <button onClick={handleSubmitQuiz} disabled={loading} className="submit-btn">
              {loading ? 'Submitting...' : 'Submit Quiz'}
            </button>
          ) : (
            <button onClick={handleNextQuestion} className="nav-btn">
              Next
            </button>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default TopicQuizPage;
