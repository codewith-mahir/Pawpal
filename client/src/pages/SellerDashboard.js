import React, { useState, useEffect, useMemo } from 'react';
import axios, { buildImageUrl } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Skeleton from '@mui/material/Skeleton';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import PetsIcon from '@mui/icons-material/Pets';
import CategoryIcon from '@mui/icons-material/Category';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { toast } from 'react-toastify';

export default function SellerDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(''); // amount as string input
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [category, setCategory] = useState('');
  const CATEGORY_OPTIONS = ['Cat', 'Dog', 'Bird', 'Rabbit', 'Fish', 'Reptile', 'Other', 'General'];
  const [error, setError] = useState('');
  const [complaintMsg, setComplaintMsg] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      const res = await axios.get('/products/mine');
      setProducts(res.data || []);
    } catch (err) {
      toast.error('Failed to load your products');
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setName('');
    setDescription('');
    setAmount('');
    setCategory('');
    setImage(null);
    setImagePreview('');
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !amount.trim()) {
      setError('Please enter product name and amount');
      return;
    }
    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('amount', amount);
      if (category) formData.append('category', category);
      if (image) formData.append('image', image);

      await axios.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Product added');
      resetForm();
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product');
    } finally {
      setSubmitting(false);
    }
  }

  const onFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    setImage(f || null);
    if (f) {
      const url = URL.createObjectURL(f);
      setImagePreview(url);
    } else {
      setImagePreview('');
    }
  };

  const submitComplaint = async () => {
    if (!complaintMsg.trim()) {
      toast.info('Please enter a complaint message');
      return;
    }
    try {
      await axios.post('/complaints', { message: complaintMsg });
      toast.success('Complaint sent');
      setComplaintMsg('');
    } catch (err) {
      toast.error('Failed to send complaint');
    }
  };

  const totalListings = useMemo(() => (products || []).length, [products]);
  const totalSold = useMemo(() => (products || []).filter(p => p.isSold).length, [products]);

  return (
    <Container maxWidth="md" sx={{ my: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
        <Typography variant="h6">Seller Dashboard</Typography>
        <Stack direction="row" spacing={1}>
          <Chip icon={<PetsIcon />} label={`Listings: ${totalListings}`} size="small" />
          <Chip color="success" label={`Sold: ${totalSold}`} size="small" />
        </Stack>
      </Stack>

      <Grid container spacing={2}>
        {/* Add Product Form */}
    <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>Add Product</Typography>
              <Box component="form" onSubmit={handleSubmit} encType="multipart/form-data">
                <Stack spacing={1.5}>
                  <TextField label="Name" value={name} onChange={(e)=> setName(e.target.value)} required size="small" />
                  <TextField label="Description" value={description} onChange={(e)=> setDescription(e.target.value)} multiline minRows={3} size="small" />
                  <TextField label="Amount (Taka)" value={amount} onChange={(e)=> setAmount(e.target.value)} required size="small" InputProps={{ startAdornment: <MonetizationOnIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} /> }} />
                  <FormControl size="small">
                    <InputLabel id="cat-label"><CategoryIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />Category</InputLabel>
                    <Select labelId="cat-label" label="Category" value={category} onChange={(e)=> setCategory(e.target.value)}>
                      <MenuItem value=""><em>Auto (AI)</em></MenuItem>
                      {CATEGORY_OPTIONS.map(opt => (
                        <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="center">
                    <Button variant="outlined" component="label" startIcon={<UploadFileIcon />} size="small">
                      {image ? 'Change Image' : 'Upload Image'}
                      <input type="file" accept="image/*" hidden onChange={onFileChange} />
                    </Button>
                    {imagePreview && (
                      <Box component="img" src={imagePreview} alt="preview" sx={{ width: 72, height: 72, borderRadius: 1, objectFit: 'cover', border: '1px solid', borderColor: 'divider' }} />
                    )}
                  </Stack>
                  {error && <Typography color="error" variant="body2">{error}</Typography>}
                  <Button type="submit" variant="contained" disabled={submitting}>{submitting ? 'Adding...' : 'Add Product'}</Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* My Products */}
        <Grid item xs={12} md={7}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>My Products</Typography>
          {loading ? (
            <Grid container spacing={2}>{Array.from({length:6}).map((_,i)=> (
              <Grid item xs={12} sm={6} key={i}><Card><CardContent><Skeleton variant="rectangular" height={140} sx={{ mb:1 }} /><Skeleton height={24} width="70%" /><Skeleton height={18} width="50%" /></CardContent></Card></Grid>
            ))}</Grid>
          ) : (
            <Grid container spacing={2}>
              {(products || []).map(p => (
                <Grid item xs={12} sm={6} key={p._id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {p.imageUrl && (
                      <Box component="img" src={buildImageUrl(p.imageUrl)} alt={p.name} sx={{ width: '100%', height: 140, objectFit: 'cover' }} />
                    )}
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" noWrap title={p.name}>{p.name}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }} noWrap title={p.description}>{p.description}</Typography>
                      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                        <Chip label={`${p.amount} Taka`} size="small" color="primary" variant="outlined" />
                        {p.category && <Chip label={p.category} size="small" />}
                        {p.isSold && <Chip label="Sold" color="success" size="small" />}
                        {typeof p.viewCount === 'number' && <Chip label={`Views: ${p.viewCount}`} size="small" variant="outlined" />}
                      </Stack>
                    </CardContent>
                    <CardActions sx={{ pt: 0 }}>
                      {/* Future: add Edit/Delete when routes exist */}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
              {products.length === 0 && (
                <Grid item xs={12}>
                  <Paper sx={{ p:2, textAlign: 'center' }}>
                    <Typography variant="body2">You have no products yet. Add your first listing using the form.</Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          )}
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Complaint Section */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>Submit a Complaint</Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                <TextField fullWidth size="small" value={complaintMsg} onChange={(e)=> setComplaintMsg(e.target.value)} placeholder="Describe the issue" />
                <Button variant="outlined" onClick={submitComplaint}>Submit</Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
