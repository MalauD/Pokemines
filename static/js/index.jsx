import Axios from 'axios';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import '../index.css';
import LexendFont from '../fonts/Lexend-VariableFont_wght.ttf';

import TopNav from './Components/TopNav';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Accueil from './Pages/Accueil';

Axios.defaults.withCredentials = true;

const theme = createTheme({
    palette: {
        primary: {
            main: '#FD8625',
        },
        secondary: {
            main: '#4C751E',
        },
    },
    typography: {
        fontFamily: 'Lexend, sans-serif',
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: `
                @font-face {
                    font-family: 'Lexend';
                    src: url(${LexendFont}) format('truetype');
                }
            `,
        },
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <TopNav />
            <Router>
                <Routes>
                    <Route path="/" element={<Accueil />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App />);
