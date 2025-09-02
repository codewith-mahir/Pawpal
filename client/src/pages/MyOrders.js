import React, { useEffect, useState } from 'react';
import axios, { buildImageUrl } from '../api/axios';
import { Link } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await axios.get('/orders/mine');
        setOrders(res.data || []);
      } catch (e) {
        setError(e.response?.data?.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const refresh = async () => {
    const res = await axios.get('/orders/mine');
    setOrders(res.data || []);
  };

  const cancelOrder = async (id) => {
    try {
      await axios.post(`/orders/${id}/cancel`);
      await refresh();
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to cancel order');
    }
  };

  if (loading) return <Container maxWidth="md" sx={{ mt: 3 }}><Typography>Loading orders...</Typography></Container>;
  if (error) return <Container maxWidth="md" sx={{ mt: 3 }}><Typography color="error.main">{error}</Typography></Container>;

  return (
    <Container maxWidth="md" sx={{ mt: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>My Orders</Typography>
      {orders.length === 0 && <Typography>No orders yet.</Typography>}
      {orders.map((o) => (
        <Paper key={o._id} sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle2">Order ID: {o._id}</Typography>
          <Typography variant="body2">Status: {o.status}</Typography>
          <Typography variant="body2">Placed: {new Date(o.createdAt).toLocaleString()}</Typography>
          <Typography variant="body2">Items: {o.items?.length || 0}</Typography>
          <Typography variant="body2">Total: {Number(o.total || 0).toFixed(2)}</Typography>
          {Array.isArray(o.items) && o.items.length > 0 && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="subtitle2">Products</Typography>
              {o.items.map((it, idx) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 0.5 }}>
                  {it.imageUrl && (
                    <Box component="img" src={buildImageUrl(it.imageUrl)} alt={it.name} sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 1, border: '1px solid', borderColor: 'divider' }} />
                  )}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2">{it.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{it.amount} × {it.quantity || 1}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
          <Box sx={{ mt: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button size="small" component={Link} to={`/track/${o._id}`}>Track details</Button>
            {o.status !== 'cancelled' && (
              <Button size="small" color="error" onClick={() => cancelOrder(o._id)}>Cancel order</Button>
            )}
          </Box>
        </Paper>
      ))}
    </Container>
  );
}
