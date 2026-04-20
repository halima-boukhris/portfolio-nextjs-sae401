'use client';

import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { 
  Button, Box, Typography, Paper, IconButton, Stack, 
  Dialog, DialogTitle, DialogContent, DialogActions, TextField 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

export default function CompetencesPage() {
  // Liste des compétences récupérées en BDD
  const [rows, setRows] = useState([]);
  // État pour la modale (ouverte/fermée)
  const [open, setOpen] = useState(false);
  // Switch pour savoir si on est en train de créer ou de modifier une ligne
  const [isEditing, setIsEditing] = useState(false);
  
  // Données locales du formulaire (nom et classe d'icône FontAwesome)
  const [formData, setFormData] = useState({
    id: null,
    icone: 'fa-solid fa-star',
    texte: ''
  });

  // Chargement des données depuis l'API
  const loadData = () => {
    fetch('/api/competences')
      .then(res => res.json())
      .then(data => setRows(Array.isArray(data) ? data : []))
      .catch(err => console.error("Erreur:", err));
  };

  useEffect(() => { loadData(); }, []);

  // Ouvre la modale en mode "Ajout" avec des valeurs par défaut
  const handleOpenAdd = () => {
    setIsEditing(false);
    setFormData({ id: null, icone: 'fa-solid fa-star', texte: '' });
    setOpen(true);
  };

  // Ouvre la modale en mode "Édition" avec les données de la ligne
  const handleOpenEdit = (comp: any) => {
    setIsEditing(true);
    setFormData(comp);
    setOpen(true);
  };

  const handleSave = async () => {
    // On bascule entre POST (création) et PUT (mise à jour) selon le mode
    const method = isEditing ? 'PUT' : 'POST';
    
    try {
      const res = await fetch('/api/competences', {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        // Si c'est bon, on ferme et on rafraîchit la liste
        setOpen(false);
        loadData();
      }
    } catch (err) {
      console.error("Erreur sauvegarde:", err);
    }
  };

  // Suppression avec une sécurité (confirm)
  const handleDelete = async (id: number) => {
    if (confirm('Supprimer cette compétence ?')) {
      await fetch('/api/competences', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      loadData();
    }
  };

  // Définition des colonnes du tableau MUI DataGrid
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { 
      field: 'icone_preview', 
      // Rendu dynamique de l'icône FontAwesome pour l'aperçu
      headerName: 'Aperçu', 
      width: 80,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', fontSize: '1.2rem' }}>
          <i className={params.row.icone}></i>
        </Box>
      )
    },
    { field: 'icone', headerName: 'Classe CSS', width: 150 },
    { field: 'texte', headerName: 'Nom de la compétence', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          {/* Actions : Modifier ou Supprimer */}
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
    <Box sx={{ p: 2 }}>
      {/* En-tête avec titre et bouton d'ajout */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          Mes Compétences
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd}
         sx={{
          ml:4,
         }}>
          Ajouter 
        </Button>
      </Stack>

      {/* Tableau d'affichage */}
      <Paper sx={{ height: 450, width: '100%', boxShadow: 3 }}>
        <DataGrid 
          rows={rows} 
          columns={columns} 
          pageSizeOptions={[5, 10]} 
          disableRowSelectionOnClick
        />
      </Paper>

      {/* Modale unique pour l'Ajout et la Modification */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>{isEditing ? 'Modifier la compétence' : 'Nouvelle compétence'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Nom de la compétence"
              fullWidth
              value={formData.texte}
              onChange={(e) => setFormData({ ...formData, texte: e.target.value })}
            />
            <TextField
              label="Classe FontAwesome"
              fullWidth
              value={formData.icone}
              onChange={(e) => setFormData({ ...formData, icone: e.target.value })}
            />
            
            {/* Aperçu en temps réel de l'icône pendant qu'on tape la classe */}
            <Box sx={{ p: 2, border: '1px dashed', borderColor: 'divider', borderRadius: 2, textAlign: 'center', bgcolor: 'action.hover' }}>
              <Typography variant="caption" display="block" sx={{ mb: 1 }}>Aperçu de l'icône :</Typography>
              <i className={formData.icone} style={{ fontSize: '2rem', color: '#1976d2' }}></i>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Annuler</Button>
          {/* Bouton désactivé si les champs sont vides pour éviter les erreurs en base */}
          <Button variant="contained" onClick={handleSave} disabled={!formData.texte || !formData.icone}>
            {isEditing ? 'Mettre à jour' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}