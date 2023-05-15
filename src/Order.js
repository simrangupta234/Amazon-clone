import React from "react";
import "./Orders.css";
import CheckoutProduct from "./CheckoutProduct";
import moment from "moment";
import CurrencyFormat from "react-currency-format";

function Order({ order }) {
  return (
    <div className="order">
      <h2>Order</h2>
      <p>{moment.unix(Order.data.created).format("MMMM Do YYYY, h:mma")}</p>

      <p className="order__id">
        <small>{order.id}</small>
      </p>

      {order.data.basket?.map((item) => (
        <CheckoutProduct
          id={item.id}
          title={item.title}
          image={item.image}
          price={item.price}
          rating={item.rating}
        />
      ))}

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
        value={order.data.amount / 100} // Part of the homework
        displayType={"text"}
        thousandSeparator={true}
        prefix={"$"}
      />
    </div>
  );
}

export default Order;
