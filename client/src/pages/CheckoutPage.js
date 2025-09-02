import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

export default function CheckoutPage() {
  const { items, clear } = useCart();
  const navigate = useNavigate();
  const [shipping, setShipping] = useState({ name: '', email: '', address: '', city: '', country: '', postalCode: '' });
  const [loading, setLoading] = useState(false);

  if (!items.length) return <Container maxWidth="sm" sx={{ mt: 3 }}><Typography>Nothing to checkout.</Typography></Container>;

  const placeOrder = async () => {
    setLoading(true);
    try {
      const payload = {
        items: items.map((i) => ({ productId: i._id, quantity: i.quantity || 1 })),
        shipping,
      };
      const res = await axios.post('/orders', payload);
      clear();
      navigate(`/track/${res.data._id}`);
    } catch (e) {
      alert('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Checkout</Typography>
        <Grid container spacing={2}>
          {(['name','email','address','city','country','postalCode']).map((k) => (
            <Grid item xs={12} key={k}>
              <TextField fullWidth label={k} value={shipping[k]} onChange={(e)=> setShipping({ ...shipping, [k]: e.target.value })} />
            </Grid>
          ))}
          <Grid item xs={12}>
            <Box sx={{ textAlign:'right' }}>
              <Button variant="contained" disabled={loading} onClick={placeOrder}>{loading ? 'Placing...' : 'Place Order'}</Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
