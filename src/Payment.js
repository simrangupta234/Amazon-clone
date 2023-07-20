import React, { useState } from "react";
import "./Payment.css";
import { useStateValue } from "./StateProvider";
import CheckoutProduct from "./CheckoutProduct";
import { Link, useNavigate } from "react-router-dom";
import { useElements, CardElement } from "@stripe/react-stripe-js";
import {loadStripe} from '@stripe/stripe-js';
import CurrencyFormat from "react-currency-format";
import { getBasketTotal } from "./reducer";
import { useEffect } from "react";
import axios from "./axios";
import { db } from "./firebase";

function Payment() {
  const [{ basket, user }, dispatch] = useStateValue();

  const navigate = useNavigate();
  const stripe = loadStripe('secret_key');
  const elements = useElements();

  const [succeeded, setSucceeded] = useState(false);
  const [processing, setProcessing] = useState("");

  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState(true);
  // const stringClientSecret = clientSecret.toString();

  useEffect(() => {
    //generate the special stripe secret which allows to charge
    //a customer

    const getClientSecret = async () => {
      const response = await axios({
        method: "post",
        //Stripe expects the total in a curriencies subunits
        url: `/payments/create?total=${getBasketTotal(basket) * 100}`,
      });
      setClientSecret(response.data.clientSecret);
    };
    getClientSecret();
  }, [basket]);

  console.log("THE SECRET IS >>>", clientSecret);
  console.log("user", user);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

     stripe
      .confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      })
      .then(function(result) {
        //paymentIntent = payment confirmation
        console.log(result.paymentIntent);
        db.collection("users")
          .doc(user?.uid)
          .collection("orders")
          .doc(result.paymentIntent.id)
          .set({
            basket: basket,
            amount: result.paymentIntent.amount,
            created: result.paymentIntent.created,
          });

        setSucceeded(true);
        setError(null);
        setProcessing(false);
        dispatch({
          type: "EMPTY_BASKET",
        });

        navigate("/orders", { replace: true });
      });
  };

  const handleChange = (event) => {
    //listen the changes in cardElement
    //and display any errors as the customer types their card details
    setDisabled(event.empty);
    setError(event.error ? event.error.massage : "");
  };

  return (
    <div>
      <div className="payment">
        <div className="payment__container">
          <h1>
            Checkout (<Link to="/checkout">{basket?.length} items</Link>){" "}
          </h1>

          <div className="payment__section">
            <div className="payment__title">
              <h3>Delivery Address</h3>
            </div>
            <div className="payment__address">
              <p>{user?.email}</p>
              <p>123 react lane</p>
              <p>India</p>
            </div>
          </div>

          <div className="payment__section">
            <div className="payment__title">
              <h3>Review items and delivery</h3>
            </div>
            <div className="payment__items">
              {basket.map((item, key) => (
                <CheckoutProduct
                  key={key}
                  id={item.id}
                  title={item.title}
                  image={item.image}
                  price={item.price}
                  rating={item.rating}
                />
              ))}
            </div>
          </div>

          <div className="payment__section">
            <div className="payment__title">
              <h3>Payment Method</h3>
            </div>

            <div className="payment__details">
              {/*Stripe*/}
              <form onSubmit={handleSubmit}>
                <CardElement onChange={handleChange} />

                <div className="payment_priceContainer">
                  <CurrencyFormat
                    renderText={(value) => (
                      <>
                        <h3>
                          {/* Part of the homework */}
                          Order Total:
                          {value}
                        </h3>
                      </>
                    )}
                    decimalScale={2}
                    value={getBasketTotal(basket)} // Part of the homework
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"$"}
                  />

                  <button disabled={processing || disabled || succeeded}>
                    <span>{processing ? <p>Processing</p> : "Buy Now"}</span>
                  </button>
                </div>

                {/*error*/}
                {error && <div>{error}</div>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
