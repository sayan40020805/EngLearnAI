import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center">
      <h1 className="text-5xl font-bold text-red-600 mb-4">404</h1>
      <p className="text-xl mb-6">Page Not Found</p>
      <Link to="/" className="text-blue-500 hover:underline">
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
