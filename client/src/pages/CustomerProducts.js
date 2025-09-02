import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { buildImageUrl } from '../api/axios';
import Hero from '../components/Hero';

export default function CustomerProducts() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const { add } = useCart();
  const [query, setQuery] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchCategories();
  }, []);

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchProducts(selectedCategory, query);
  }, [selectedCategory, query]);

  async function fetchProducts(category, q) {
    try {
      setLoading(true);
      const params = {};
      if (category) params.category = category;
      if (q && q.trim()) params.q = q.trim();
      const res = await axios.get('/products/all', { params });
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchCategories() {
    try {
      const res = await axios.get('/products/categories');
      setCategories(res.data);
    } catch (e) {
      // ignore
    }
  }

  // Logout handled via Navbar only


  return (
  <Container sx={{ mt: 3, mb: 6 }}>
      <Hero
        title="Adopt a Friend"
        subtitle="Every pet deserves a loving home. Explore our listings and find your perfect match."
        ctaText="Browse Pets"
        ctaTo="/products"
        imageUrl="/images/pet-adoptions-banner.png"
        minHeight={160}
      />
      
  <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 700, fontSize: 20 }}>Available Products</Typography>
  <Box sx={{ mb: 2, display: 'flex', gap: 1.5, alignItems: 'center', flexDirection: { xs: 'column', sm: 'row' } }}>
        <FormControl sx={{ minWidth: { xs: '100%', sm: 160 }, width: { xs: '100%', sm: 'auto' } }}>
          <InputLabel id="cat-label">Category</InputLabel>
          <Select labelId="cat-label" label="Category" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} size="small">
            <MenuItem value="">All</MenuItem>
            {categories.map((c) => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          placeholder="Search by name or description"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          fullWidth
          size="small"
        />
      </Box>

      {loading && (
        <Grid container spacing={2}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
              <Card>
                <Skeleton variant="rectangular" height={150} />
                <CardContent>
                  <Skeleton height={24} width="80%" />
                  <Skeleton height={18} width="90%" />
                  <Skeleton height={18} width="50%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {!loading && products.length === 0 && (
        <Box sx={{ textAlign: 'center', color: 'text.secondary', py: 4 }}>
          <Typography>No products match your filters.</Typography>
        </Box>
      )}

      <Grid container spacing={1.5}>
        {products.map((p) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={p._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', maxWidth: 280 }}>
        {p.imageUrl && (
                <CardMedia
                  component="img"
                  height="120"
          image={buildImageUrl(p.imageUrl)}
                  alt={p.name}
                  sx={{ objectFit: 'cover' }}
                />
              )}
              <CardContent sx={{ flexGrow: 1, p: 1.5 }}>
                <Typography variant="body1" noWrap title={p.name} sx={{ fontSize: 14, fontWeight: 600 }}>{p.name}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ minHeight: 30, mt: 0.25, fontSize: 12 }}>
                  {p.description}
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5, fontSize: 13, fontWeight: 500 }}>
                  Amount: {p.amount} Taka
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
                  Category: {p.category || 'General'}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: 11 }}>
                  Seller: {p.sellerId?.name || 'Unknown'}
                </Typography>
              </CardContent>
              <CardActions sx={{ pt: 0, p: 1, flexWrap: 'wrap', gap: 0.5 }}>
                <Button size="small" sx={{ fontSize: 11, px: 1 }} onClick={() => navigate('/product', { state: { product: p } })}>View Details</Button>
                {p.isSold ? (
                  <Typography color="error" sx={{ ml: 0.5, fontWeight: 700, fontSize: 11 }}>SOLD</Typography>
                ) : (
                  <Button
                    size="small"
                    variant="contained"
                    sx={{ fontSize: 11, px: 1 }}
                    onClick={() => {
                      const sellerId = typeof p.sellerId === 'string' ? p.sellerId : p.sellerId?._id;
                      if (sellerId && user?._id && String(sellerId) === String(user._id)) {
                        toast.error("You can't add your own product");
                        return;
                      }
                      add(p, 1);
                    }}
                  >
                    Add to Cart
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

  {/* Complaint moved to its own page, accessible from Navbar for customers/sellers */}
    </Container>
  );
}
