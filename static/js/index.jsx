import Axios from 'axios';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import '../index.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, CircularProgress } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import LexendFont from '../fonts/Lexend-VariableFont_wght.ttf';

import TopNav from './Components/TopNav';
import Accueil from './Pages/Accueil';
import Login from './Pages/Login';
import MyAccount from './Pages/MyAccount';
import ProtectedRoute from './ProtectedRoute';
import ChangePassword from './Pages/ChangePassword';
import UserAccount from './Pages/UserAccount';
import Admin from './Pages/Admin';
import CardCreation from './Pages/CardCreation';
import Marche from './Pages/Marche';
import Transaction from './Pages/Transaction';
import CardPage from './Pages/CardPage';
import UserCreation from './Pages/UserCreation';
import Pokedex from './Pages/Pokedex';
import LeaderboardPage from './Pages/LeaderboardPage';

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

const CurrentUserContext = React.createContext();

function App() {
    const [currentUser, setCurrentUser] = React.useState(null);
    const [isLoaded, setIsLoaded] = React.useState(false);

    // Check on page load if the user is connected
    React.useEffect(() => {
        Axios.get('/api/user/me')
            .then((res) => {
                if (res.status === 200) {
                    setCurrentUser(res.data);
                }
                setIsLoaded(true);
            })
            .catch(() => {
                setCurrentUser(null);
                setIsLoaded(true);
            });
    }, []);

    if (!isLoaded) {
        // center <CircularProgress /> in the middle of the screen
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <SnackbarProvider maxSnack={3}>
                {/* eslint-disable-next-line react/jsx-no-constructed-context-values */}
                <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
                    <Router>
                        <TopNav />
                        <Box component="main" sx={{ paddingTop: 10 }}>
                            <Routes>
                                <Route path="/" element={<Accueil />} />
                                <Route path="/connexion" element={<Login />} />
                                <Route
                                    path="/moi"
                                    element={<ProtectedRoute Component={MyAccount} />}
                                />
                                <Route
                                    path="/changermdp"
                                    element={<ProtectedRoute Component={ChangePassword} />}
                                />
                                <Route
                                    path="/utilisateur/:userId"
                                    element={<ProtectedRoute Component={UserAccount} />}
                                />
                                <Route
                                    path="/admin"
                                    element={<ProtectedRoute Component={Admin} />}
                                />
                                <Route
                                    path="/marche"
                                    element={<ProtectedRoute Component={Marche} />}
                                />
                                <Route
                                    path="/utilisateur/:userId/pokedex/"
                                    element={<ProtectedRoute Component={Pokedex} />}
                                />
                                <Route
                                    path="/pokedex/"
                                    element={<ProtectedRoute Component={Pokedex} />}
                                />

                                <Route path="/leaderboard" element={<LeaderboardPage />} />
                                <Route
                                    path="/transaction/:transactionId"
                                    element={<ProtectedRoute Component={Transaction} />}
                                />
                                <Route
                                    path="/admin/card/create"
                                    element={<ProtectedRoute Component={CardCreation} />}
                                />
                                <Route
                                    path="/admin/utilisateur/create"
                                    element={<ProtectedRoute Component={UserCreation} />}
                                />
                                <Route
                                    path="/carte/numero/:cardNumber"
                                    element={<ProtectedRoute Component={CardPage} />}
                                />
                            </Routes>
                        </Box>
                    </Router>
                </CurrentUserContext.Provider>
            </SnackbarProvider>
        </ThemeProvider>
    );
}

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App />);

export default CurrentUserContext;
