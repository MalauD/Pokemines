import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import React from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CurrentUserContext from '..';

function MyAccount() {
    const { currentUser, setCurrentUser } = React.useContext(CurrentUserContext);
    const navigate = useNavigate();

    const { mail, first_name, last_name, promo, admin } = currentUser;

    const logout = () => {
        Axios.post('/api/auth/logout')
            .then(() => {
                setCurrentUser(null);
                navigate('/');
            })
            .catch(() => {
                setCurrentUser(null);
                navigate('/');
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
            <Paper sx={{ pl: 10, pr: 10, pt: 5, pb: 5 }}>
                <Typography component="h1" variant="h4" sx={{ mb: 5 }} align="center">
                    Mon Compte
                </Typography>
                <Typography component="h2" variant="h6">
                    Mail : {mail}
                </Typography>
                <Typography component="h3" variant="h6">
                    Prénom : {first_name}
                </Typography>
                <Typography component="h4" variant="h6">
                    Nom : {last_name}
                </Typography>{' '}
                {promo ? (
                    <Typography component="h5" variant="h6">
                        Promo : {promo}
                    </Typography>
                ) : null}
                {admin ? (
                    <Typography component="h6" variant="h6">
                        Admin
                    </Typography>
                ) : null}
                <Grid container spacing={2} sx={{ mt: 3 }}>
                    <Grid item>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ color: '#fff' }}
                            onClick={() => navigate('/changermdp')}
                        >
                            Modifier mon mot de passe
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ color: '#fff' }}
                            onClick={logout}
                        >
                            Se déconnecter
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
}

export default MyAccount;
