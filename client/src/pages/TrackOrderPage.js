import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useParams } from 'react-router-dom';

export default function TrackOrderPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (e) {
        // ignore
      }
    })();
  }, [id]);

  if (!order) return <div>Loading...</div>;

  return (
    <div>
      <h2>Order {order._id}</h2>
      <p>Status: {order.status}</p>
      {order.deliveryTracking?.carrier && (
        <p>Carrier: {order.deliveryTracking.carrier} | Tracking #: {order.deliveryTracking.trackingNumber}</p>
      )}
      {order.deliveryTracking?.eta && <p>ETA: {new Date(order.deliveryTracking.eta).toLocaleString()}</p>}
      <h3>History</h3>
      <ul>
        {(order.deliveryTracking?.history || []).map((h, idx) => (
          <li key={idx}>{h.status} - {h.note} - {new Date(h.at).toLocaleString()}</li>
        ))}
      </ul>
    </div>
  );
}
