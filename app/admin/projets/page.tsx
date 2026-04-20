'use client';

import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Typography, Paper, IconButton, Stack, Button, Avatar,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Select, InputLabel, FormControl
 } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

export default function ProjetsPage() {
  // Liste des projets pour le tableau
  const [rows, setRows] = useState([]);
  // Liste des catégories pour les menus déroulants (Select)
  const [categories, setCategories] = useState([]); 
  // Gestion de l'ouverture des deux modales
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false); 
  // Projet sélectionné pour la modification
  const [selectedProject, setSelectedProject] = useState<any>(null);
  // État local pour le formulaire de création
  const [formData, setFormData] = useState({
    title: '', description: '', image: '', video_url: '', category_id: '', position: 0
  });
  const [dragActive, setDragActive] = useState(false); // Pour l'effet visuel du drag & drop
  const [file, setFile] = useState<File | null>(null); // Le fichier image sélectionné

  // Fonction utilitaire pour uploader une image et récupérer son nom généré par le serveur
  const uploadFile = async (fileToUpload: File) => {
    const formDataUpload = new FormData();
    formDataUpload.append('file', fileToUpload);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formDataUpload, 
    });
    const data = await res.json();
    return data.filename; 
  };

  // Chargement des projets
  const loadData = () => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => setRows(Array.isArray(data) ? data : []))
      .catch(err => console.error("Erreur:", err));
  };

  // Chargement des catégories pour pouvoir les lier aux projets
  const loadCategories = () => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data : []));
  };

  useEffect(() => { 
    loadData(); 
    loadCategories(); 
  }, []);

  // Gestion du drag & drop visuel
  const handleDrag = (e: any) => {
    e.preventDefault();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  // Récupération du fichier après le drop
  const handleDrop = (e: any) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  // Suppression d'un projet
  const handleDelete = async (id: number) => {
    if (confirm('Supprimer ce projet ?')) {
      await fetch('/api/projects', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      loadData();
    }
  };

  // Initialise la modale d'édition avec les données du projet
  const handleEditClick = (project: any) => {
    setSelectedProject(project);
    setEditOpen(true);
  };

  // Enregistre les modifications d'un projet existant
  const handleUpdate = async () => {
    let updatedProject = { ...selectedProject };

    // Si on a sélectionné une nouvelle image, on l'uploade d'abord
    if (file) {
      const fileName = await uploadFile(file);
      if (fileName) {
        updatedProject.image = fileName;
      }
    }

    await fetch('/api/projects', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProject),
    });

    setEditOpen(false);
    setFile(null); 
    loadData();
  };

  // Crée un nouveau projet en base
  const handleSaveNew = async () => {
  let finalImageName = formData.image;

  // Upload de l'image si elle existe
  if (file) {
    const fileName = await uploadFile(file);
    if (fileName) {
      finalImageName = fileName;
    }
  }

  // Envoi des données complètes à l'API
  await fetch('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...formData, image: finalImageName }),
  });

  setAddOpen(false);
  setFile(null);
  loadData();
};

  // Configuration des colonnes du tableau
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 40 }, 
    { 
      field: 'image', 
      // Rendu personnalisé pour afficher l'image du projet ou l'initiale (si pas d'image)
      headerName: 'Aperçu', 
      width: 70, 
      renderCell: (params) => (
        <Avatar 
          src={params.value ? `/uploads/${params.value}` : ''} 
          variant="rounded" 
          sx={{ width: 40, height: 40, bgcolor: '#eee' }}
        >
          {params.row.title?.charAt(0).toUpperCase()}
        </Avatar>
      )
    },
    { field: 'title', headerName: 'Titre', width: 140 },
    { 
      field: 'category_name', 
      headerName: 'Catégorie', 
      width: 150, 
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          {params.value || 'Sans catégorie'}
        </Box>
      )
    },
    { 
      field: 'description', 
      headerName: 'Description', 
      flex: 1, 
      minWidth: 200 
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 110, 
      sortable: false,
      renderCell: (params) => (
        // Actions rapides : Editer et Supprimer
        <Stack direction="row" spacing={0.5} sx={{ height: '100%', alignItems: 'center' }}>
          <IconButton color="primary" size="small" onClick={() => handleEditClick(params.row)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton color="error" size="small" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ p: 2 }}>
      {/* En-tête */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'text.primary' }}>Mes Projets</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setFile(null); setAddOpen(true); }}
        
         sx={{
          ml:4,
         }}>
          Ajouter
        </Button>
      </Stack>

      {/* Tableau DataGrid */}
      <Paper sx={{ height: 500, width: '100%', boxShadow: 3 }}>
        <DataGrid rows={rows} columns={columns} pageSizeOptions={[5, 10]} disableRowSelectionOnClick />
      </Paper>

      {/* --- MODALE DE MODIFICATION --- */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Modifier le projet</DialogTitle>
        <DialogContent dividers>
          {selectedProject && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField label="Titre" fullWidth value={selectedProject.title} onChange={(e) => setSelectedProject({...selectedProject, title: e.target.value})} />
              
              <FormControl fullWidth>
                <InputLabel>Catégorie</InputLabel>
                <Select
                  value={selectedProject.category_id || ''}
                  label="Catégorie"
                  onChange={(e) => setSelectedProject({...selectedProject, category_id: e.target.value})}
                >
                  {categories.map((cat: any) => (
                    <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Zone de Drag & Drop pour l'image */}
              <Box
                onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                sx={{
                  border: '2px dashed',
                  
                  borderColor: dragActive ? 'primary.main' : 'divider',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  
                  bgcolor: dragActive ? 'rgba(25, 118, 210, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'rgba(25, 118, 210, 0.04)',
                    
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }
                }}
                component="label"
              >
                <input type="file" hidden onChange={(e) => e.target.files && setFile(e.target.files[0])} accept="image/*" />
                
                <Stack spacing={1} alignItems="center">
                  
                  <AddIcon color="primary" sx={{ fontSize: 40, opacity: 0.7 }} />
                  
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {file ? `Fichier prêt : ${file.name}` : "Cliquez pour parcourir ou glissez l'image"}
                  </Typography>
                  
                  <Typography variant="caption" color="textSecondary">
                    Format acceptés : JPG, PNG, WebP (Max 5Mo)
                  </Typography>
                  
                  {file && (
                    <Button size="small" variant="outlined" sx={{ mt: 1, pointerEvents: 'none' }}>
                      Changer de fichier
                    </Button>
                  )}
                </Stack>
              </Box>

              <TextField label="Description" multiline rows={3} fullWidth value={selectedProject.description} onChange={(e) => setSelectedProject({...selectedProject, description: e.target.value})} />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Annuler</Button>
          <Button variant="contained" onClick={handleUpdate}>Enregistrer</Button>
        </DialogActions>
      </Dialog>

      {/* --- MODALE D'AJOUT --- */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Ajouter un nouveau projet</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Titre" fullWidth value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
            
            <FormControl fullWidth>
              <InputLabel>Catégorie</InputLabel>
              <Select
                value={formData.category_id}
                label="Catégorie"
                onChange={(e) => setFormData({...formData, category_id: e.target.value})}
              >
                {categories.map((cat: any) => (
                  <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            
            <Box
              onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
              sx={{
                border: '2px dashed',
                
                borderColor: dragActive ? 'primary.main' : 'divider',
                borderRadius: 2,
                p: 3,
                textAlign: 'center',
                
                bgcolor: dragActive ? 'rgba(25, 118, 210, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'rgba(25, 118, 210, 0.04)',
                  
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }
              }}
              component="label"
            >
              <input type="file" hidden onChange={(e) => e.target.files && setFile(e.target.files[0])} accept="image/*" />
              
              <Stack spacing={1} alignItems="center">
                
                <AddIcon color="primary" sx={{ fontSize: 40, opacity: 0.7 }} />
                
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  {file ? `Fichier prêt : ${file.name}` : "Cliquez pour parcourir ou glissez l'image"}
                </Typography>
                
                <Typography variant="caption" color="textSecondary">
                  Format acceptés : JPG, PNG, WebP (Max 5Mo)
                </Typography>
                
                {file && (
                  <Button size="small" variant="outlined" sx={{ mt: 1, pointerEvents: 'none' }}>
                    Changer de fichier
                  </Button>
                )}
              </Stack>
            </Box>

            <TextField label="Description" multiline rows={3} fullWidth value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddOpen(false)}>Annuler</Button>
          <Button variant="contained" onClick={handleSaveNew}>Créer le projet</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}