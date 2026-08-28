// config/stripe.js
const Stripe = require('stripe');

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Warning: STRIPE_SECRET_KEY is missing in environment variables.');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

module.exports = stripe;