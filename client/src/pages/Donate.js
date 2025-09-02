import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import { toast } from 'react-toastify';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Divider from '@mui/material/Divider';

export default function Donate() {
  const { user } = useAuth();
  const [ngos, setNgos] = useState([]);
  const [donationType, setDonationType] = useState(''); // 'website' or 'ngo'
  const [selectedNgo, setSelectedNgo] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [donationItems, setDonationItems] = useState('');
  const [donationAmount, setDonationAmount] = useState('');
  const [other, setOther] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Pet-related NGOs
  const petNgos = [
    'Animal Welfare Foundation Bangladesh',
    'People for Animal Welfare (PAW)',
    'Obhoyaronno Bangladesh',
    'Dhaka Animal Welfare',
    'Bangladesh Animal Welfare Foundation',
    'Paws & Claws Animal Rescue',
    'Street Dogs & Cats Rescue BD',
    'Pet Lovers Bangladesh'
  ];

  useEffect(() => {
    if (user) {
      setFirstName(user.name?.split(' ')[0] || '');
      setLastName(user.name?.split(' ').slice(1).join(' ') || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!firstName || !lastName || !email) {
      return toast.error('Please fill in all required fields');
    }

    if (!donationType) {
      return toast.error('Please select a donation type');
    }

    if (donationType === 'ngo' && !selectedNgo) {
      return toast.error('Please select an organization');
    }

    try {
      setSubmitting(true);
      
      const donationData = {
        firstName,
        lastName,
        email,
        donationType,
        selectedNgo: donationType === 'ngo' ? selectedNgo : null,
        donationItems,
        donationAmount,
        other,
        isWebsiteDonation: donationType === 'website'
      };

      await axios.post('/donations', donationData);
      
      toast.success(
        donationType === 'website' 
          ? 'Thank you for supporting our website!' 
          : `Thank you for your donation to ${selectedNgo}!`
      );
      
      // Reset form
      setDonationType('');
      setSelectedNgo('');
      setDonationItems('');
      setDonationAmount('');
      setOther('');
      
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit donation');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header with cute pets design similar to screenshot */}
      <Box sx={{ 
        position: 'relative',
        background: 'linear-gradient(135deg, #a8e6cf 0%, #ffd3e1 100%)',
        borderRadius: 4,
        overflow: 'hidden',
        p: 4,
        mb: 4,
        textAlign: 'center'
      }}>
        {/* Decorative pet images */}
        <Box sx={{ 
          position: 'absolute',
          left: 20,
          top: 20,
          width: 80,
          height: 80,
          borderRadius: '50%',
          bgcolor: 'rgba(255,255,255,0.9)',
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 40
        }}>
          🐱
        </Box>
        
        <Box sx={{ 
          position: 'absolute',
          right: 20,
          top: 20,
          width: 80,
          height: 80,
          borderRadius: '50%',
          bgcolor: 'rgba(255,255,255,0.9)',
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 40
        }}>
          🐶
        </Box>

        <Typography variant="h3" sx={{ 
          fontWeight: 800,
          color: '#2D5A27',
          mb: 1,
          fontSize: { xs: 32, md: 48 }
        }}>
          For the love
        </Typography>
        <Typography variant="h3" sx={{ 
          fontWeight: 800,
          color: '#FF6B6B',
          fontSize: { xs: 32, md: 48 }
        }}>
          of Pets
        </Typography>
      </Box>

      {/* Main Form */}
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 600, 
          mb: 4, 
          textAlign: 'center',
          color: '#333'
        }}>
          Animal Shelter Donation Form
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Name Fields */}
            <Grid item xs={12} md={6}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Name: <span style={{ color: 'red' }}>*</span>
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    placeholder="First"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    fullWidth
                    required
                    variant="outlined"
                    sx={{ bgcolor: '#fff' }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    placeholder="Last"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    fullWidth
                    required
                    variant="outlined"
                    sx={{ bgcolor: '#fff' }}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Email */}
            <Grid item xs={12} md={6}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Email: <span style={{ color: 'red' }}>*</span>
              </Typography>
              <TextField
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
                variant="outlined"
                sx={{ bgcolor: '#fff' }}
              />
            </Grid>

            {/* Donation Type Selection */}
            <Grid item xs={12}>
              <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                Select Donation Type: <span style={{ color: 'red' }}>*</span>
              </Typography>
              <FormControl component="fieldset">
                <RadioGroup
                  value={donationType}
                  onChange={(e) => {
                    setDonationType(e.target.value);
                    setSelectedNgo(''); // Reset NGO selection when changing type
                  }}
                  sx={{ gap: 1 }}
                >
                  <FormControlLabel
                    value="website"
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="body1" fontWeight={500}>
                          💝 Donate to PetAdopt Website
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Support our platform to help more pets find loving homes
                        </Typography>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value="ngo"
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="body1" fontWeight={500}>
                          🏠 Donate to Pet Welfare Organization
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Choose from verified pet welfare NGOs
                        </Typography>
                      </Box>
                    }
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

            {/* NGO Selection - Only show if ngo is selected */}
            {donationType === 'ngo' && (
              <Grid item xs={12}>
                <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                  Select Organization: <span style={{ color: 'red' }}>*</span>
                </Typography>
                <TextField
                  select
                  value={selectedNgo}
                  onChange={(e) => setSelectedNgo(e.target.value)}
                  fullWidth
                  required
                  placeholder="Choose an organization"
                  variant="outlined"
                  sx={{ bgcolor: '#fff' }}
                >
                  <MenuItem value="">Select an organization</MenuItem>
                  {petNgos.map((ngo) => (
                    <MenuItem key={ngo} value={ngo}>
                      {ngo}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>

            {/* What do you want to donate */}
            <Grid item xs={12}>
              <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                What do you want to donate: <span style={{ color: 'red' }}>*</span>
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 2, 
                      textAlign: 'center',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: '#f5f5f5' }
                    }}
                  >
                    <FormControlLabel
                      control={<Radio checked={donationItems === 'products'} onChange={() => setDonationItems('products')} />}
                      label="Products"
                    />
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 2, 
                      textAlign: 'center',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: '#f5f5f5' }
                    }}
                  >
                    <FormControlLabel
                      control={<Radio checked={donationItems === 'money'} onChange={() => setDonationItems('money')} />}
                      label="Money"
                    />
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 2, 
                      textAlign: 'center',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: '#f5f5f5' }
                    }}
                  >
                    <FormControlLabel
                      control={<Radio checked={donationItems === 'other'} onChange={() => setDonationItems('other')} />}
                      label="Other"
                    />
                  </Paper>
                </Grid>
              </Grid>
            </Grid>

            {/* Conditional fields based on donation type */}
            {donationItems === 'products' && (
              <Grid item xs={12}>
                <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                  If products, please specify: <span style={{ color: 'red' }}>*</span>
                </Typography>
                <TextField
                  multiline
                  rows={4}
                  placeholder="Describe the products you want to donate (e.g., pet food, toys, blankets, etc.)"
                  value={other}
                  onChange={(e) => setOther(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  sx={{ bgcolor: '#fff' }}
                />
              </Grid>
            )}

            {donationItems === 'money' && (
              <Grid item xs={12}>
                <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                  If money, please specify the amount: <span style={{ color: 'red' }}>*</span>
                </Typography>
                <TextField
                  type="number"
                  placeholder="Enter amount in BDT"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  sx={{ bgcolor: '#fff' }}
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>৳</Typography>,
                  }}
                />
              </Grid>
            )}

            {donationItems === 'other' && (
              <Grid item xs={12}>
                <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                  Please specify: <span style={{ color: 'red' }}>*</span>
                </Typography>
                <TextField
                  multiline
                  rows={4}
                  placeholder="Please describe what you want to donate"
                  value={other}
                  onChange={(e) => setOther(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  sx={{ bgcolor: '#fff' }}
                />
              </Grid>
            )}

            {/* Submit Button */}
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={submitting}
                  sx={{
                    px: 6,
                    py: 2,
                    fontSize: 18,
                    fontWeight: 600,
                    borderRadius: 3,
                    bgcolor: donationType === 'website' ? '#FF6B6B' : '#2D5A27',
                    '&:hover': {
                      bgcolor: donationType === 'website' ? '#ff5252' : '#1a3d1a'
                    }
                  }}
                >
                  {submitting ? 'Submitting...' : 'Submit Donation'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}
