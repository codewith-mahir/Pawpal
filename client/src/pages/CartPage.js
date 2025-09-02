import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { buildImageUrl } from '../api/axios';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export default function CartPage() {
  const { items, remove, totals } = useCart();
  const navigate = useNavigate();

  if (!items.length) return <Container maxWidth="md" sx={{ mt: 3 }}><Typography>Your cart is empty.</Typography></Container>;

  return (
    <Container maxWidth="md" sx={{ mt: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Your Cart</Typography>
      <Paper>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2}>
            {items.map((it) => (
              <Grid item xs={12} key={it._id}>
                <Box sx={{ display:'flex', alignItems:'center', gap:2 }}>
                  {it.imageUrl && (
                    <Box component="img" src={buildImageUrl(it.imageUrl)} alt={it.name} sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 1, border: '1px solid', borderColor: 'divider' }} />
                  )}
                  <Box sx={{ flex:1 }}>
                    <Typography variant="subtitle1">{it.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{it.amount}</Typography>
                  </Box>
                  <Button size="small" color="error" onClick={() => remove(it._id)}>Remove</Button>
                </Box>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ display:'flex', justifyContent:'space-between', mt:2 }}>
            <Typography variant="subtitle1">Subtotal</Typography>
            <Typography variant="subtitle1">{totals.subtotal.toFixed(2)}</Typography>
          </Box>
          <Box sx={{ textAlign:'right', mt:2 }}>
            <Button variant="contained" onClick={() => navigate('/checkout')}>Checkout</Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
