const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const HAKO_COMMISSION = 0.10; // 10% de commission HAKO

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://hakosphere.fr');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  try {
    const { amount, eventId, eventTitle, stripeAccountId } = req.body;

    if (!amount || !eventId || !stripeAccountId) {
      return res.status(400).json({ error: 'Paramètres manquants' });
    }

    const amountInCents = Math.round(amount * 100);
    const hakoFee = Math.round(amountInCents * HAKO_COMMISSION);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'eur',
      application_fee_amount: hakoFee,
      transfer_data: {
        destination: stripeAccountId,
      },
      metadata: {
        event_id: eventId,
        event_title: eventTitle
      }
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret
    });

  } catch (err) {
    console.error('Payment intent error:', err);
    res.status(500).json({ error: err.message });
  }
};
