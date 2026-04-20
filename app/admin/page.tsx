'use client';

import React, { useState, useEffect } from 'react';
import { Typography, Paper, Box, Grid, Card, CardContent, CircularProgress } from '@mui/material';

export default function AdminDashboard() {
  //On crée un objet pour stocker le nombre de projets, compétences et messages
  const [stats, setStats] = useState({ projets: 0, competences: 0, messages: 0 });
  const [loading, setLoading] = useState(true);

  //On récupère les statistiques depuis l'API pour les afficher dans les cartes du dashboard dès que la page s'affiche
  useEffect(() => {
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      });
  }, []);

  
  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

  return (
    <Box>
      
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'text.primary' }}>
        Tableau de bord
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        
        
        <Grid item xs={12} sm={4}>
          <Card sx={{ 
            bgcolor: 'rgba(33, 150, 243, 0.1)', 
            borderLeft: '5px solid #2196f3',
            borderRadius: 2,
            boxShadow: 'none', 
            border: '1px solid',
            borderColor: 'divider'
          }}>
            <CardContent>
              <Typography sx={{ color: '#2196f3', fontWeight: 'bold' }} gutterBottom>Projets</Typography>
              <Typography variant="h4" sx={{ color: 'text.primary' }}>{stats.projets}</Typography>
            </CardContent>
          </Card>
        </Grid>

        
        <Grid item xs={12} sm={4}>
          <Card sx={{ 
            bgcolor: 'rgba(139, 195, 74, 0.1)', 
            borderLeft: '5px solid #8bc34a',
            borderRadius: 2,
            boxShadow: 'none',
            border: '1px solid',
            borderColor: 'divider'
          }}>
            <CardContent>
              <Typography sx={{ color: '#8bc34a', fontWeight: 'bold' }} gutterBottom>Compétences</Typography>
              <Typography variant="h4" sx={{ color: 'text.primary' }}>{stats.competences}</Typography>
            </CardContent>
          </Card>
        </Grid>

        
        <Grid item xs={12} sm={4}>
          <Card sx={{ 
            bgcolor: 'rgba(255, 152, 0, 0.1)', 
            borderLeft: '5px solid #ff9800',
            borderRadius: 2,
            boxShadow: 'none',
            border: '1px solid',
            borderColor: 'divider'
          }}>
            <CardContent>
              <Typography sx={{ color: '#ff9800', fontWeight: 'bold' }} gutterBottom>Messages reçus</Typography>
              <Typography variant="h4" sx={{ color: 'text.primary' }}>{stats.messages}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      

    </Box>
  );
}