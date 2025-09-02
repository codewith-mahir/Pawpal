import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';

export default function Hero({
  title = 'Find your new best friend',
  subtitle = 'Browse pets ready for their forever homes',
  ctaText = 'View Available Pets',
  ctaTo = '/products',
  // Recommended: /images/pet-adoptions-banner.png from your attachments
  imageUrl = '/images/pet-adoptions-banner.jpg',
  minHeight = 200,
}) {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        position: 'relative',
        color: 'text.primary',
        borderRadius: 3,
        overflow: 'hidden',
        minHeight: { xs: minHeight - 40, sm: minHeight - 20, md: minHeight },
        display: 'flex',
        alignItems: 'center',
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay for readability */}
      <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.15))' }} />
      {/* Decorative floating paws */}
      <Box className="floating" sx={{ position: 'absolute', top: 24, right: 24, opacity: 0.15, filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.2))' }}>
        <Typography variant="h1" component="span">🐾</Typography>
      </Box>
      <Box className="floating" sx={{ position: 'absolute', bottom: 24, left: 24, opacity: 0.15, animationDelay: '1.2s' }}>
        <Typography variant="h2" component="span">🐾</Typography>
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Stack spacing={1.2} sx={{ py: { xs: 3, md: 4 }, color: 'common.white' }}>
          <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: 22, md: 28 } }}>{title}</Typography>
          <Typography variant="body1" sx={{ maxWidth: 600, fontWeight: 400, color: 'rgba(255,255,255,0.92)', fontSize: { xs: 14, md: 16 } }}>
            {subtitle}
          </Typography>
          <Stack direction="row" spacing={1.2}>
            {ctaText && (
              <Button
                variant="contained"
                color="warning"
                onClick={() => navigate(ctaTo)}
                sx={{ px: 2, py: 1, borderRadius: 999, fontSize: 14 }}
              >
                {ctaText}
              </Button>
            )}
            <Button variant="outlined" color="inherit" onClick={() => navigate('/donate')} sx={{ borderRadius: 999, color: 'common.white', borderColor: 'rgba(255,255,255,0.8)', px: 2, py: 1, fontSize: 14 }}>
              Donate Now
            </Button>
          </Stack>
          <Stack direction="row" spacing={2.5} sx={{ mt: 1, opacity: 0.95 }}>
            <Typography variant="caption">10,000+ successful adoptions</Typography>
            <Typography variant="caption">Verified NGOs</Typography>
            <Typography variant="caption">Secure payments</Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
