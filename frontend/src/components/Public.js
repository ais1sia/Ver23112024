import { Link } from "react-router-dom";
import React from 'react'
import { Button } from "@/components/ui/button"

const Public = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col items-center justify-center p-4">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-600 mb-2">Welcome to ReadyAimFluent</h1>
        <p className="text-xl text-gray-600">Your journey to multilingual mastery starts here!</p>
      </header>

      <main className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <p className="text-gray-700 mb-6">
          ReadyAimFluent offers an immersive and interactive way to learn new languages. 
          With personalized lessons, real-time pronunciation feedback, and a 
          supportive community, you'll be speaking fluently in no time!
        </p>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-blue-600">Get Started Today</h2>
          <ul className="list-disc list-inside text-gray-700 mb-6">
            <li>Access to 30+ languages</li>
            <li>Personalized learning paths</li>
            <li>Interactive speaking exercises</li>
            <li>Progress tracking and achievements</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link to="/signup">Sign Up</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/login">Log In</Link>
          </Button>
        </div>
      </main>

      <footer className="mt-8 text-center text-gray-500">
        <p>&copy; 2025 ReadyAimFluent. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default Public


