// API Configuration
// Change this to your machine's IP address when testing on a physical device
const API_BASE_URL = 'https://localhost:5000/api';

export default {
  API_BASE_URL,
  CATEGORIES: [
    { name: 'Food', icon: '🍕', color: '#FF6B6B' },
    { name: 'Travel', icon: '✈️', color: '#4ECDC4' },
    { name: 'Shopping', icon: '🛍️', color: '#A78BFA' },
    { name: 'Bills', icon: '💡', color: '#FBBF24' },
    { name: 'Health', icon: '🏥', color: '#34D399' },
    { name: 'Entertainment', icon: '🎬', color: '#F472B6' },
    { name: 'Education', icon: '📚', color: '#60A5FA' },
    { name: 'Others', icon: '📦', color: '#9CA3AF' },
  ],
  PAYMENT_METHODS: ['Cash', 'Card', 'UPI', 'Net Banking', 'Other'],
  CURRENCIES: [
    { symbol: '₹', name: 'INR' },
    { symbol: '$', name: 'USD' },
    { symbol: '€', name: 'EUR' },
    { symbol: '£', name: 'GBP' },
    { symbol: '¥', name: 'JPY' },
  ],
};
