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
        const res = await axios.get("http://localhost:9000/api/order", {
          headers: {
            Authorization: token,
          },
        });
        setOrders(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch orders.");
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
            <th>Customer</th>
            <th>Phone</th>
            <th>Perfume</th>
            <th>Brand</th>
            <th>Image</th>
            <th>Price ($)</th>
            <th>Ordered At</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.customerName}</td>
              <td>{order.phone}</td>
              <td>{order.perfume?.name}</td>
              <td>{order.perfume?.brand}</td>
              <td>
                <img
                  src={order.perfume?.image}
                  alt={order.perfume?.name}
                  className={c.perfumeImage}
                />
              </td>
              <td>{order.perfume?.price}</td>
              <td>{new Date(order.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Order;
