import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TopicQuizGenerator.css';

const TopicQuizGenerator = () => {
  const [topic, setTopic] = useState('');
  const [questionCount, setQuestionCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGenerateQuiz = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/topic-quiz/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic, questionCount }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate quiz');
      }

      const data = await response.json();
      
      // Navigate to quiz page with the generated quiz data
      navigate('/topic-quiz', { state: { quizData: data } });
      
    } catch (err) {
      setError(err.message || 'Failed to generate quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const questionOptions = [5, 10, 15, 20];

  return (
    <div className="topic-quiz-generator">
      <h2>Generate Custom Topic Quiz</h2>
      <p>Enter any topic and select how many questions you want to solve!</p>
      
      <form onSubmit={handleGenerateQuiz} className="quiz-form">
        <div className="form-group">
          <label htmlFor="topic">Topic Name:</label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Data Structures, React Hooks, Machine Learning"
            required
            className="topic-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="questionCount">Number of Questions:</label>
          <select
            id="questionCount"
            value={questionCount}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
            className="question-select"
          >
            {questionOptions.map(count => (
              <option key={count} value={count}>
                {count} questions ({count * 2} minutes)
              </option>
            ))}
          </select>
        </div>

        <div className="timing-info">
          <p>Total time: {questionCount * 2} minutes ({2} minutes per question)</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" disabled={loading || !topic} className="generate-btn">
          {loading ? 'Generating...' : 'Generate Quiz'}
        </button>
      </form>

      <div className="example-topics">
        <h3>Example Topics:</h3>
        <div className="topic-chips">
          <span onClick={() => setTopic('Data Structures')}>Data Structures</span>
          <span onClick={() => setTopic('React Hooks')}>React Hooks</span>
          <span onClick={() => setTopic('Machine Learning')}>Machine Learning</span>
          <span onClick={() => setTopic('Node.js')}>Node.js</span>
          <span onClick={() => setTopic('CSS Flexbox')}>CSS Flexbox</span>
          <span onClick={() => setTopic('JavaScript Promises')}>JavaScript Promises</span>
        </div>
      </div>
    </div>
  );
};

export default TopicQuizGenerator;
