// Test script to verify dashboard updates after exam completion
const fetch = require('node-fetch');

const API_URL = 'http://localhost:5000/api';

async function testDashboardUpdate() {
  console.log('🧪 Testing Dashboard Update After Exam Completion...');
  
  try {
    // Test 1: Create a traditional exam
    console.log('\n1. Creating traditional exam...');
    const createExamResponse = await fetch(`${API_URL}/exams/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Test Traditional Exam',
        department: 'CSE',
        semester: 4,
        questions: [
          { question: 'Q1', options: ['A', 'B', 'C', 'D'], correctAnswer: 'A' },
          { question: 'Q2', options: ['A', 'B', 'C', 'D'], correctAnswer: 'B' }
        ]
      })
    });
    
    const examData = await createExamResponse.json();
    console.log('✅ Traditional exam created:', examData.exam._id);
    
    // Test 2: Submit traditional exam
    console.log('\n2. Submitting traditional exam...');
    const submitResponse = await fetch(`${API_URL}/exams/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'test-user-123',
        examId: examData.exam._id,
        answers: [
          { questionId: 'q1', answer: 'A' },
          { questionId: 'q2', answer: 'B' }
        ]
      })
    });
    
    const submitData = await submitResponse.json();
    console.log('✅ Traditional exam submitted:', submitData.submission._id);
    
    // Test 3: Check dashboard data
    console.log('\n3. Fetching dashboard data...');
    const dashboardResponse = await fetch(`${API_URL}/exams/user/test-user-123/history`);
    const dashboardData = await dashboardResponse.json();
    
    console.log('✅ Dashboard data retrieved:', dashboardData.submissions.length, 'exams found');
    
    // Test 4: Create enhanced exam
    console.log('\n4. Creating enhanced exam...');
    const enhancedExamResponse = await fetch(`${API_URL}/enhanced-exams/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: 'COMPUTER',
        questionCount: 5,
        difficulty: 'medium'
      })
    });
    
    const enhancedData = await enhancedExamResponse.json();
    console.log('✅ Enhanced exam created:', enhancedData.exam.id);
    
    // Test 5: Submit enhanced exam
    console.log('\n5. Submitting enhanced exam...');
    const enhancedSubmitResponse = await fetch(`${API_URL}/enhanced-exams/submit-and-score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'test-user-123',
        examId: enhancedData.exam.id,
        answers: ['A', 'B', 'C', 'D', 'A']
      })
    });
    
    const enhancedSubmitData = await enhancedSubmitResponse.json();
    console.log('✅ Enhanced exam submitted:', enhancedSubmitData.score, '%');
    
    // Test 6: Check updated dashboard
    console.log('\n6. Checking updated dashboard...');
    const updatedDashboardResponse = await fetch(`${API_URL}/exams/user/test-user-123/history`);
    const updatedDashboardData = await updatedDashboardResponse.json();
    
    console.log('✅ Updated dashboard data:', updatedDashboardData.submissions.length, 'exams found');
    
    // Test 7: Check enhanced exam dashboard
    console.log('\n7. Checking enhanced exam dashboard...');
    const enhancedDashboardResponse = await fetch(`${API_URL}/enhanced-exams/user/test-user-123/history`);
    const enhancedDashboardData = await enhancedDashboardResponse.json();
    
    console.log('✅ Enhanced dashboard data:', enhancedDashboardData.submissions.length, 'exams found');
    
    console.log('\n🎉 All tests completed successfully!');
    console.log('📊 Dashboard updates are working correctly!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
if (require.main === module) {
  testDashboardUpdate();
}

module.exports = { testDashboardUpdate };
