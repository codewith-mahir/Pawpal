import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function Logo({ size = 28, withText = false, textSize = 18, sx, textSx }) {
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, color: 'inherit', ...sx }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="PetAdopt logo"
      >
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2D5A27" />
            <stop offset="100%" stopColor="#FF6B6B" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="30" fill="url(#g)" />
        {/* Paw print */}
        <circle cx="24" cy="22" r="5" fill="#ffffff" fillOpacity="0.95" />
        <circle cx="32" cy="18" r="5" fill="#ffffff" fillOpacity="0.95" />
        <circle cx="40" cy="22" r="5" fill="#ffffff" fillOpacity="0.95" />
        <circle cx="28" cy="36" r="9" fill="#ffffff" fillOpacity="0.95" />
      </svg>
      {withText && (
        <Typography
          variant="h6"
          component="span"
          sx={{ fontWeight: 700, letterSpacing: 0.2, lineHeight: 1, fontSize: { xs: Math.max(12, textSize - 2), sm: textSize }, ...textSx }}
        >
          PetAdopt
        </Typography>
      )}
    </Box>
  );
}
