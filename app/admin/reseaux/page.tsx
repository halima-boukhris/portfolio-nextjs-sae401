'use client';

import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Typography, Paper, IconButton, TextField, Button, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'; 

export default function ReseauxPage() {
  // Liste des réseaux sociaux récupérés en base de données
  const [rows, setRows] = useState([]);

  // États pour gérer les champs du formulaire d'ajout
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newIcon, setNewIcon] = useState('');
  const [newPosition, setNewPosition] = useState(0);

  // États pour la gestion de la modale de modification
  const [editOpen, setEditOpen] = useState(false);
  // Stocke l'objet complet du réseau qu'on est en train de modifier
  const [selectedReseau, setSelectedReseau] = useState<any>(null);

  // Fonction pour charger la liste des réseaux
  const loadData = () => {
    fetch('/api/reseaux')
      .then((res) => res.json())
      .then((data) => setRows(Array.isArray(data) ? data : []));
  };

  // Au chargement de la page, on récupère les données
  useEffect(() => {
    loadData();
  }, []);

  // Ajout d'un nouveau réseau social
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newUrl) return;

    await fetch('/api/reseaux', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        name: newName,
        position: newPosition, 
        url: newUrl, 
        icon: newIcon || 'fa-link' 

      }),
    });

    // On remet les champs à zéro et on recharge le tableau
    setNewName('');
    setNewPosition(0);
    setNewUrl('');
    setNewIcon('');
    loadData();
  };

  // Suppression d'un réseau avec une confirmation de sécurité
  const handleDelete = async (id: number) => {
    if (confirm('Supprimer ce réseau social ?')) {
      await fetch('/api/reseaux', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      loadData();
    }
  };

  // Prépare et ouvre la modale d'édition
  const handleEditClick = (reseau: any) => {
    setSelectedReseau(reseau);
    setEditOpen(true);
  };

  // Configuration des colonnes pour le DataGrid de MUI
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Nom', width: 150 },
    { 
      field: 'icon', 
      headerName: 'Icône', 
      width: 180,
      renderCell: (params) => (
        // Aperçu visuel de l'icône FontAwesome
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, height: '100%' }}>
          <i className={`fa-brands ${params.value}`} style={{ fontSize: '1.2rem' }}></i>
          <span>{params.value}</span>
        </Box>
      )
    },
    { 
      field: 'url', 
      headerName: 'Lien', 
      width: 250,
      renderCell: (params) => (
        // Lien cliquable qui s'ouvre dans un nouvel onglet
        <a href={params.value} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'none' }}>
          {params.value}
        </a>
      )
    },
    { field: 'position', headerName: 'Ordre', width: 80 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120, 
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          {/* Actions : Modifier ou Supprimer */}
          <IconButton color="primary" onClick={() => handleEditClick(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </Stack>
      ),
    },
  ];

  // Enregistrement des modifications en base
  const handleUpdate = async () => {
    if (!selectedReseau) return;

    await fetch('/api/reseaux', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selectedReseau),
    });

    setEditOpen(false); 
    loadData(); 
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'text.primary' }}>
        Gestion des Réseaux Sociaux
      </Typography>

      {/* Formulaire d'ajout rapide en haut de page */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Ajouter un nouveau lien</Typography>
        <Box component="form" onSubmit={handleAdd}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="Nom (ex: LinkedIn)"
              variant="outlined"
              size="small"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
              sx={{ flex: 1 }}
            />
            <TextField
              label="URL"
              variant="outlined"
              size="small"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              required
              sx={{ flex: 2 }}
            />
            <TextField
              label="Icône FontAwesome (ex: fa-github)"
              variant="outlined"
              size="small"
              value={newIcon}
              onChange={(e) => setNewIcon(e.target.value)}
              sx={{ flex: 1 }}
            />
            <TextField
              label="Ordre"
              type="number"
              size="small"
              value={newPosition}
              onChange={(e) => setNewPosition(parseInt(e.target.value) || 0)}
              sx={{ width: 80 }}
            />
            <Button 
              type="submit" 
              variant="contained" 
              startIcon={<AddIcon />}
              sx={{ px: 3 }}
            >
              Ajouter
            </Button>
          </Stack>
        </Box>
      </Paper>

      {/* Liste principale sous forme de tableau */}
      <Paper sx={{ height: 500, width: '100%', boxShadow: 3 }}>
        <DataGrid 
          rows={rows} 
          columns={columns} 
          disableRowSelectionOnClick 
          sx={{ border: 0 }}
          localeText={{ noRowsLabel: 'Aucun réseau trouvé' }}
        />
      </Paper>

      {/* Dialogue pour la modification d'un réseau existant */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Modifier le réseau social</DialogTitle>
        <DialogContent dividers>
          {selectedReseau && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField 
                label="Nom" 
                fullWidth 
                value={selectedReseau.name} 
                onChange={(e) => setSelectedReseau({...selectedReseau, name: e.target.value})} 
              />
              <TextField 
                label="URL" 
                fullWidth 
                value={selectedReseau.url} 
                onChange={(e) => setSelectedReseau({...selectedReseau, url: e.target.value})} 
              />
              <TextField 
                label="Icône" 
                fullWidth 
                value={selectedReseau.icon} 
                onChange={(e) => setSelectedReseau({...selectedReseau, icon: e.target.value})} 
              />
              <TextField 
                label="Ordre" 
                type="number" 
                fullWidth 
                value={selectedReseau.position} 
                onChange={(e) => setSelectedReseau({...selectedReseau, position: parseInt(e.target.value) || 0})} 
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Annuler</Button>
          <Button variant="contained" onClick={handleUpdate}>Enregistrer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}