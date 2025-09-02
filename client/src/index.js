// React app entry
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';

// Fonts for headings/body per spec
import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import '@fontsource/open-sans/400.css';
import '@fontsource/open-sans/600.css';
import '@fontsource/open-sans/700.css';

let theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#2D5A27' }, // deep forest green
    secondary: { main: '#FF6B6B' }, // warm coral
    warning: { main: '#FFB347' }, // golden yellow for highlights/CTAs
    info: { main: '#E8D5FF' }, // soft lavender accent
    background: {
      default: '#FFF8F3', // soft cream
      paper: '#F7F5F3', // warm gray secondary background
    },
    text: {
      primary: '#2C3E50', // charcoal
      secondary: '#5A6C7D', // medium gray
    },
  },
  shape: { borderRadius: 10 },
  typography: {
    // Enhanced font stack for better macOS/Safari compatibility
    fontFamily: 'Open Sans, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol',
    h1: { fontFamily: 'Poppins, -apple-system, BlinkMacSystemFont, Open Sans, sans-serif', fontWeight: 700 },
    h2: { fontFamily: 'Poppins, -apple-system, BlinkMacSystemFont, Open Sans, sans-serif', fontWeight: 700 },
    h3: { fontFamily: 'Poppins, -apple-system, BlinkMacSystemFont, Open Sans, sans-serif', fontWeight: 700 },
    h4: { fontFamily: 'Poppins, -apple-system, BlinkMacSystemFont, Open Sans, sans-serif', fontWeight: 600 },
    h5: { fontFamily: 'Poppins, -apple-system, BlinkMacSystemFont, Open Sans, sans-serif', fontWeight: 600 },
    h6: { fontFamily: 'Poppins, -apple-system, BlinkMacSystemFont, Open Sans, sans-serif', fontWeight: 600 },
    body1: { fontSize: 16, lineHeight: 1.6 },
    body2: { lineHeight: 1.6 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiContainer: {
      defaultProps: { maxWidth: 'lg' }, // 1200px container
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease',
          boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 6px 16px rgba(0,0,0,0.12)'
          },
          '&.Mui-loading': {
            pointerEvents: 'none',
            opacity: 0.8,
          }
        },
        containedWarning: {
          color: '#2C3E50',
        }
      }
    },
    MuiCard: {
      defaultProps: { elevation: 1 },
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: 'transform 0.25s ease, box-shadow 0.25s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 28px rgba(0,0,0,0.12)'
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 6px 20px rgba(0,0,0,0.08)'
        }
      }
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined' },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#2D5A27',
            boxShadow: '0 0 0 2px rgba(45,90,39,0.15)'
          }
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backdropFilter: 'saturate(180%) blur(10px)'
        }
      }
    },
    MuiLink: {
      styleOverrides: {
        root: { transition: 'color 0.2s ease' }
      }
    }
  }
});

theme = responsiveFontSizes(theme);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <GlobalStyles styles={{
      ':root': {
        '--color-forest': '#2D5A27',
        '--color-coral': '#FF6B6B',
        '--color-cream': '#FFF8F3',
        '--color-warm-gray': '#F7F5F3',
        '--color-gold': '#FFB347',
        '--color-lavender': '#E8D5FF',
        '--text-primary': '#2C3E50',
        '--text-secondary': '#5A6C7D',
      },
      // macOS/Safari specific optimizations
      'html': {
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        textRendering: 'optimizeLegibility',
      },
      'body': {
        WebkitTapHighlightColor: 'transparent', // Remove tap highlights on Safari
        touchAction: 'manipulation', // Improve touch performance
      },
      // macOS Safari input styling
      'input[type="text"], input[type="email"], input[type="password"], input[type="number"], textarea': {
        WebkitAppearance: 'none',
        borderRadius: '8px',
      },
      // Improved scrolling for macOS
      '*': {
        scrollBehavior: 'smooth',
        WebkitOverflowScrolling: 'touch', // Momentum scrolling on iOS/macOS
      },
      '@keyframes floatSlow': {
        '0%': { transform: 'translateY(0)' },
        '50%': { transform: 'translateY(-8px)' },
        '100%': { transform: 'translateY(0)' }
      },
      '@keyframes float': {
        '0%': { transform: 'translateY(0px) rotate(0deg)' },
        '33%': { transform: 'translateY(-10px) rotate(120deg)' },
        '66%': { transform: 'translateY(5px) rotate(240deg)' },
        '100%': { transform: 'translateY(0px) rotate(360deg)' }
      },
      '.glass': {
        background: 'rgba(255,255,255,0.65)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        backdropFilter: 'saturate(180%) blur(12px)',
        WebkitBackdropFilter: 'saturate(180%) blur(12px)', // Safari support
        border: '1px solid rgba(255,255,255,0.6)'
      },
      '.floating': {
        animation: 'floatSlow 6s ease-in-out infinite'
      },
      // Enhanced focus styles for macOS accessibility
      'a:focus-visible, button:focus-visible, [role="button"]:focus-visible': {
        outline: '3px solid rgba(255,179,71,0.6)',
        outlineOffset: 2
      },
      // macOS dark mode support
      '@media (prefers-color-scheme: dark)': {
        ':root': {
          colorScheme: 'light', // Force light mode for now, can be made dynamic later
        }
      },
      // Retina display optimizations
      '@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)': {
        'img': {
          imageRendering: '-webkit-optimize-contrast',
        }
      }
    }} />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ThemeProvider>
);
