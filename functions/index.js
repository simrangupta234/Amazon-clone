const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(
    "sk_test_51N5KscSBXO05ZdayrfirWJPXSU2vpa7h3LH6dP9mEBW3VgJbNzpIneVrn7GbzPLZRNY8oy42DbeuaUHGrKjOJxtn00BukuwSC7");
//  App config
const app = express();
//  Middlewares
app.use(cors({origin: true}));
app.use(express.json());
//  API routes
app.get("/", (request, response) => response.status(200).send("hello world"));
app.post(`/payments/create`, async (request, response) => {
  const total = request.query.total;

  console.log("payment request received", total);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: total, // subunits of currency
    currency: "usd",
  });
  // ok - created
  response.status(201).send({
    clientSecret: paymentIntent.client_secret,
  });
});
exports.api = functions.https.onRequest(app);
//  Example endpoint
//  http://127.0.0.1:5001/clone-e2310/us-central1/api
