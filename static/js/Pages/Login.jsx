import React from 'react';
import Axios from 'axios';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CurrentUserContext from '..';

function Login() {
    const navigate = useNavigate();
    const [error, setError] = React.useState(false);
    const { setCurrentUser } = React.useContext(CurrentUserContext);

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        Axios.post('/api/auth/login', {
            mail: data.get('mail'),
            password: data.get('password'),
        })
            .then((res) => {
                if (res.status === 200) {
                    Axios.get('/api/user/me')
                        .then((res2) => {
                            if (res2.status === 200) {
                                setCurrentUser(res2.data);
                                navigate('/');
                            }
                        })
                        .catch(() => {
                            setError(true);
                        });
                }
            })
            .catch(() => {
                setError(true);
            });
    };

    return (
        <Box
            sx={{
                marginTop: '80px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ pl: '8vw', pr: '8vw', pt: '4vh', pb: '4vh' }}
            >
                <Typography component="h1" variant="h5" sx={{ mb: 1 }}>
                    Connexion
                </Typography>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="mail"
                    label="Adresse mail"
                    name="mail"
                    autoComplete="email"
                    autoFocus
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Mot de passe"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2, color: '#fff' }}
                >
                    Se connecter
                </Button>
                {error && (
                    <Typography variant="body2" color="error">
                        Identifiants incorrects
                    </Typography>
                )}
            </Box>
        </Box>
    );
}

export default Login;
