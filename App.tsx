
import React, { useState, useEffect, useCallback } from 'react';
import type { Movie, Theater, User, Booking } from './types';
import { generateInitialData } from './services/geminiService';
import Header from './components/Header';
import MovieList from './components/MovieList';
import MovieDetails from './components/MovieDetails';
import SeatSelection from './components/SeatSelection';
import BookingHistory from './components/BookingHistory';
import Login from './components/Login';
import Payment from './components/Payment';
import { LoadingSpinner } from './components/Icon';

export type View = 'list' | 'details' | 'booking' | 'history' | 'login' | 'payment';

type PendingBookingDetails = Omit<Booking, 'id' | 'user' | 'bookingTime' | 'paymentMethod'>;

const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null);
  const [selectedShowtime, setSelectedShowtime] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [view, setView] = useState<View>('list');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingBooking, setPendingBooking] = useState<PendingBookingDetails | null>(null);

  const fetchMovieData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await generateInitialData();
      setMovies(data.movies);
      setTheaters(data.theaters);
    } catch (err) {
      console.error("Error fetching movie data:", err);
      setError("Failed to load movie data. Please check your Gemini API key and try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovieData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    setView('details');
  };

  const handleBookNow = (theater: Theater, showtime: string) => {
    if (!selectedMovie) return;
    setSelectedTheater(theater);
    setSelectedShowtime(showtime);
    if (currentUser) {
      setView('booking');
    } else {
      setView('login');
    }
  };

  const handleProceedToPayment = (bookingDetails: PendingBookingDetails) => {
    setPendingBooking(bookingDetails);
    setView('payment');
  };

  const handleConfirmBooking = (paymentMethod: string) => {
    if (!currentUser || !pendingBooking) return;
    const booking: Booking = {
      id: `B${Date.now()}`,
      user: currentUser,
      ...pendingBooking,
      bookingTime: new Date(),
      paymentMethod,
    };
    setBookings(prev => [...prev, booking]);
    setPendingBooking(null);
    setView('history');
  };
  
  const handleLogin = (username: string) => {
    setCurrentUser({ username });
    if(selectedMovie && selectedTheater && selectedShowtime) {
      setView('booking');
    } else {
      setView('list');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('list');
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-screen">
          <LoadingSpinner />
          <p className="mt-4 text-lg text-gray-400">Summoning movies from the digital ether...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-screen text-center">
            <div className="bg-red-900/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg">
                <h3 className="font-bold text-lg">An Error Occurred</h3>
                <p>{error}</p>
            </div>
        </div>
      );
    }

    switch (view) {
      case 'login':
        return <Login onLogin={handleLogin} />;
      case 'details':
        return selectedMovie && <MovieDetails movie={selectedMovie} theaters={theaters.filter(t => t.movies.includes(selectedMovie.id))} onBookNow={handleBookNow} />;
      case 'booking':
        return selectedMovie && selectedTheater && selectedShowtime && (
          <SeatSelection 
            movie={selectedMovie} 
            theater={selectedTheater} 
            showtime={selectedShowtime} 
            onProceedToPayment={handleProceedToPayment}
            allBookings={bookings}
          />
        );
      case 'payment':
        return pendingBooking && (
            <Payment 
                bookingDetails={pendingBooking}
                onConfirmBooking={handleConfirmBooking}
            />
        );
      case 'history':
        return <BookingHistory bookings={bookings.filter(b => b.user.username === currentUser?.username)} />;
      case 'list':
      default:
        return <MovieList movies={movies} onSelectMovie={handleSelectMovie} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 font-sans">
      <Header user={currentUser} setView={setView} onLogout={handleLogout} />
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;