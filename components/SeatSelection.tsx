
import React, { useState, useMemo, useCallback } from 'react';
import type { Movie, Theater, Seat, Booking } from '../types';
import { SeatClass } from '../types';
import { TICKET_PRICES, COMBO_OFFER_THRESHOLD, COMBO_SNACKS, SEAT_LAYOUT } from '../constants';

interface SeatSelectionProps {
  movie: Movie;
  theater: Theater;
  showtime: string;
  allBookings: Booking[];
  onProceedToPayment: (bookingDetails: Omit<Booking, 'id' | 'user' | 'bookingTime' | 'paymentMethod'>) => void;
}

const Seat: React.FC<{ seat: Seat; onSelect: (id: string) => void }> = ({ seat, onSelect }) => {
  const getSeatColor = () => {
    switch (seat.status) {
      case 'booked':
        return 'bg-gray-600 cursor-not-allowed';
      case 'selected':
        return 'bg-teal-500 ring-2 ring-teal-300';
      case 'available':
      default:
        let color = 'bg-gray-700 hover:bg-green-500';
        if (seat.class === SeatClass.Premium) color = 'bg-amber-500 hover:bg-amber-400';
        return color;
    }
  };

  return (
    <button
      onClick={() => onSelect(seat.id)}
      disabled={seat.status === 'booked'}
      className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold transition-colors ${getSeatColor()}`}
      aria-label={`Seat ${seat.id}`}
    >
      {seat.number}
    </button>
  );
};


const SeatSelection: React.FC<SeatSelectionProps> = ({ movie, theater, showtime, allBookings, onProceedToPayment }) => {
  const bookedSeatsForThisShow = useMemo(() => {
    const bookedSeatIds = new Set<string>();
    allBookings
      .filter(b => b.movie.id === movie.id && b.theater.id === theater.id && b.showtime === showtime)
      .forEach(booking => {
        booking.seats.forEach(seat => bookedSeatIds.add(seat.id));
      });
    return bookedSeatIds;
  }, [allBookings, movie, theater, showtime]);

  const generateSeats = useCallback(() => {
    const seats: Seat[] = [];
    SEAT_LAYOUT.premiumRows.forEach(row => {
      for (let i = 1; i <= SEAT_LAYOUT.cols; i++) {
        const id = `${row}${i}`;
        seats.push({ id, row, number: i, class: SeatClass.Premium, status: bookedSeatsForThisShow.has(id) ? 'booked' : 'available' });
      }
    });
    SEAT_LAYOUT.rows.forEach((row, rowIndex) => {
      const seatClass = Object.values(SeatClass)[rowIndex + 1] || SeatClass.D;
      for (let i = 1; i <= SEAT_LAYOUT.cols; i++) {
        const id = `${row}${i}`;
        seats.push({ id, row, number: i, class: seatClass, status: bookedSeatsForThisShow.has(id) ? 'booked' : 'available' });
      }
    });
    return seats;
  }, [bookedSeatsForThisShow]);

  const [seats, setSeats] = useState<Seat[]>(generateSeats);
  const selectedSeats = useMemo(() => seats.filter(s => s.status === 'selected'), [seats]);

  const handleSelectSeat = (id: string) => {
    setSeats(prevSeats =>
      prevSeats.map(seat => {
        if (seat.id === id && seat.status !== 'booked') {
          return { ...seat, status: seat.status === 'selected' ? 'available' : 'selected' };
        }
        return seat;
      })
    );
  };
  
  const totalPrice = useMemo(() => {
    return selectedSeats.reduce((total, seat) => total + TICKET_PRICES[seat.class], 0);
  }, [selectedSeats]);

  const hasCombo = totalPrice >= COMBO_OFFER_THRESHOLD;

  const handleProceed = () => {
    if (selectedSeats.length === 0) return;
    onProceedToPayment({
      movie,
      theater,
      showtime,
      seats: selectedSeats,
      totalPrice,
      hasCombo,
    });
  };
  
  const SeatLegend = () => (
    <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-6 p-4 bg-gray-800/50 rounded-lg">
        <div className="flex items-center gap-2"><div className="w-5 h-5 rounded bg-gray-700"></div><span className="text-sm">Available</span></div>
        <div className="flex items-center gap-2"><div className="w-5 h-5 rounded bg-amber-500"></div><span className="text-sm">Premium</span></div>
        <div className="flex items-center gap-2"><div className="w-5 h-5 rounded bg-teal-500"></div><span className="text-sm">Selected</span></div>
        <div className="flex items-center gap-2"><div className="w-5 h-5 rounded bg-gray-600"></div><span className="text-sm">Booked</span></div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-fade-in">
      <div className="lg:w-3/4 bg-gray-800 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Select Your Seats</h2>
        <div className="bg-gray-900/50 py-2 mb-6 rounded-md text-center text-lg font-mono tracking-widest text-gray-300">SCREEN</div>
        <div className="flex flex-col items-center gap-2">
            {[...SEAT_LAYOUT.premiumRows, ...SEAT_LAYOUT.rows].map(rowChar => (
                <div key={rowChar} className="flex items-center gap-2">
                    <span className="w-6 text-center font-bold text-gray-400">{rowChar}</span>
                    <div className="flex gap-2">
                        {seats.filter(s => s.row === rowChar).map(seat => <Seat key={seat.id} seat={seat} onSelect={handleSelectSeat} />)}
                    </div>
                </div>
            ))}
        </div>
        <SeatLegend />
      </div>
      <div className="lg:w-1/4">
        <div className="bg-gray-800 p-6 rounded-lg sticky top-24">
          <h2 className="text-2xl font-bold border-b border-gray-700 pb-3 mb-4">{movie.title}</h2>
          <p className="font-semibold">{theater.name}</p>
          <p className="text-gray-400">{showtime}</p>
          <div className="my-4">
            <h3 className="font-bold mb-2">Selected Seats ({selectedSeats.length})</h3>
            {selectedSeats.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {selectedSeats.map(s => <span key={s.id} className="bg-teal-600 text-white text-xs font-bold px-2 py-1 rounded">{s.id}</span>)}
                </div>
            ) : <p className="text-gray-500">No seats selected</p>}
          </div>
          <div className="mt-6 border-t border-gray-700 pt-4">
            <div className="flex justify-between items-center text-2xl font-bold">
              <span>Total:</span>
              <span>₹{totalPrice}</span>
            </div>
          </div>
          {hasCombo && (
            <div className="mt-4 p-3 bg-green-900/50 border border-green-500 text-green-200 rounded-lg text-center">
              <p className="font-bold">🎉 Combo Offer Unlocked! 🎉</p>
              <p className="text-sm">You get complimentary snacks: {COMBO_SNACKS.join(', ')}.</p>
            </div>
          )}
          <button
            onClick={handleProceed}
            disabled={selectedSeats.length === 0}
            className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};


export default SeatSelection;