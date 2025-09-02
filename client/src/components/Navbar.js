import React from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Avatar from '@mui/material/Avatar';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Logo from './Logo';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));
  const [open, setOpen] = React.useState(false);

  // Hide navbar on auth pages for a cleaner look
  if (location.pathname === '/login' || location.pathname === '/register') return null;

  const cartCount = items.reduce((sum, it) => sum + (it.quantity || 1), 0);
  const isActive = (path) => location.pathname.startsWith(path);

  const canDonate = user && (user.role === 'seller' || user.role === 'customer');
  const links = [
    { label: 'Products', to: '/products', show: true },
    { label: 'Orders', to: '/orders', show: true },
    { label: 'Donate', to: '/donate', show: canDonate },
    { label: 'Donations', to: '/donations', show: canDonate },
    { label: 'Seller', to: '/seller', show: user?.role === 'seller' },
    { label: 'Admin', to: '/admin', show: user?.role === 'admin' },
    { label: 'Support', to: '/complaint', show: canDonate },
  ];

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{
        mb: 2,
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        backgroundColor: 'rgba(255,248,243,0.85)',
        backdropFilter: 'saturate(180%) blur(10px)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}
    >
      <Toolbar sx={{ maxWidth: 1800, mx: 'auto', width: '100%', flexWrap: 'nowrap', display: 'flex', alignItems: 'center', minHeight: 70, px: { xs: 2, md: 2 } }}>
        {/* Left: Logo - flexible but minimum size */}
        <Box sx={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', mr: 1 }}>
          <Link component={RouterLink} to="/products" color="inherit" underline="none" sx={{ display: 'inline-flex', alignItems: 'center', '&:hover': { opacity: 0.9 } }}>
            <Logo withText size={28} textSize={16} />
          </Link>
        </Box>
        {/* Center: Nav - takes available space */}
        <Box sx={{ flex: '1 1 auto', display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center', gap: 1.5, mx: 1 }}>
          {links.filter(l => l.show).map(l => (
            <Button
              key={l.to}
              component={RouterLink}
              to={l.to}
              color={isActive(l.to) ? 'secondary' : 'inherit'}
              sx={{
                height: 40,
                px: 1.5,
                py: 1,
                borderRadius: 1,
                textTransform: 'none',
                fontWeight: isActive(l.to) ? 700 : 500,
                color: isActive(l.to) ? 'secondary.main' : 'text.primary',
                backgroundColor: isActive(l.to) ? 'rgba(255,107,107,0.12)' : 'transparent',
                fontSize: 14,
                minWidth: 'auto',
                whiteSpace: 'nowrap',
                '&:hover': { backgroundColor: 'rgba(45,90,39,0.06)', color: 'primary.main' }
              }}
            >
              {l.label}
            </Button>
          ))}
        </Box>

        {/* Right: User actions - flexible but constrained */}
        <Box sx={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1.5, ml: 1 }}>
          {/* Cart: button on desktop, icon on mobile */}
  {isMdUp ? (
            <Button
              component={RouterLink}
              to="/cart"
      color={isActive('/cart') ? 'secondary' : 'inherit'}
        sx={{ height: 40, px: 1.5, textTransform: 'none', fontWeight: isActive('/cart') ? 700 : 500, color: isActive('/cart') ? 'secondary.main' : 'text.primary', fontSize: 14 }}
              startIcon={
                <Badge color="secondary" badgeContent={cartCount} invisible={!cartCount} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} sx={{ '& .MuiBadge-badge': { top: 2, right: 2, minWidth: 20, height: 20, fontSize: 12, fontWeight: 700 } }}>
                  <ShoppingCartIcon />
                </Badge>
              }
            >
              Cart
            </Button>
          ) : (
            <IconButton color="inherit" component={RouterLink} to="/cart" aria-label="Cart" sx={{ width: 40, height: 40 }}>
              <Badge color="secondary" badgeContent={cartCount} invisible={!cartCount} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} sx={{ '& .MuiBadge-badge': { top: 2, right: 2, minWidth: 18, height: 18, fontSize: 11, fontWeight: 700 } }}>
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          )}

          {/* Auth buttons on desktop */}
          {isMdUp && (
            user ? (
              <>
                <Button component={RouterLink} to="/profile" color={isActive('/profile') ? 'secondary' : 'inherit'} sx={{ height: 40, px: 1.5, color: isActive('/profile') ? 'secondary.main' : 'text.primary', fontSize: 14 }}>
                  Profile
                </Button>
                <Avatar sx={{ width: 36, height: 36, border: '2px solid #e2e8f0' }}>{(user.name || user.email || 'U').charAt(0).toUpperCase()}</Avatar>
                <Button variant="contained" color="secondary" sx={{ height: 40, px: 1.5, textTransform: 'none', color: '#fff', fontSize: 14 }} onClick={() => { logout(); navigate('/login'); }}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button component={RouterLink} to="/login" color={isActive('/login') ? 'secondary' : 'inherit'} sx={{ height: 40, px: 1.5, textTransform: 'none', color: isActive('/login') ? 'secondary.main' : 'text.primary', fontSize: 14 }}>
                  Login
                </Button>
                <Button component={RouterLink} to="/register" color={isActive('/register') ? 'secondary' : 'inherit'} variant="contained" sx={{ height: 40, px: 1.5, textTransform: 'none', fontSize: 14 }}>
                  Register
                </Button>
              </>
            )
          )}

          {/* Mobile menu toggle */}
          {!isMdUp && (
            <IconButton color="inherit" onClick={() => setOpen(true)} aria-label="Open menu">
              <MenuIcon />
            </IconButton>
          )}
        </Box>

        {/* Mobile Drawer */}
  <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
          <Box sx={{ width: 280, display: 'flex', flexDirection: 'column', height: '100%' }} role="presentation">
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1 }}>
              <Link component={RouterLink} to="/products" color="inherit" underline="none" onClick={() => setOpen(false)}>
    <Logo withText size={32} textSize={18} />
              </Link>
              <IconButton onClick={() => setOpen(false)} aria-label="Close menu">
                <CloseIcon />
              </IconButton>
            </Box>
            <Divider />
            <List>
              {links.filter(l => l.show).map(l => (
                <ListItemButton key={l.to} component={RouterLink} to={l.to} selected={isActive(l.to)} onClick={() => setOpen(false)}>
                  <ListItemText primary={l.label} />
                </ListItemButton>
              ))}
              <ListItemButton component={RouterLink} to="/cart" onClick={() => setOpen(false)}>
                <Badge color="secondary" badgeContent={cartCount} invisible={!cartCount} sx={{ mr: 1 }}>
                  <ShoppingCartIcon />
                </Badge>
                <ListItemText primary="Cart" />
              </ListItemButton>
            </List>
            <Divider />
            <Box sx={{ mt: 'auto', p: 2, display: 'flex', gap: 1 }}>
              {user ? (
                <>
                  <Button fullWidth variant="outlined" onClick={() => { setOpen(false); navigate('/profile'); }}>Profile</Button>
                  <Button fullWidth variant="contained" color="error" onClick={() => { setOpen(false); logout(); navigate('/login'); }}>Logout</Button>
                </>
              ) : (
                <>
                  <Button fullWidth variant="outlined" onClick={() => { setOpen(false); navigate('/login'); }}>Login</Button>
                  <Button fullWidth variant="contained" onClick={() => { setOpen(false); navigate('/register'); }}>Register</Button>
                </>
              )}
            </Box>
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
}
