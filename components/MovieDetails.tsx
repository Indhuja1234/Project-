import React from 'react';
import type { Movie, Theater } from '../types';
import { ClockIcon, StarIcon, LocationMarkerIcon, UserCircleIcon } from './Icon';

interface MovieDetailsProps {
  movie: Movie;
  theaters: Theater[];
  onBookNow: (theater: Theater, showtime: string) => void;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ movie, theaters, onBookNow }) => {
  // Placeholder data for reviews
  const reviews = [
    { author: 'CinemaFan21', rating: 4, comment: 'Absolutely breathtaking visuals and a compelling story. A must-watch on the big screen!' },
    { author: 'MovieCritique', rating: 3, comment: 'A decent film, but the plot felt a bit predictable. The action sequences were top-notch though.' },
    { author: 'PopcornLover', rating: 5, comment: 'Best movie of the year! I was on the edge of my seat the entire time. The 4DX experience was incredible.' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 rounded-lg animate-fade-in">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3">
          <img src={movie.posterUrl} alt={movie.title} className="rounded-lg shadow-2xl w-full" />
        </div>
        <div className="lg:w-2/3 text-gray-300">
          <span className="bg-teal-500 text-white px-3 py-1 text-sm font-semibold rounded-full">{movie.format}</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white my-4">{movie.title}</h1>
          <div className="flex items-center gap-6 mb-4">
            <div className="flex items-center gap-2">
              <StarIcon /> <span className="text-xl font-bold text-yellow-400">{movie.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon /> <span className="text-lg">{movie.duration} min</span>
            </div>
            <p className="text-lg">{movie.genre}</p>
          </div>
          <h2 className="text-2xl font-semibold text-white mt-6 mb-2 border-l-4 border-teal-500 pl-4">Synopsis</h2>
          <p className="text-gray-400 leading-relaxed">{movie.synopsis}</p>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-white mb-4 border-l-4 border-teal-500 pl-4">User Reviews</h2>
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <div key={index} className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <UserCircleIcon className="h-8 w-8 text-gray-400 mr-3" />
                <div>
                  <p className="font-bold text-white">{review.author}</p>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-600'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-400 italic">"{review.comment}"</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-3xl font-bold text-white mb-6 border-l-4 border-teal-500 pl-4">Available Theaters & Showtimes</h2>
        <div className="space-y-6">
          {theaters.length > 0 ? theaters.map(theater => (
            <div key={theater.id} className="bg-gray-800 p-6 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-4 hover:bg-gray-700/50 transition-colors">
              <div>
                <h3 className="text-xl font-bold text-white">{theater.name} <span className="text-sm font-normal bg-gray-700 px-2 py-1 rounded-full ml-2">{theater.type}</span></h3>
                <div className="flex items-center gap-2 text-gray-400 mt-1">
                  <LocationMarkerIcon /> <span>{theater.distance} km away</span>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => onBookNow(theater, theater.showtimes.firstShow)}
                  className="bg-teal-600 hover:bg-teal-500 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                >
                  {theater.showtimes.firstShow}
                </button>
                <button
                  onClick={() => onBookNow(theater, theater.showtimes.secondShow)}
                  className="bg-teal-600 hover:bg-teal-500 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                >
                  {theater.showtimes.secondShow}
                </button>
              </div>
            </div>
          )) : (
            <p className="text-gray-400 text-center">No theaters are currently showing this movie.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;