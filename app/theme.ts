import { createTheme } from '@mui/material/styles';

export const getDesignTokens = (mode: 'light' | 'dark') => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          
          primary: { main: '#2196f3' },
          background: {
            default: '#f5f5f5', 
            paper: '#ffffff',   
          },
          text: {
            primary: '#1a1a1a',
            secondary: '#666666',
          },
        }
      : {
          
          primary: { main: '#90caf9' },
          background: {
            default: '#0a1929', 
            paper: '#132f4c',   
          },
          text: {
            primary: '#ffffff',
            secondary: '#b2bac2',
          },
        }),
  },
  shape: {
    borderRadius: 12, 
  },
});