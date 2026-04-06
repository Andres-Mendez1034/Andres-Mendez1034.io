// Servicio de pagos (placeholder)
export async function createPaymentIntent({ amount, currency = 'USD' }) {
  // TODO: Integrar con pasarela (Stripe/MercadoPago)
  await new Promise(r => setTimeout(r, 400));
  return { id: 'pi_fake', clientSecret: 'cs_fake', amount, currency };
}
