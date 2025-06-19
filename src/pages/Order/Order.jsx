import React, { useEffect, useState } from "react";
import axios from "axios";
import c from "./Order.module.scss";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Unauthorized. Please login.");
        return;
      }

      try {
        const res = await axios.get(
          "https://server-production-45af.up.railway.app/api/order",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Failed to fetch orders. Please try again later.");
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className={c.orderContainer}>
      <h2>Orders</h2>
      {error && <p className={c.error}>{error}</p>}
      <table className={c.table}>
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Perfume Name</th>
            <th>Brand</th>
            <th>Quantity</th>
            <th>Unit Price ($)</th>
            <th>Total Item Price ($)</th> <th>Image</th>
            <th>Ordered At</th>
            <th>Order Address</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order.id}>
                <td>{order.user?.name || "N/A"}</td>
                <td>{order.perfume?.name || "N/A"}</td>
                <td>{order.perfume?.brand || "N/A"}</td>
                <td>{order.quantity}</td>
                <td>{order.perfume?.price}</td>
                <td>
                  {(order.perfume?.price * order.quantity).toFixed(2)}
                </td>{" "}
                <td>
                  <img
                    src={order.perfume?.image || "placeholder.jpg"}
                    alt={order.perfume?.name || "Perfume Image"}
                    className={c.perfumeImage}
                  />
                </td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td>{order.orderAddress}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No orders found.</td>{" "}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Order;
