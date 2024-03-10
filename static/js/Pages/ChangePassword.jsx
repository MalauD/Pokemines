import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import React from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ChangePassword() {
    const navigate = useNavigate();
    const [error, setError] = React.useState(null);

    const handleSubmit = (event) => {
        event.preventDefault();
        setError(null);
        const data = new FormData(event.currentTarget);
        if (data.get('newpassword') !== data.get('newpassword2')) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }
        if (data.get('newpassword').length < 8) {
            setError('Le mot de passe doit contenir au moins 8 caractères');
            return;
        }
        Axios.post('/api/auth/change_password', {
            password: data.get('password'),
            new_password: data.get('newpassword'),
        })
            .then(() => {
                navigate('/moi');
            })
            .catch(() => {
                setError('Erreur lors du changement de mot de passe');
            });
    };

    return (
        <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Paper sx={{ pl: '8vw', pr: '8vw', pt: '4vh', pb: '4vh' }}>
                <Typography component="h1" variant="h4" sx={{ mb: 5 }} align="center">
                    Changer de mot de passe
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
                        label="Ancien mot de passe"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="newpassword"
                        label="Nouveau mot de passe"
                        type="password"
                        id="newpassword"
                        autoComplete="new-password"
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="newpassword2"
                        label="Confirmer le nouveau mot de passe"
                        type="password"
                        id="newpassword2"
                        autoComplete="new-password"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2, color: '#fff' }}
                    >
                        Changer de mot de passe
                    </Button>
                    {error && (
                        <Typography variant="body2" color="error">
                            {error}
                        </Typography>
                    )}
                </Box>
            </Paper>
        </Box>
    );
}

export default ChangePassword;
