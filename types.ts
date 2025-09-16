
export interface Movie {
  id: string;
  title: string;
  genre: string;
  rating: number;
  duration: number; // in minutes
  format: '2D' | '3D' | '4DX';
  posterUrl: string;
  synopsis: string;
}

export interface Theater {
  id: string;
  name: string;
  distance: number; // in km
  type: 'AC' | 'Non-AC';
  popularity: number; // score out of 10
  movies: string[]; // array of movie IDs
  showtimes: {
    firstShow: string;
    secondShow: string;
  };
}

export interface Seat {
  id: string; // e.g., 'A1', 'P5'
  row: string;
  number: number;
  class: SeatClass;
  status: 'available' | 'selected' | 'booked';
}

export enum SeatClass {
  Premium = 'Premium',
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
}

export interface User {
  username: string;
}

export interface Booking {
  id: string;
  user: User;
  movie: Movie;
  theater: Theater;
  showtime: string;
  seats: Seat[];
  totalPrice: number;
  bookingTime: Date;
  hasCombo: boolean;
  paymentMethod: string;
}

export interface Review {
    id: string;
    author: string;
    rating: number;
    comment: string;
}