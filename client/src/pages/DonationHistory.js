import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';

export default function DonationHistory() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(()=>{ (async()=>{
    try { setLoading(true); const r = await axios.get('/donations/mine'); setRows(r.data || []); }
    catch(_) { setError('Failed to load'); } finally { setLoading(false); }
  })(); },[]);

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
        My Donation History
      </Typography>
      
      {error && (
        <Typography color="error" sx={{ textAlign: 'center', mb: 2 }}>
          {error}
        </Typography>
      )}
      
      {loading ? (
        <Typography sx={{ textAlign: 'center' }}>Loading...</Typography>
      ) : rows.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No donations found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            You haven't made any donations yet. Visit our donation page to support pets in need!
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {rows.map(d => (
            <Grid item xs={12} key={d._id}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                {/* Header */}
                <Box sx={{ mb: 2 }}>
                  {d.isWebsiteDonation || d.donationType === 'website' ? (
                    <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600 }}>
                      💝 Website Support Donation
                    </Typography>
                  ) : (
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      🏠 Donation to {d.selectedNgo || d.ngoId?.name || 'Unknown NGO'}
                    </Typography>
                  )}
                  
                  <Typography variant="caption" color="text.secondary">
                    Submitted on {d.createdAt ? new Date(d.createdAt).toLocaleDateString() : 'Unknown date'}
                  </Typography>
                </Box>

                <Divider sx={{ mb: 2 }} />

                {/* Donation Details */}
                <Grid container spacing={2}>
                  {d.donationItems && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        <strong>Donation Type:</strong>
                      </Typography>
                      <Typography variant="body1">
                        {d.donationItems.charAt(0).toUpperCase() + d.donationItems.slice(1)}
                      </Typography>
                    </Grid>
                  )}
                  
                  {d.donationAmount && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        <strong>Amount:</strong>
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'success.main', fontWeight: 600 }}>
                        ৳{d.donationAmount}
                      </Typography>
                    </Grid>
                  )}
                  
                  {d.other && (
                    <Grid item xs={12}>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        <strong>Details:</strong>
                      </Typography>
                      <Typography variant="body1">
                        {d.other}
                      </Typography>
                    </Grid>
                  )}
                  
                  {/* Legacy items display */}
                  {Array.isArray(d.items) && d.items.length > 0 && (
                    <Grid item xs={12}>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        <strong>Items:</strong>
                      </Typography>
                      <Typography variant="body1">
                        {d.items.join(', ')} ({d.items.length} items)
                      </Typography>
                    </Grid>
                  )}
                  
                  {d.deliveryMethod && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        <strong>Delivery Method:</strong>
                      </Typography>
                      <Typography variant="body1">
                        {d.deliveryMethod.charAt(0).toUpperCase() + d.deliveryMethod.slice(1)}
                      </Typography>
                    </Grid>
                  )}
                </Grid>

                {/* Notes */}
                {d.notes && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Notes:</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ 
                      bgcolor: 'grey.50', 
                      p: 1.5, 
                      borderRadius: 1,
                      fontStyle: 'italic'
                    }}>
                      {d.notes}
                    </Typography>
                  </Box>
                )}

                {/* Status and Timeline */}
                <Box sx={{ mt: 2 }}>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                    <Chip 
                      label={`Status: ${d.status.charAt(0).toUpperCase() + d.status.slice(1)}`} 
                      size="small" 
                      color={
                        d.status === 'approved' ? 'success' : 
                        d.status === 'completed' ? 'primary' :
                        d.status === 'rejected' ? 'error' : 'default'
                      }
                      variant={d.status === 'pending' ? 'outlined' : 'filled'}
                    />
                    
                    {d.scheduledAt && (
                      <Chip 
                        label={`Scheduled: ${new Date(d.scheduledAt).toLocaleDateString()}`} 
                        size="small" 
                        variant="outlined"
                      />
                    )}
                    
                    {d.confirmedAt && (
                      <Chip 
                        label={`Completed: ${new Date(d.confirmedAt).toLocaleDateString()}`} 
                        size="small" 
                        color="success"
                      />
                    )}
                    
                    <Chip 
                      label={d.isWebsiteDonation ? 'Website Support' : 'NGO Donation'} 
                      size="small" 
                      variant="outlined"
                      color={d.isWebsiteDonation ? 'primary' : 'secondary'}
                    />
                  </Stack>
                </Box>

                {/* Admin Comment */}
                {d.adminComment && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ mb: 0.5, color: 'warning.main' }}>
                      <strong>Admin Note:</strong>
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      bgcolor: 'warning.light', 
                      color: 'warning.contrastText',
                      p: 1.5, 
                      borderRadius: 1 
                    }}>
                      {d.adminComment}
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
