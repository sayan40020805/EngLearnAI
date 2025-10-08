import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import './TopicQuizGenerator.css';

const TopicQuizGenerator = () => {
  const [topic, setTopic] = useState('');
  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty, setDifficulty] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const checkForDuplicates = (questions) => {
    const questionTexts = questions.map(q => q.question.toLowerCase().trim());
    const uniqueQuestions = new Set(questionTexts);
    return uniqueQuestions.size === questions.length;
  };

  const handleGenerateQuiz = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Construct a highly detailed message to ensure unique questions
      const message = `Generate a quiz with EXACTLY ${questionCount} COMPLETELY UNIQUE questions on the topic: "${topic}".

CRITICAL UNIQUENESS REQUIREMENTS:
- Each question must be about a DIFFERENT sub-topic, concept, or aspect of "${topic}"
- NO TWO questions can be similar or related in any way
- Questions must cover ${questionCount} distinct areas within "${topic}"
- If generating about programming, each question must be about a different function/method/concept
- If generating about data structures, each question must be about a different data structure or operation

QUESTION VARIETY REQUIREMENTS:
1. Question 1: Focus on [specific sub-topic 1 within ${topic}]
2. Question 2: Focus on [specific sub-topic 2 within ${topic}]
3. Question 3: Focus on [specific sub-topic 3 within ${topic}]
${questionCount > 3 ? `4. Question 4: Focus on [specific sub-topic 4 within ${topic}]` : ''}
${questionCount > 4 ? `5. Question 5: Focus on [specific sub-topic 5 within ${topic}]` : ''}
${questionCount > 5 ? Array.from({length: questionCount - 5}, (_, i) => `${i + 6}. Question ${i + 6}: Focus on [specific sub-topic ${i + 6} within ${topic}]`).join('\n') : ''}

DIFFICULTY LEVEL: ${difficulty}
- Easy: Basic definitions, simple concepts, fundamental knowledge
- Medium: Application, comparisons, intermediate understanding
- Hard: Complex scenarios, advanced analysis, expert-level knowledge

AVOID THESE COMMON MISTAKES:
- DO NOT ask "What is the basic concept of ${topic}?"
- DO NOT ask "What are the main features of ${topic}?"
- DO NOT ask "Why is ${topic} important?"
- DO NOT repeat similar question patterns
- DO NOT use generic questions that could apply to multiple topics

REQUIRED FORMAT - STRICT JSON ONLY:
{
  "questions": [
    {
      "question": "Specific question about [unique sub-topic 1]",
      "options": [
        "Detailed correct answer for [unique sub-topic 1]",
        "Detailed incorrect answer 1 for [unique sub-topic 1]",
        "Detailed incorrect answer 2 for [unique sub-topic 1]",
        "Detailed incorrect answer 3 for [unique sub-topic 1]"
      ],
      "correctAnswer": 0,
      "explanation": "Why option 0 is correct and others are wrong, specific to [unique sub-topic 1]"
    }
  ]
}

VALIDATION: Ensure each question is completely unique and tests different knowledge areas.`;

      // Use the backend proxy for deepseek
      const response = await API.post('/api/deepseek/ask', { message });

      // The proxy returns text, so we use response.data directly
      const generatedText = response.data;

      if (generatedText) {
        // Parse the AI response JSON string to an object
        let quizData;
        try {
          // Try to extract JSON from the response
          const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            quizData = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error('No JSON found in response');
          }
        } catch (parseError) {
          console.error('Parse error:', parseError);
          setError('Failed to parse quiz data from AI response. Please try again.');
          setLoading(false);
          return;
        }

        // Validate the quiz data structure
        if (!quizData.questions || !Array.isArray(quizData.questions) || quizData.questions.length !== questionCount) {
          setError('Invalid quiz data received. Please try again.');
          setLoading(false);
          return;
        }

        // Check for duplicate questions
        if (!checkForDuplicates(quizData.questions)) {
          setError('Generated quiz contains duplicate questions. Please try again.');
          setLoading(false);
          return;
        }

        // Validate each question has proper structure
        for (let i = 0; i < quizData.questions.length; i++) {
          const q = quizData.questions[i];
          if (!q.question || !Array.isArray(q.options) || q.options.length !== 4 || typeof q.correctAnswer !== 'number') {
            setError('Invalid question format received. Please try again.');
            setLoading(false);
            return;
          }
        }

        // Add additional metadata expected by TopicQuizPage
        quizData.topic = topic;
        quizData.totalQuestions = questionCount;
        quizData.totalTime = questionCount * 2; // 2 minutes per question
        quizData.timePerQuestion = 2;
        quizData.difficulty = difficulty;

        // Navigate to quiz page with the generated quiz data
        navigate('/topic-quiz', { state: { quizData } });
      } else {
        setError('Failed to generate quiz. Please try again.');
      }
    } catch (err) {
      console.error('Quiz generation error:', err);
      setError(err.message || 'Failed to generate quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const questionOptions = [5, 10, 15, 20];
  const difficultyOptions = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
  ];

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

        <div className="form-group">
          <label htmlFor="difficulty">Difficulty Level:</label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="difficulty-select"
          >
            {difficultyOptions.map(option => (
              <option key={option.value} value={option.label}>
                {option.label}
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
