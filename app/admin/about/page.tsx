'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, Divider, Avatar, TextField, Button, CircularProgress, Stack } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function AboutPage() {
  // État pour stocker toutes les données du profil (nom, bio, images, etc.)
  const [info, setInfo] = useState<any>(null);
  // État pour gérer l'affichage du chargement pendant la sauvegarde
  const [saving, setSaving] = useState(false);

  // Fonction générique pour uploader un fichier (image ou PDF) sur le serveur
  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) return data.filename;
      throw new Error(data.error);
    } catch (err) {
      console.error("Erreur upload:", err);
      alert("L'upload a échoué");
      return null;
    }
  };

  // Au montage du composant, on récupère les données actuelles depuis l'API
  useEffect(() => {
    fetch('/api/about')
      .then((res) => res.json())
      .then((data) => setInfo(data));
  }, []);

  // Fonction pour envoyer les modifications au serveur
  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(info),
      });

      if (response.ok) {
        alert('Profil mis à jour !');
      } else {
        alert('Erreur lors de la sauvegarde.');
      }
    } catch (error) {
      alert('Erreur réseau.');
    } finally {
      setSaving(false);
    }
  };

  // Affichage d'un message d'attente tant que les données ne sont pas chargées
  if (!info) return <Typography sx={{ p: 3 }}>Chargement...</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      {/* En-tête de la page avec le bouton de sauvegarde */}
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          Mon profil - A propos de moi
        </Typography>
        <Button 
          variant="contained" 
          startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
          onClick={handleSave}
          disabled={saving}
          sx={{
          ml:4,
         }}
        >
          Enregistrer
        </Button>
      </Stack>

      <Grid container spacing={3}>
        {/* Colonne de gauche : Identité visuelle (Avatar, Logo, Bannière) */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
            {/* Gestion de l'avatar */}
            <Avatar
              src={`/uploads/${info.avatar}`}
              sx={{ width: 120, height: 120, mx: 'auto', mb: 2, border: '3px solid #1976d2' }}
            />

            <Button component="label" size="small" variant="outlined" startIcon={<CloudUploadIcon />} sx={{ mb: 2 }}>
              Changer Photo
              <input hidden accept="image/*" type="file" onChange={async (e) => {
                if (e.target.files?.[0]) {
                  const fileName = await uploadFile(e.target.files[0]);
                  if (fileName) setInfo({ ...info, avatar: fileName });
                }
              }} />
            </Button>

            {/* Champs pour le logo et la phrase d'accroche */}
            <TextField
              fullWidth label="Nom Logo" size="small" sx={{ mb: 2 }}
              value={info.nom_logo}
              onChange={(e) => setInfo({ ...info, nom_logo: e.target.value })}
            />

            <TextField
              fullWidth label="Phrase d'accroche" size="small" multiline rows={2}
              value={info.phrase_logo}
              onChange={(e) => setInfo({ ...info, phrase_logo: e.target.value })}
            />

            <Divider sx={{ my: 2 }} />

            {/* Gestion de la bannière de profil */}
            <Typography variant="subtitle2" sx={{ textAlign: 'left', mb: 1 }}>Bannière :</Typography>
            <Box component="img" src={`/uploads/${info.banner}`} sx={{ width: '100%', borderRadius: 1, height: 80, objectFit: 'cover', mb: 1, opacity: 0.8 }} />

            <Button component="label" fullWidth size="small" variant="outlined" startIcon={<CloudUploadIcon />}>
              Changer Bannière
              <input hidden accept="image/*" type="file" onChange={async (e) => {
                if (e.target.files?.[0]) {
                  const fileName = await uploadFile(e.target.files[0]);
                  if (fileName) setInfo({ ...info, banner: fileName });
                }
              }} />
            </Button>
          </Paper>
        </Grid>

        {/* Colonne de droite : Informations textuelles et CV */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom color="primary">Informations générales</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth label="Titre Bio"
                  value={info.titre_bio || ''}
                  onChange={(e) => setInfo({ ...info, titre_bio: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth label="Email Contact"
                  value={info.email_contact || ''}
                  onChange={(e) => setInfo({ ...info, email_contact: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth label="Texte d'introduction" multiline rows={4}
                  value={info.texte_intro || ''}
                  onChange={(e) => setInfo({ ...info, texte_intro: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth label="Téléphone"
                  value={info.telephone || ''}
                  onChange={(e) => setInfo({ ...info, telephone: e.target.value })}
                />
              </Grid>

              {/* Section d'upload du CV (PDF uniquement) */}
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Fichier CV (PDF)</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />}>
                    Importer CV
                    <input hidden accept="application/pdf" type="file" onChange={async (e) => {
                      if (e.target.files?.[0]) {
                        const fileName = await uploadFile(e.target.files[0]);
                        if (fileName) setInfo({ ...info, cv_file: fileName });
                      }
                    }} />
                  </Button>
                  <Typography variant="body2" sx={{ color: 'error.main' }}>
                    {info.cv_file}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}