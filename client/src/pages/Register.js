import React, { useState } from 'react';
import axios from '../api/axios';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PersonIcon from '@mui/icons-material/Person';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Logo from '../components/Logo';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('adopter');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      await axios.post('/auth/register', { name, email, password, role });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', bgcolor: '#f8f9fa' }}>
      {/* Left: Premium Register Form */}
      <Box sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 4, md: 8 },
        py: 6,
        bgcolor: 'white',
      }}>
        <Box sx={{ width: '100%', maxWidth: 520 }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 6 }}>
            <Logo size={64} withText textSize={32} />
          </Box>

          <Typography variant="h3" sx={{
            fontWeight: 700,
            mb: 1,
            textAlign: 'center',
            color: '#1a1a1a',
            fontSize: { xs: 28, md: 36 },
          }}>
            Create your account
          </Typography>
          <Typography variant="body1" sx={{ textAlign: 'center', mb: 4, color: '#6b7280' }}>
            Join Pawpal to adopt, donate, and connect with loving pets.
          </Typography>

          <Paper elevation={3} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
            {/* Role selection */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: '#374151', fontWeight: 600 }}>
                I am signing up as
              </Typography>
              <ToggleButtonGroup
                color="secondary"
                exclusive
                fullWidth
                value={role}
                onChange={(_, val) => val && setRole(val)}
              >
                <ToggleButton value="adopter" sx={{ py: 1.5, gap: 1, textTransform: 'none', fontWeight: 600 }}>
                  <PersonIcon fontSize="small" /> Adopter
                </ToggleButton>
                <ToggleButton value="host" sx={{ py: 1.5, gap: 1, textTransform: 'none', fontWeight: 600 }}>
                  <StorefrontIcon fontSize="small" /> Host/Rescuer
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: 56,
                    fontSize: 16,
                    borderRadius: 2,
                    bgcolor: '#f8f9fa',
                    '& fieldset': { border: '2px solid #e5e7eb' },
                    '&:hover fieldset': { borderColor: '#1976d2' },
                    '&.Mui-focused fieldset': { borderColor: '#1976d2', borderWidth: 2 },
                  },
                }}
              />

              <TextField
                placeholder="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: 56,
                    fontSize: 16,
                    borderRadius: 2,
                    bgcolor: '#f8f9fa',
                    '& fieldset': { border: '2px solid #e5e7eb' },
                    '&:hover fieldset': { borderColor: '#1976d2' },
                    '&.Mui-focused fieldset': { borderColor: '#1976d2', borderWidth: 2 },
                  },
                }}
              />

              <TextField
                placeholder="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton aria-label="toggle password visibility" onClick={() => setShowPassword((s) => !s)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: 56,
                    fontSize: 16,
                    borderRadius: 2,
                    bgcolor: '#f8f9fa',
                    '& fieldset': { border: '2px solid #e5e7eb' },
                    '&:hover fieldset': { borderColor: '#1976d2' },
                    '&.Mui-focused fieldset': { borderColor: '#1976d2', borderWidth: 2 },
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                disabled={loading}
                variant="contained"
                sx={{
                  py: 2,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontSize: 18,
                  fontWeight: 700,
                }}
                startIcon={<CheckCircleIcon />}
              >
                {loading ? 'Creating account...' : 'Create account'}
              </Button>
            </Box>

            {error && (
              <Typography color="error" sx={{ textAlign: 'center', mt: 2, fontWeight: 500 }}>
                {error}
              </Typography>
            )}

            <Typography variant="body1" sx={{ textAlign: 'center', mt: 3, color: '#6b7280' }}>
              Already have an account?{' '}
              <Button component={RouterLink} to="/login" variant="text" sx={{ px: 0.5, textTransform: 'none', fontWeight: 700 }}>
                Log in
              </Button>
            </Typography>
          </Paper>
        </Box>
      </Box>

      {/* Right: Rich gradient illustration */}
      <Box sx={{
        flex: 1,
        display: { xs: 'none', md: 'flex' },
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
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
          animation: 'float 20s ease-in-out infinite',
        }} />

        {/* Decorative shapes */}
        <Box sx={{ position: 'absolute', top: '20%', right: '10%', width: 80, height: 80, borderRadius: '50%', bgcolor: 'rgba(255, 255, 255, 0.1)', animation: 'float 6s ease-in-out infinite' }} />
        <Box sx={{ position: 'absolute', bottom: '30%', left: '15%', width: 60, height: 60, borderRadius: '50%', bgcolor: 'rgba(255, 255, 255, 0.1)', animation: 'float 8s ease-in-out infinite reverse' }} />

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
          px: 6,
        }}>
          <Typography variant="h2" sx={{ fontWeight: 700, mb: 2, fontSize: { md: 44, lg: 54 } }}>
            Welcome to Pawpal
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 520, lineHeight: 1.5 }}>
            Discover pets looking for their forever homes. Donate, adopt, and be part of a caring community.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
