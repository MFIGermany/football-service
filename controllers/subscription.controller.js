import stripe from '../config/stripe.js'
import pool from '../config/db.js'
import env from '../config/env.js'

export class SubscriptionController {

    createCheckoutSession = async (req, res) => {
        const { email, plan } = req.body; // plan: 'monthly' or 'yearly'

        try {
            // Buscar usuario existente
            const [existing] = await pool.query(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );

            let user = existing[0];
            let customerId = user ? user.stripe_customer_id : null;

            // Crear cliente si no existe en Stripe
            if (!customerId) {
                const customer = await stripe.customers.create({ email });
                customerId = customer.id;

                if (!user) {
                    const [result] = await pool.query(
                        'INSERT INTO users (email, stripe_customer_id, active) VALUES (?, ?, ?)',
                        [email, customerId, false]
                    );

                    user = { id: result.insertId, email, stripe_customer_id: customerId };
                } else {
                    await pool.query(
                        'UPDATE users SET stripe_customer_id = ? WHERE id = ?',
                        [customerId, user.id]
                    );
                }
            }

            const priceId = plan === 'yearly'
                ? env.STRIPE_PRICE_YEARLY
                : env.STRIPE_PRICE_MONTHLY;

            const session = await stripe.checkout.sessions.create({
                customer: customerId,
                payment_method_types: ['card'],
                mode: 'subscription',
                line_items: [{
                    price: priceId,
                    quantity: 1
                }],
                success_url: `${env.APP_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${env.APP_BASE_URL}/cancel`
            });

            res.json({ url: session.url });

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
