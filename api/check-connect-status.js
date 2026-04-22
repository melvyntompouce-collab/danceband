const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://hakosphere.fr');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { accountId } = req.query;
    if (!accountId) return res.status(400).json({ error: 'accountId manquant' });

    const account = await stripe.accounts.retrieve(accountId);
    const complete = account.details_submitted && account.charges_enabled;

    res.status(200).json({ complete });
  } catch(err) {
    console.error('Check connect status error:', err);
    res.status(500).json({ error: err.message });
  }
};
