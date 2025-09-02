import React from 'react';
import { useAuth } from '../context/AuthContext';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return <Container maxWidth="sm" sx={{ mt: 3 }}><Typography>Not logged in.</Typography></Container>;

  return (
    <Container maxWidth="sm" sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>My Profile</Typography>
        <Grid container spacing={1.5}>
          <Grid item xs={12}><Typography><strong>Name:</strong> {user.name}</Typography></Grid>
          <Grid item xs={12}><Typography><strong>Email:</strong> {user.email}</Typography></Grid>
          <Grid item xs={12}><Typography><strong>Role:</strong> {user.role}</Typography></Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
