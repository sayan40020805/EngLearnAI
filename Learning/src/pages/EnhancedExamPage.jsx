import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import API from '../utils/api';
import '../styles/EnhancedExamPage.css';

export default function EnhancedExamPage() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [subjectMode, setSubjectMode] = useState('select');
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
    const fetchSubjects = async () => {
      try {
        const response = await API.get('/api/enhanced-exams/subjects');
        setSubjects(response.data.subjects || []);
      } catch (err) {
        console.error('Failed to fetch subjects', err);
      }
    };
    fetchSubjects();
  }, []);

  const generateExam = async () => {
    const subjectToUse = subjectMode === 'select' ? selectedSubject : customSubject.trim();
    if (!subjectToUse) {
      setError(subjectMode === 'select' ? 'Please select a subject' : 'Please enter a subject');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        subject: subjectToUse,
        questionCount,
        difficulty,
      };

      const response = await API.post('/api/enhanced-exams/generate', payload);

      const examData = response.data?.exam;
      const questions = examData?.questions;

      if (!Array.isArray(questions)) {
        throw new Error("Invalid response format from the server. Expected an array of questions.");
      }

      // Assign IDs
      const questionsWithId = questions.map((q, i) => ({
        ...q,
        _id: q._id || `q${i + 1}`,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer, // Ensure these fields exist in the API response
        explanation: q.explanation,     // Ensure these fields exist in the API response
      }));

      setExam({ ...examData, questions: questionsWithId });
      setExamStarted(true);
      setCurrentQuestion(0);
      setAnswers({});
      setLoading(false);
    } catch (err) {
      console.error('Error generating exam:', err);
      setError(err.message || 'Failed to generate quiz. Please try again or change topic.');
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
    const userId = user?._id || user?.user?._id || user?.id;

    const answersPayload = Object.keys(answers).map(questionIndex => ({
      questionId: exam.questions[questionIndex]._id,
      answer: answers[questionIndex]
    }));

    const resultPayload = {
      userId,
      examId: exam.id || exam._id,
      answers: answersPayload
    };

    setLoading(true);
    try {
      const response = await API.post('/api/enhanced-exams/submit-and-score', resultPayload);
      const { score, totalQuestions, percentage, results: detailedResults } = response.data;

      const safeDetailedResults = Array.isArray(detailedResults) ? detailedResults : [];

      setResults({
        score,
        totalQuestions,
        percentage,
        results: safeDetailedResults
      });

      // Dispatch event to refresh dashboard
      window.dispatchEvent(new Event('examSubmitted'));
      setExamStarted(false);
    } catch (err) {
      console.error('Failed to submit exam', err);
      setError(err.response?.data?.error || 'Failed to submit exam.');
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
            <p>{results.score} out of {results.totalQuestions} correct</p>
          </div>

          <div className="results-details">
            {Array.isArray(results.results) && results.results.map((r, i) => (
              <div key={i} className={`result-item ${r.isCorrect ? 'correct' : 'incorrect'}`}>
                <h4>Q{i + 1}. {r.question}</h4>
                <p><strong>Your Answer:</strong> {r.userAnswer || 'Not Answered'}</p>
                <p><strong>Correct:</strong> {r.correctAnswer}</p>
                {!r.isCorrect && <p><strong>Explanation:</strong> {r.explanation}</p>}
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
            <div className="error-message" style={{color: 'red', whiteSpace: 'pre-wrap'}}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label>Subject Mode:</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <label>
                <input
                  type="radio"
                  value="select"
                  checked={subjectMode === 'select'}
                  onChange={(e) => setSubjectMode(e.target.value)}
                /> Select
              </label>
              <label>
                <input
                  type="radio"
                  value="custom"
                  checked={subjectMode === 'custom'}
                  onChange={(e) => setSubjectMode(e.target.value)}
                /> Custom
              </label>
            </div>
          </div>

          {subjectMode === 'select' ? (
            <div className="form-group">
              <label>Select Subject:</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="form-control"
              >
                <option value="">Choose a subject</option>
                {subjects.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          ) : (
            <div className="form-group">
              <label>Enter Subject:</label>
              <input
                type="text"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                className="form-control"
                placeholder="e.g., Artificial Intelligence"
              />
            </div>
          )}

          <div className="form-group">
            <label>Number of Questions:</label>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value, 10))}
              className="form-control"
            >
              {[5, 10, 15, 20].map(n => <option key={n} value={n}>{n} Questions</option>)}
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
            disabled={loading}
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
          <button onClick={restartExam} className="btn-primary">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="exam-container">
      <div className="exam-question">
        <h3>{exam.questions[currentQuestion]?.question}</h3>
        <div className="options">
          {exam.questions[currentQuestion]?.options?.map((opt, i) => {
            const letter = String.fromCharCode(65 + i);
            return (
              <div key={i} className="option">
                <label>
                  <input
                    type="radio"
                    name={`question-${currentQuestion}`}
                    value={letter}
                    checked={answers[currentQuestion] === letter}
                    onChange={(e) => handleAnswerSelect(currentQuestion, e.target.value)}
                  />
                  <span>{letter}) {opt}</span>
                </label>
              </div>
            );
          })}
        </div>

        <div className="navigation-buttons">
          <button onClick={handlePreviousQuestion} disabled={currentQuestion === 0} className="btn-secondary">Previous</button>
          {currentQuestion === exam.questions.length - 1 ? (
            <button onClick={submitExam} disabled={loading} className="btn-primary">{loading ? 'Submitting...' : 'Submit'}</button>
          ) : (
            <button onClick={handleNextQuestion} className="btn-primary">Next</button>
          )}
        </div>
      </div>
    </div>
  );
}
