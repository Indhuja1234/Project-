
import React, { useState } from 'react';
import type { Booking } from '../types';
import { CreditCardIcon, UpiIcon, BankIcon, LoadingSpinner } from './Icon';

type PendingBookingDetails = Omit<Booking, 'id' | 'user' | 'bookingTime' | 'paymentMethod'>;

interface PaymentProps {
  bookingDetails: PendingBookingDetails;
  onConfirmBooking: (paymentMethod: string) => void;
}

type PaymentMethod = 'card' | 'upi' | 'netbanking';

const Payment: React.FC<PaymentProps> = ({ bookingDetails, onConfirmBooking }) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' });
  const [upiId, setUpiId] = useState('');
  const [bank, setBank] = useState('');

  const isFormValid = () => {
    switch (paymentMethod) {
      case 'card':
        return cardDetails.number.length >= 13 && cardDetails.expiry.match(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/) && cardDetails.cvv.length >= 3;
      case 'upi':
        return upiId.includes('@');
      case 'netbanking':
        return bank !== '';
      default:
        return false;
    }
  };

  const handlePayment = () => {
    if (!isFormValid()) return;
    setIsProcessing(true);
    setTimeout(() => {
      let method = '';
      switch (paymentMethod) {
        case 'card': method = 'Credit/Debit Card'; break;
        case 'upi': method = 'UPI'; break;
        case 'netbanking': method = 'Net Banking'; break;
      }
      onConfirmBooking(method);
    }, 2000); // Simulate network delay
  };

  const renderPaymentForm = () => {
    switch (paymentMethod) {
      case 'card':
        return (
          <div className="space-y-4 animate-fade-in-fast">
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-300 mb-1">Card Number</label>
              <input type="text" id="cardNumber" placeholder="0000 0000 0000 0000" maxLength={16} value={cardDetails.number} onChange={e => setCardDetails({...cardDetails, number: e.target.value.replace(/\D/g, '')})} className="w-full bg-gray-700 text-white rounded-md px-3 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-300 mb-1">Expiry Date</label>
                <input type="text" id="expiryDate" placeholder="MM/YY" maxLength={5} value={cardDetails.expiry} onChange={e => setCardDetails({...cardDetails, expiry: e.target.value})} className="w-full bg-gray-700 text-white rounded-md px-3 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div className="flex-1">
                <label htmlFor="cvv" className="block text-sm font-medium text-gray-300 mb-1">CVV</label>
                <input type="text" id="cvv" placeholder="123" maxLength={4} value={cardDetails.cvv} onChange={e => setCardDetails({...cardDetails, cvv: e.target.value.replace(/\D/g, '')})} className="w-full bg-gray-700 text-white rounded-md px-3 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
            </div>
          </div>
        );
      case 'upi':
        return (
            <div className="animate-fade-in-fast">
                <label htmlFor="upiId" className="block text-sm font-medium text-gray-300 mb-1">UPI ID</label>
                <input type="text" id="upiId" placeholder="yourname@bank" value={upiId} onChange={e => setUpiId(e.target.value)} className="w-full bg-gray-700 text-white rounded-md px-3 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
        );
      case 'netbanking':
        return (
            <div className="animate-fade-in-fast">
                <label htmlFor="bank" className="block text-sm font-medium text-gray-300 mb-1">Select Bank</label>
                <select id="bank" value={bank} onChange={e => setBank(e.target.value)} className="w-full bg-gray-700 text-white rounded-md px-3 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option value="">-- Select Bank --</option>
                    <option>State Bank of India</option>
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>Axis Bank</option>
                    <option>Kotak Mahindra Bank</option>
                </select>
            </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 animate-fade-in">
      {/* Booking Summary */}
      <div className="md:w-1/3 bg-gray-800 p-6 rounded-lg self-start">
        <h2 className="text-2xl font-bold border-b border-gray-700 pb-3 mb-4">Booking Summary</h2>
        <img src={bookingDetails.movie.posterUrl} alt={bookingDetails.movie.title} className="rounded-md mb-4" />
        <h3 className="text-xl font-bold">{bookingDetails.movie.title}</h3>
        <p className="text-gray-400">{bookingDetails.theater.name} - {bookingDetails.showtime}</p>
        <div className="my-3">
          <h4 className="font-semibold mb-1">Seats ({bookingDetails.seats.length})</h4>
          <div className="flex flex-wrap gap-1">
            {bookingDetails.seats.map(s => <span key={s.id} className="bg-gray-700 text-xs px-2 py-1 rounded">{s.id}</span>)}
          </div>
        </div>
        <div className="mt-4 border-t border-gray-700 pt-3 flex justify-between items-center text-xl font-bold">
          <span>Total:</span>
          <span>₹{bookingDetails.totalPrice}</span>
        </div>
      </div>

      {/* Payment Options */}
      <div className="md:w-2/3 bg-gray-800 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Choose Payment Method</h2>
        <div className="flex border-b border-gray-700 mb-4">
            <TabButton icon={<CreditCardIcon />} label="Card" isActive={paymentMethod === 'card'} onClick={() => setPaymentMethod('card')} />
            <TabButton icon={<UpiIcon />} label="UPI" isActive={paymentMethod === 'upi'} onClick={() => setPaymentMethod('upi')} />
            <TabButton icon={<BankIcon />} label="Net Banking" isActive={paymentMethod === 'netbanking'} onClick={() => setPaymentMethod('netbanking')} />
        </div>
        
        <div className="min-h-[150px]">
            {renderPaymentForm()}
        </div>

        <button
          onClick={handlePayment}
          disabled={!isFormValid() || isProcessing}
          className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <LoadingSpinner className="animate-spin h-5 w-5" /> Processing...
            </>
          ) : (
            `Pay ₹${bookingDetails.totalPrice}`
          )}
        </button>
      </div>
    </div>
  );
};

const TabButton: React.FC<{ icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void; }> = ({ icon, label, isActive, onClick }) => (
    <button onClick={onClick} className={`flex items-center gap-2 px-4 py-3 font-semibold border-b-2 transition-colors ${isActive ? 'border-teal-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}>
        {icon}
        {label}
    </button>
);


export default Payment;
