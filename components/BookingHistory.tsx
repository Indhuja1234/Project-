
import React from 'react';
import type { Booking } from '../types';
import { TicketIcon } from './Icon';

interface BookingHistoryProps {
  bookings: Booking[];
}

const BookingHistory: React.FC<BookingHistoryProps> = ({ bookings }) => {
  return (
    <div className="animate-fade-in">
      <h1 className="text-4xl font-bold mb-8 border-l-4 border-teal-500 pl-4">My Bookings</h1>
      {bookings.length > 0 ? (
        <div className="space-y-6">
          {[...bookings].reverse().map(booking => (
            <div key={booking.id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
              <img src={booking.movie.posterUrl} alt={booking.movie.title} className="w-full md:w-48 h-64 md:h-auto object-cover" />
              <div className="p-6 flex-grow">
                <h2 className="text-2xl font-bold text-white">{booking.movie.title}</h2>
                <p className="text-gray-400">{booking.theater.name}</p>
                <div className="mt-4 text-gray-300 space-y-2">
                  <p><strong>Showtime:</strong> {booking.showtime}</p>
                  <p><strong>Seats:</strong> {booking.seats.map(s => s.id).join(', ')}</p>
                  <p><strong>Total Price:</strong> ₹{booking.totalPrice}</p>
                  <p><strong>Payment Method:</strong> {booking.paymentMethod}</p>
                  <p><strong>Booked on:</strong> {new Date(booking.bookingTime).toLocaleString()}</p>
                </div>
                 {booking.hasCombo && (
                    <div className="mt-4 p-2 bg-green-900/50 border border-green-500 text-green-200 rounded-lg text-sm">
                        <p><strong>Combo Offer Included</strong></p>
                    </div>
                 )}
              </div>
              <div className="bg-gray-700 p-4 flex flex-col items-center justify-center">
                 <p className="font-mono text-sm text-gray-400">Booking ID</p>
                 <p className="font-bold text-lg text-white">{booking.id}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-800 rounded-lg">
          <TicketIcon className="mx-auto h-16 w-16 text-gray-500" />
          <h2 className="mt-4 text-2xl font-bold">No Bookings Yet</h2>
          <p className="mt-2 text-gray-400">Your movie adventures will appear here once you book a ticket.</p>
        </div>
      )}
    </div>
  );
};

export default BookingHistory;