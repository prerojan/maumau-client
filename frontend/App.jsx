// ==== FRONTEND (React) ====

// Instalar dependências:
// npm install @stripe/react-stripe-js @stripe/stripe-js

import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_51RGn9mQa1nVIV6pnNQj70B17LzpBqDcujJgAEDCLDgRFgnASfjIUOaAGmQbMGePek0fCLpQJOyxysgRrQ5XaZ3nJ00melYMeVJ");

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (error) return setMessage(error.message);

    const res = await fetch("https://maumau-client.onrender.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 5000 }), // valor em centavos (R$50,00)
    });

    const { clientSecret } = await res.json();

    const confirm = await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethod.id,
    });

    if (confirm.error) {
      setMessage(confirm.error.message);
    } else {
      setMessage("Pagamento realizado com sucesso!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 shadow-xl rounded-xl">
      <CardElement className="p-4 border border-gray-300 rounded-md" />
      <button
        type="submit"
        className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Pagar R$50,00
      </button>
      <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
    </form>
  );
}

export default function PagamentoSite() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
