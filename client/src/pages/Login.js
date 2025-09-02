import React, { useState } from 'react';
import axios from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

import Logo from '../components/Logo';
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/auth/login', { email, password });
      login({ ...res.data.user, token: res.data.token });
  toast.success(`Welcome back, ${res.data.user.name || res.data.user.email}!`);

      if (res.data.user.role === 'seller') {
        navigate('/seller');
      } else if (res.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        // Redirect customers to the products page
        navigate('/products');
      }
    } catch (err) {
  const msg = err.response?.data?.message || 'Login failed';
  setError(msg);
  toast.error(msg);
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', bgcolor: '#f8f9fa' }}>
      {/* Left side - Login Form */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        px: { xs: 4, md: 8 },
        py: 6,
        bgcolor: 'white'
      }}>
        <Box sx={{ width: '100%', maxWidth: 500 }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 6 }}>
            <Logo size={64} withText textSize={32} />
          </Box>

          {/* Welcome Text */}
          <Typography variant="h3" sx={{ 
            fontWeight: 700, 
            mb: 2, 
            textAlign: 'center',
            color: '#1a1a1a',
            fontSize: { xs: 32, md: 40 }
          }}>
            Welcome back
          </Typography>
          
          {/* Google Login Button */}
          <Button
            fullWidth
            variant="outlined"
            sx={{
              mb: 4,
              py: 2,
              borderRadius: 3,
              textTransform: 'none',
              fontSize: 18,
              fontWeight: 500,
              color: '#5f6368',
              borderColor: '#dadce0',
              '&:hover': {
                borderColor: '#1976d2',
                bgcolor: 'rgba(25, 118, 210, 0.04)'
              }
            }}
            startIcon={
              <Box sx={{ 
                width: 24, 
                height: 24, 
                borderRadius: '50%',
                bgcolor: '#4285f4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                fontWeight: 600,
                color: 'white'
              }}>
                G
              </Box>
            }
          >
            Continue with Google
          </Button>

          {/* Divider */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Box sx={{ flex: 1, height: 1, bgcolor: '#e0e0e0' }} />
            <Typography sx={{ mx: 3, color: '#757575', fontSize: 16 }}>or</Typography>
            <Box sx={{ flex: 1, height: 1, bgcolor: '#e0e0e0' }} />
          </Box>

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              placeholder="Enter email or username"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: 60,
                  fontSize: 18,
                  borderRadius: 3,
                  bgcolor: '#f8f9fa',
                  border: 'none',
                  '& fieldset': {
                    border: '2px solid #e0e0e0'
                  },
                  '&:hover fieldset': {
                    borderColor: '#1976d2'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1976d2',
                    borderWidth: 2
                  }
                }
              }}
            />
            
            <TextField
              placeholder="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: 60,
                  fontSize: 18,
                  borderRadius: 3,
                  bgcolor: '#f8f9fa',
                  border: 'none',
                  '& fieldset': {
                    border: '2px solid #e0e0e0'
                  },
                  '&:hover fieldset': {
                    borderColor: '#1976d2'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1976d2',
                    borderWidth: 2
                  }
                }
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                py: 2.5,
                borderRadius: 3,
                textTransform: 'none',
                fontSize: 20,
                fontWeight: 600,
                bgcolor: '#1a1a1a',
                color: 'white',
                '&:hover': {
                  bgcolor: '#333'
                }
              }}
            >
              Continue
            </Button>
          </Box>

          {/* Terms and Sign up */}
          <Typography variant="body1" sx={{ textAlign: 'center', mt: 4, color: '#757575', fontSize: 16 }}>
            By continuing, you agree to our{' '}
            <Link href="#" sx={{ color: '#1976d2', textDecoration: 'none', fontWeight: 500 }}>Terms</Link>
            {' '}and{' '}
            <Link href="#" sx={{ color: '#1976d2', textDecoration: 'none', fontWeight: 500 }}>Privacy Policy</Link>
          </Typography>

          <Typography variant="body1" sx={{ textAlign: 'center', mt: 3, color: '#757575', fontSize: 16 }}>
            Don't have an account?{' '}
            <Link component={Link} to="/register" sx={{ color: '#1976d2', textDecoration: 'none', fontWeight: 600 }}>
              Sign up
            </Link>
          </Typography>

          {error && (
            <Typography color="error" sx={{ textAlign: 'center', mt: 3, fontSize: 16, fontWeight: 500 }}>
              {error}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Right side - Illustration/Background */}
      <Box sx={{ 
        flex: 1, 
        display: { xs: 'none', md: 'flex' },
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated background elements */}
        <Box sx={{
          position: 'absolute',
          width: '200%',
          height: '200%',
          background: `
            radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)
          `,
          animation: 'float 20s ease-in-out infinite'
        }} />
        
        {/* Decorative shapes */}
        <Box sx={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          width: 80,
          height: 80,
          borderRadius: '50%',
          bgcolor: 'rgba(255, 255, 255, 0.1)',
          animation: 'float 6s ease-in-out infinite'
        }} />
        
        <Box sx={{
          position: 'absolute',
          bottom: '30%',
          left: '15%',
          width: 60,
          height: 60,
          borderRadius: '50%',
          bgcolor: 'rgba(255, 255, 255, 0.1)',
          animation: 'float 8s ease-in-out infinite reverse'
        }} />

        {/* Center content */}
        <Box sx={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          px: 6
        }}>
          <Typography variant="h2" sx={{ fontWeight: 700, mb: 3, fontSize: { md: 48, lg: 56 } }}>
            Find Your Perfect Pet
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.9, maxWidth: 500, fontSize: { md: 20, lg: 24 }, lineHeight: 1.4 }}>
            Connect with loving pets looking for their forever homes. Join thousands of happy families who found their companions through PetAdopt.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
