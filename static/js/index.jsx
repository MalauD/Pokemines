import Axios from 'axios';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import '../index.css';

import TopNav from './Components/TopNav';
import { ThemeProvider, createTheme } from '@mui/material/styles';

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
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <Router>
                <Routes>
                    <Route path="/" element={<TopNav />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App />);
