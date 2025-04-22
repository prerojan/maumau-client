// ==== BACKEND (Node.js + Express) ====

// Instalar dependências:
// npm install express stripe cors dotenv

require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());

app.post("/create-payment-intent", async (req, res) => {
  const { amount } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "brl",
      payment_method_types: ["card"],
    });
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.listen(4242, () => console.log("Servidor rodando na porta 4242"));

// Criar um arquivo .env com:
// STRIPE_SECRET_KEY=sk_test_sua_chave_aqui
