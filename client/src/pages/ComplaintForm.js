import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { toast } from 'react-toastify';
import axios from '../api/axios';

export default function ComplaintForm() {
  const [message, setMessage] = useState('');
  const [productId, setProductId] = useState('');
  const [orderId, setOrderId] = useState('');
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) { toast.error('Please provide a message.'); return; }
    try {
      setSubmitting(true);
      const form = new FormData();
      form.append('message', message.trim());
      if (productId.trim()) form.append('productId', productId.trim());
      if (orderId.trim()) form.append('orderId', orderId.trim());
      if (file) form.append('proof', file);
  // Let the browser set the multipart boundary automatically
  await axios.post('/complaints', form);
      toast.success('Complaint submitted');
      setMessage(''); setProductId(''); setOrderId(''); setFile(null);
    } catch (err) {
      const serverMsg = err?.response?.data?.message;
      const generic = err?.message;
      toast.error(serverMsg || generic || 'Failed to submit complaint');
    } finally { setSubmitting(false); }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Submit a Complaint</Typography>
        <Box component="form" onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField label="Message" multiline minRows={3} fullWidth value={message} onChange={(e)=> setMessage(e.target.value)} required />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Product ID (optional)" fullWidth value={productId} onChange={(e)=> setProductId(e.target.value)} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Order ID (optional)" fullWidth value={orderId} onChange={(e)=> setOrderId(e.target.value)} />
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" component="label">
                Attach Proof
                <input type="file" hidden onChange={(e)=> setFile(e.target.files?.[0] || null)} />
              </Button>
              {file && <Typography variant="caption" sx={{ ml: 1 }}>{file.name}</Typography>}
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" disabled={submitting}>Submit Complaint</Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}
