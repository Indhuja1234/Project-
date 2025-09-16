import React, { useState } from 'react';
import { LoginIcon } from './Icon';

interface LoginProps {
  onLogin: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username.trim());
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-2xl animate-fade-in">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Login to Continue</h2>
        <p className="text-center text-gray-400 mb-8">Please enter a username to proceed with your booking.</p>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-md px-4 py-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="e.g., MovieLover99"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full mt-8 flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:bg-gray-500 disabled:from-gray-500 disabled:to-gray-600"
            disabled={!username.trim()}
          >
            <LoginIcon />
            Login & Book
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;