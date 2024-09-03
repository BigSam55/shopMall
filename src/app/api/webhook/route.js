import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import connectDb from '@/utils/db';
import orderModel from '@/models/orders';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
});
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

export const POST = async (request) => {
  await connectDb();

  const body = await request.text();
  console.log("Body", body)
  const sig = request.headers.get('stripe-signature');
  console.log('Stripe Signature:', sig);

  let event;

  try {
    // Construct the event from the raw body and signature
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const data = event.data.object;
        console.log('PaymentIntent succeeded:', data);

        const orderId = data.metadata.orderId;
        const paid = data.payment_status === 'paid';

        if (orderId && paid) {
          await orderModel.findByIdAndUpdate(orderId, { paid: true });
          console.log(`Order ${orderId} updated to paid`);
        } else {
          console.log(`Order ID not found or payment not completed for event: ${event.id}`);
        }
        break;

      // Add cases for other event types as needed

      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (err) {
    console.error(`Error during event handling: ${err.message}`);
    return NextResponse.json({ error: `Internal Server Error: ${err.message}` }, { status: 500 });
  }

  // Return a 200 response to acknowledge receipt of the event
  return NextResponse.json({ received: true }, { status: 200 });
};
