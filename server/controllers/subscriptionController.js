const Subscription = require('../models/Subscription');

exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if already subscribed
    const existing = await Subscription.findOne({ email });
    if (existing) {
      if (existing.active) {
        return res.status(400).json({ message: 'This email is already subscribed' });
      } else {
        // Reactivate subscription
        existing.active = true;
        await existing.save();
        return res.json({ message: 'Subscription reactivated successfully!' });
      }
    }

    // Create new subscription
    const subscription = new Subscription({ email });
    await subscription.save();

    res.status(201).json({
      message: 'Successfully subscribed to our newsletter!',
      subscription
    });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ message: 'Failed to subscribe. Please try again.' });
  }
};

exports.unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;

    const subscription = await Subscription.findOne({ email });
    if (!subscription) {
      return res.status(404).json({ message: 'Email not found in subscriptions' });
    }

    subscription.active = false;
    await subscription.save();

    res.json({ message: 'Successfully unsubscribed' });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).json({ message: 'Failed to unsubscribe' });
  }
};

exports.getAll = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ active: true })
      .sort({ subscribedAt: -1 });

    res.json({
      subscriptions,
      count: subscriptions.length
    });
  } catch (error) {
    console.error('Get subscriptions error:', error);
    res.status(500).json({ message: 'Failed to fetch subscriptions' });
  }
};
