const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://hakosphere.fr');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  try {
    const { email, uid } = req.body;

    if (!email || !uid) {
      return res.status(400).json({ error: 'Email et UID requis' });
    }

    // Créer le compte Connect Stripe pour l'organisateur
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'FR',
      email: email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      metadata: { hako_uid: uid }
    });

    // Créer le lien d'onboarding pour que l'organisateur renseigne ses infos bancaires
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: 'https://hakosphere.fr?stripe=refresh',
      return_url: 'https://hakosphere.fr?stripe=success',
      type: 'account_onboarding',
    });

    res.status(200).json({
      accountId: account.id,
      onboardingUrl: accountLink.url
    });

  } catch (err) {
    console.error('Stripe Connect error:', err);
    res.status(500).json({ error: err.message });
  }
};
