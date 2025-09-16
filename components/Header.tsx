import React from 'react';
import type { User } from '../types';
import type { View } from '../App';
import { FilmIcon, TicketIcon, UserCircleIcon, LoginIcon, LogoutIcon } from './Icon';

interface HeaderProps {
  user: User | null;
  setView: (view: View) => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, setView, onLogout }) => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('list')}>
          <FilmIcon />
          <h1 className="text-2xl font-bold text-white tracking-wider">CineSeat</h1>
        </div>
        <div className="flex items-center gap-6">
          {user && (
            <button
              onClick={() => setView('history')}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <TicketIcon />
              My Bookings
            </button>
          )}
          {user ? (
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2">
                 <UserCircleIcon />
                 <span className="font-medium">{user.username}</span>
               </div>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                <LogoutIcon/>
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setView('login')}
              className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300"
            >
              <LoginIcon />
              Login
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;