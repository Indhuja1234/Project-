
import type { SeatClass } from './types';

export const TICKET_PRICES: Record<SeatClass, number> = {
    Premium: 450,
    A: 350,
    B: 300,
    C: 250,
    D: 200,
};

export const BASE_TICKET_PRICE = 250;
export const COMBO_OFFER_THRESHOLD = 1000;
export const COMBO_SNACKS = ['Çoçak', 'Burger', 'Sandwich', 'Tea', 'Coffee'];

export const SEAT_LAYOUT = {
    rows: ['D', 'C', 'B', 'A'],
    premiumRows: ['P'],
    cols: 12,
};
