'use client';

import * as React from 'react';
import { useMemo } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { NextAppProvider } from '@toolpad/core/nextjs';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import type { Navigation } from '@toolpad/core/AppProvider';
import { createTheme } from '@mui/material/styles';
import { Box, LinearProgress } from '@mui/material';

import DashboardIcon from '@mui/icons-material/Dashboard';
import LayersIcon from '@mui/icons-material/Layers';
import BarChartIcon from '@mui/icons-material/BarChart';
import EmailIcon from '@mui/icons-material/Email';
import LinkIcon from '@mui/icons-material/Link';
import PersonIcon from '@mui/icons-material/Person';
import LabelIcon from '@mui/icons-material/Label';
import LogoutIcon from '@mui/icons-material/Logout';

//Gestion de tous les onglets de la barre de navigation de l'admin
const NAVIGATION: Navigation = [
  { kind: 'header', title: 'Gestion Portfolio' },
  { segment: 'admin', title: 'Dashboard', icon: <DashboardIcon /> },
  { segment: 'admin/projets', title: 'Mes Projets', icon: <LayersIcon /> },
  { segment: 'admin/categories', title: 'Catégories', icon: <LabelIcon /> },
  { segment: 'admin/competences', title: 'Compétences', icon: <BarChartIcon /> },
  { segment: 'admin/messages', title: 'Messages', icon: <EmailIcon /> },
  { segment: 'admin/reseaux', title: 'Réseaux Sociaux', icon: <LinkIcon /> },
  { segment: 'admin/about', title: 'Mon Profil - A propos', icon: <PersonIcon /> },
];

const BRANDING = {
  title: 'Admin',
};
//Configuration des couleurs pour le mode clair et sombre de l'interface admin
const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: {
    light: {
      palette: {
        background: {
          default: '#f5f5f5', 
          paper: '#ffffff',   
        },
        text: {
          primary: '#1a1a1a',
        }
      },
    },
    dark: {
      palette: {
        background: {
          default: '#050a0f',
          paper: '#0d1117',
        },
        text: {
          primary: '#ffffff',
        }
      },
    },
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        h4: {
          color: 'var(--muidp-palette-text-primary)',
          fontWeight: 'bold',
          marginBottom: '24px',
        },
      },
    },
  },
});

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  //La fonction s'active lorsqu'on clique sur le bouton de déconnexion. Cela nous redirige vers la page de connexion
  const authentication = useMemo(() => ({
    signIn: () => {},
    signOut: () =>{
      return signOut({ callbackUrl: '/login', redirect: true });
    },
  }), []);

  
  const sessionData = useMemo(() => ({
    user: {
      name: session?.user?.name || 'Admin',
      email: '',
      image: '', 
    },
  }), [session]);

  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <React.Suspense fallback={<LinearProgress />}> 
        <NextAppProvider 
          navigation={NAVIGATION} 
          branding={BRANDING}
          session={sessionData}
          authentication={authentication}
          theme={demoTheme}

        >
          <DashboardLayout>
            
            <Box sx={{ 
              bgcolor: 'background.default', 
              minHeight: '100vh', 
              p: 3 
            }}>
              {children}
            </Box>
          </DashboardLayout>
        </NextAppProvider>
      </React.Suspense>
    </AppRouterCacheProvider>
  );
}