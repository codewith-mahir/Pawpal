import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api, { buildImageUrl } from '../api/axios';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

export default function ProductDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { add } = useCart();
  const { user } = useAuth();
  const [p, setP] = useState(state?.product || null);
  const [loading, setLoading] = useState(!state?.product);
  const [error, setError] = useState('');

  useEffect(() => {
    const id = state?.product?._id;
    if (!id) return;
    const run = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/${id}`);
        setP(res.data);
        setError('');
      } catch (e) {
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [state?.product?._id]);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 2 }}>
        <Skeleton variant="rounded" height={280} />
        <Skeleton height={40} sx={{ mt: 2 }} />
        <Skeleton height={24} width="60%" />
      </Container>
    );
  }
  if (!p) return <Container maxWidth="md" sx={{ mt: 2 }}><Typography>Product not found.</Typography></Container>;

  const addToCart = () => {
    const sellerId = typeof p.sellerId === 'string' ? p.sellerId : p.sellerId?._id;
    if (sellerId && user?._id && String(sellerId) === String(user._id)) {
      toast.error("You can't add your own product");
      return;
    }
    add(p, 1);
    navigate('/cart');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 2 }}>
      <Button onClick={() => navigate(-1)} sx={{ mb: 2 }}>&larr; Back</Button>
      {error && <Typography color="error" sx={{ mb: 1 }}>{error}</Typography>}
      <Paper elevation={2} sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={5}>
            {p.imageUrl ? (
              <Box sx={{ borderRadius: 1, overflow: 'hidden', border: '1px solid #eee' }}>
                <img src={buildImageUrl(p.imageUrl)} alt={p.name} style={{ width: '100%', height: 'auto', display: 'block' }} />
              </Box>
            ) : (
              <Skeleton variant="rectangular" height={260} />
            )}
          </Grid>
          <Grid item xs={12} md={7}>
            <Typography variant="h5" gutterBottom>{p.name}</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>{p.description}</Typography>
            <Typography variant="body2" color="text.secondary">Category: {p.category || 'General'}</Typography>
            {p.aiCategory && (
              <Typography variant="body2" color="text.secondary">AI Category: {p.aiCategory}</Typography>
            )}
            {p.breed && (
              <Typography variant="body2" color="text.secondary">Breed: {p.breed}</Typography>
            )}
            <Typography variant="h6" sx={{ mt: 1 }}>Amount: {p.amount} Taka</Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2">Seller</Typography>
              <Typography variant="body2">{p.sellerId?.name || 'Unknown'} ({p.sellerId?.email || 'N/A'})</Typography>
            </Box>
            <Box sx={{ mt: 3 }}>
              {p.isSold ? (
                <Typography color="error" fontWeight={700}>SOLD</Typography>
              ) : (
                <Button variant="contained" onClick={addToCart}>Add to cart</Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
