'use client';

import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { 
  Box, Typography, Paper, IconButton, Stack, 
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Divider 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EmailIcon from '@mui/icons-material/Email';

export default function MessagesPage() {
  // État pour stocker la liste des messages récupérés en base
  const [rows, setRows] = useState([]);
  // État pour stocker le message complet lorsqu'on clique sur l'oeil pour le lire
  const [selectedMsg, setSelectedMsg] = useState<any>(null); 

  // Récupération des messages via l'API 
  const loadData = () => {
    fetch('/api/messages')
      .then(res => res.json())
      .then(data => setRows(Array.isArray(data) ? data : []));
  };

  // Chargement des données au premier rendu de la page
  useEffect(() => { loadData(); }, []);

  // Suppression d'un message avec une demande de confirmation 
  const handleDelete = async (id: number) => {
    if (confirm('Supprimer ce message ?')) {
      await fetch('/api/messages', { 
        method: 'DELETE', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }) 
      });
      loadData();
    }
  };

  // Configuration des colonnes du DataGrid de MUI
  const columns: GridColDef[] = [
    { 
      field: 'date_creation', 
      headerName: 'Date', 
      width: 150, 
      valueFormatter: (value) => {
        // Formatage de la date SQL en format lisible français (JJ/MM/AAAA)
        if (!value) return '';
        return new Date(value).toLocaleString('fr-FR', {
          day: '2-digit', month: '2-digit', year: 'numeric',
        });
      },
    },
    { field: 'nom', headerName: 'Nom', width: 100 },
    { field: 'prenom', headerName: 'Prénom', width: 100 },
    { field: 'email', headerName: 'Email', width: 170 },
    { field: 'sujet', headerName: 'Sujet', width: 150 }, 
    { field: 'contenu', headerName: 'Message', flex: 1, minWidth: 150 }, 
    {
      field: 'actions',
      headerName: 'Actions',
      width: 110, 
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5}>
          {/* Bouton pour ouvrir la modale de lecture */}
          <IconButton color="primary" size="small" onClick={() => setSelectedMsg(params.row)}>
            <VisibilityIcon fontSize="small" />
          </IconButton>
          {/* Bouton de suppression directe */}
          <IconButton color="error" size="small" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ p: 2 }}>
      {/* Titre principal de la section admin */}
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'text.primary' }}>
        Messages reçus
      </Typography>
      
      {/* Conteneur du tableau de données */}
      <Paper sx={{ height: 500, width: '100%', boxShadow: 3 }}>
        <DataGrid 
          rows={rows} 
          columns={columns} 
          disableRowSelectionOnClick 
          localeText={{ noRowsLabel: 'Aucun message pour le moment' }}
        />
      </Paper>

      {/* Modale de visualisation du message sélectionné */}
      <Dialog open={Boolean(selectedMsg)} onClose={() => setSelectedMsg(null)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EmailIcon color="primary" /> {selectedMsg?.sujet || 'Détails du message'}
        </DialogTitle>
        <DialogContent dividers>
          {selectedMsg && (
            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" color="textSecondary">Expéditeur :</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {selectedMsg.prenom} {selectedMsg.nom}
                </Typography>
                <Typography variant="body2" color="primary">
                  {selectedMsg.email}
                </Typography>
              </Box>
              
              <Divider />

              <Box>
                <Typography variant="caption" color="textSecondary">Message :</Typography>
                <Typography variant="body1" sx={{ mt: 1, whiteSpace: 'pre-wrap', bgcolor: 'action.hover', p: 2, borderRadius: 1 }}>
                  {selectedMsg.contenu}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="textSecondary">Reçu le :</Typography>
                <Typography variant="body2">
                  {new Date(selectedMsg.date_creation).toLocaleString('fr-FR')}
                </Typography>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedMsg(null)}>Fermer</Button>
          {/* Utilisation de mailto pour ouvrir directement le logiciel de messagerie par défaut */}
          <Button 
            variant="contained" 
            href={`mailto:${selectedMsg?.email}?subject=Réponse à votre message`}
          >
            Répondre
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}