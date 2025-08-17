# Enhanced Course Management System with Free Certificate Integration

## Overview
This system has been enhanced to provide a comprehensive course management platform that links academic courses with free certificate courses from various platforms like Udemy, Unacademy, DataFlair, Coursera, edX, YouTube, and FreeCodeCamp.

## Features

### 1. Course Organization by Programming Languages
- **Java Track**: Core Java, Advanced Java, Spring Framework
- **Python Track**: Python Basics, Python Advanced, Django/Flask
- **C Track**: C Programming, C++, Data Structures
- **C++ Track**: Object-oriented programming with C++
- **JavaScript Track**: Web development with JavaScript
- **SQL Track**: Database programming and management

### 2. Free Certificate Course Integration
- Links academic courses with relevant free certificate courses
- Supports multiple platforms: Udemy, Unacademy, DataFlair, Coursera, edX, YouTube, FreeCodeCamp
- Provides direct links to courses and certificates
- Includes course duration, difficulty level, and ratings

### 3. Advanced Filtering and Search
- Filter by programming language
- Filter by platform
- Filter by difficulty level (Beginner, Intermediate, Advanced)
- Filter by category (Programming, Web Development, Data Science, etc.)

## Setup Instructions

### 1. Install Dependencies
```bash
# Backend
cd gemini-backend
npm install

# Frontend
cd Learning
npm install
```

### 2. Environment Setup
Create a `.env` file in the `gemini-backend` directory:
```
MONGO_URI=your_mongodb_connection_string
PORT=5000
YOUTUBE_API_KEY=your_youtube_api_key
```

### 3. Seed Sample Data
```bash
cd gemini-backend
node seeds/seedData.js
```

### 4. Start the Application
```bash
# Terminal 1 - Backend
cd gemini-backend
npm start

# Terminal 2 - Frontend
cd Learning
npm run dev
```

## API Endpoints

### Enhanced Course Endpoints
- `GET /api/enhanced-courses` - Get all enhanced courses
- `GET /api/enhanced-courses/language/:language` - Get courses by programming language
- `GET /api/enhanced-courses/:id` - Get single course with certificate courses
- `POST /api/enhanced-courses` - Create new enhanced course
- `POST /api/enhanced-courses/link-certificate` - Link certificate course to enhanced course

### Certificate Course Endpoints
- `GET /api/certificate-courses` - Get all free certificate courses
- `POST /api/certificate-courses` - Create new certificate course

## Frontend Components

### 1. EnhancedCourseList.jsx
- Displays courses organized by programming languages
- Shows linked certificate courses for each academic course
- Provides filtering by language

### 2. CertificateCourseFinder.jsx
- Dedicated page for finding free certificate courses
- Advanced filtering by language, platform, and level
- Direct links to courses and certificates

## Usage Examples

### Finding Java Courses with Certificates
1. Navigate to the Enhanced Course List
2. Select "Java" from the language filter
3. View all Java courses with linked free certificate courses
4. Click on certificate links to access free courses

### Finding Python Certificate Courses
1. Go to Certificate Course Finder
2. Select "Python" as the language
3. Optionally filter by platform (e.g., Coursera, FreeCodeCamp)
4. Click "Start Course" to begin learning
5. Click "Get Certificate" to claim your free certificate

## Sample Data Included

### Java Courses
- **CS101**: Introduction to Programming (Java)
  - Linked with: Java Programming Masterclass (Udemy), Java Fundamentals (Unacademy)

- **CS102**: Advanced Java Programming
  - Linked with: Advanced Java Programming (DataFlair)

### Python Courses
- **CS201**: Python Programming
  - Linked with: Python for Everybody (Coursera), Python Django Web Development (YouTube), Python Data Structures (FreeCodeCamp)

### C Programming Courses
- **CS202**: C Programming
  - Linked with: C Programming for Beginners (Udemy), C Programming Tutorial (DataFlair)

## Adding New Courses

### Adding Certificate Courses
```javascript
// Example certificate course
{
  title: "New Course Name",
  description: "Course description",
  platform: "Udemy",
  courseUrl: "https://course-url.com",
  certificateUrl: "https://certificate-url.com",
  duration: "40 hours",
  level: "Beginner",
  language: "Java",
  category: "Programming",
  rating: 4.5,
  tags: ["Java", "Programming"]
}
```

### Linking Certificate Courses to Academic Courses
Use the endpoint: `POST /api/enhanced-courses/link-certificate`
```json
{
  "courseId": "academic_course_id",
  "certificateCourseId": "certificate_course_id"
}
```

## Platform Support
- **Udemy**: Free courses with certificates
- **Unacademy**: Indian platform with free courses
- **DataFlair**: Technical tutorials with certificates
- **Coursera**: Free courses with financial aid
- **edX**: Free courses from top universities
- **YouTube**: Free tutorials with completion certificates
- **FreeCodeCamp**: Completely free with certificates

## Future Enhancements
- User progress tracking for certificate courses
- Rating and review system for certificate courses
- Automated course recommendations based on academic progress
- Integration with LinkedIn for certificate sharing
- Mobile app for course access
