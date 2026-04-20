'use client';

import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { 
  Box, Typography, Paper, IconButton, Button, Stack, 
  Dialog, DialogTitle, DialogContent, DialogActions, TextField 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

export default function CategoriesPage() {
  // Liste des catégories affichées dans le tableau
  const [rows, setRows] = useState([]);
  // Contrôle de l'ouverture de la modale (Dialog)
  const [open, setOpen] = useState(false);
  // Flag pour savoir si on est en train de créer ou de modifier
  const [isEditing, setIsEditing] = useState(false);
  // Données temporaires du formulaire
  const [formData, setFormData] = useState({ id: null, name: '' });

  // Récupération des catégories depuis mon API
  const loadCategories = () => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setRows(Array.isArray(data) ? data : []));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Prépare le formulaire pour une nouvelle catégorie
  const handleOpenAdd = () => {
    setIsEditing(false);
    setFormData({ id: null, name: '' });
    setOpen(true);
  };

  // Remplit le formulaire avec les données de la catégorie à modifier
  const handleOpenEdit = (category: any) => {
    setIsEditing(true);
    setFormData(category);
    setOpen(true);
  };

  const handleSave = async () => {
    // On choisit la méthode HTTP selon le mode (création ou édition)
    const method = isEditing ? 'PUT' : 'POST';
    const res = await fetch('/api/categories', {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      // Si c'est ok, on ferme la modale et on rafraîchit la liste
      setOpen(false);
      loadCategories();
    } else {
      // Gestion d'erreur basique
      const err = await res.json();
      alert(err.error || "Une erreur est survenue");
    }
  };

  // Suppression d'une catégorie avec confirmation
  const handleDelete = async (id: number) => {
    if (confirm('Supprimer cette catégorie ? Cela pourrait impacter vos projets.')) {
      const res = await fetch('/api/categories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Erreur lors de la suppression");
      }
      // On recharge la liste même en cas d'erreur pour être synchro avec la DB
      loadCategories();
    }
  };

  // Configuration des colonnes pour le composant DataGrid de MUI
  const columns: GridColDef[] = [ 
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Nom de la catégorie', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          {/* Boutons d'édition et de suppression dans chaque ligne */}
          <IconButton color="primary" onClick={() => handleOpenEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* En-tête de la page */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          Gestion des Catégories
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={handleOpenAdd}
          sx={{ borderRadius: 2, ml: 4 }}
        >
          Ajouter
        </Button>
      </Stack>

      {/* Tableau des données */}
      <Paper sx={{ height: 450, width: '100%', boxShadow: 3, borderRadius: 2, overflow: 'hidden' }}>
        <DataGrid 
          rows={rows} 
          columns={columns} 
          disableRowSelectionOnClick
          sx={{ border: 0 }}
          localeText={{ noRowsLabel: 'Aucune catégorie disponible' }}
        />
      </Paper>

      {/* Modale d'ajout / modification */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          {isEditing ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            autoFocus
            label="Nom de la catégorie"
            fullWidth
            variant="outlined"
            sx={{ mt: 1 }}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)} color="inherit">Annuler</Button>
          <Button 
            variant="contained" 
            onClick={handleSave} 
            disabled={!formData.name.trim()}
            // Désactivé si le champ est vide
          >
            {isEditing ? 'Mettre à jour' : 'Enregistrer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}