import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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

  const handleSubmitQuiz = () => {
    setQuizFinished(true);
    setShowResults(true);
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
        
        <button onClick={() => navigate('/topic-quiz-generator')} className="retry-btn">
          Try Another Quiz
        </button>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="quiz-start">
        <h2>Topic: {quizData.topic}</h2>
        <div className="quiz-info">
          <p>Questions: {quizData.totalQuestions}</p>
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
            <button onClick={handleSubmitQuiz} className="submit-btn">
              Submit Quiz
            </button>
          ) : (
            <button onClick={handleNextQuestion} className="nav-btn">
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopicQuizPage;
