import React, { useState, useMemo } from 'react';
import type { Movie } from '../types';
import MovieCard from './MovieCard';

interface MovieListProps {
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
}

type SortOption = 'popularity' | 'rating' | 'title';
type FormatFilter = 'all' | '3D' | '4DX';

const MovieList: React.FC<MovieListProps> = ({ movies, onSelectMovie }) => {
  const [sortOption, setSortOption] = useState<SortOption>('popularity');
  const [formatFilter, setFormatFilter] = useState<FormatFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAndSortedMovies = useMemo(() => {
    let filtered = movies;

    if (formatFilter !== 'all') {
      filtered = filtered.filter(movie => movie.format === formatFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(movie => movie.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    return [...filtered].sort((a, b) => {
      switch (sortOption) {
        case 'rating':
          return b.rating - a.rating;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'popularity': // Popularity is mocked by rating here
        default:
          return b.rating - a.rating; 
      }
    });
  }, [movies, sortOption, formatFilter, searchTerm]);

  return (
    <div>
      <div className="mb-8 p-4 bg-gray-800 rounded-lg flex flex-col sm:flex-row gap-4 justify-between items-center">
        <input
          type="text"
          placeholder="Search for a movie..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-1/3 bg-gray-700 text-white placeholder-gray-400 rounded-md px-4 py-2 border border-transparent focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <div className="flex gap-4">
          <select
            value={formatFilter}
            onChange={(e) => setFormatFilter(e.target.value as FormatFilter)}
            className="bg-gray-700 text-white rounded-md px-4 py-2 border border-transparent focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Formats</option>
            <option value="3D">3D</option>
            <option value="4DX">4DX</option>
          </select>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="bg-gray-700 text-white rounded-md px-4 py-2 border border-transparent focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="popularity">Sort by Popularity</option>
            <option value="rating">Sort by Rating</option>
            <option value="title">Sort by Title (A-Z)</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredAndSortedMovies.map(movie => (
          <MovieCard key={movie.id} movie={movie} onSelectMovie={onSelectMovie} />
        ))}
      </div>
    </div>
  );
};

export default MovieList;