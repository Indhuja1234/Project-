import React from 'react';
import type { Movie } from '../types';
import { StarIcon } from './Icon';

interface MovieCardProps {
  movie: Movie;
  onSelectMovie: (movie: Movie) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onSelectMovie }) => {
  return (
    <div
      onClick={() => onSelectMovie(movie)}
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-teal-500/50 transform hover:-translate-y-2 transition-all duration-300 cursor-pointer group"
    >
      <div className="relative">
        <img src={movie.posterUrl} alt={movie.title} className="w-full h-96 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute top-2 right-2 bg-teal-600 text-white text-xs font-bold px-2 py-1 rounded-full">{movie.format}</div>
        <div className="absolute bottom-4 left-4">
          <h3 className="text-xl font-bold text-white">{movie.title}</h3>
          <p className="text-sm text-gray-300">{movie.genre}</p>
        </div>
      </div>
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-1">
          <StarIcon />
          <span className="text-yellow-400 font-bold">{movie.rating.toFixed(1)}</span>
        </div>
        <button className="bg-gradient-to-r from-teal-500 to-cyan-600 group-hover:opacity-90 text-white px-4 py-2 rounded-lg font-semibold transition-opacity">
          Details
        </button>
      </div>
    </div>
  );
};

export default MovieCard;