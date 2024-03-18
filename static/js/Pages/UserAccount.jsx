import { Box, Button, CircularProgress, Paper, Typography } from '@mui/material';
import React from 'react';
import Axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function UserAccount() {
    const [user, setUser] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const { userId } = useParams();
    const navigate = useNavigate();

    const retrieveUser = () => {
        setIsLoading(true);
        Axios.get(`/api/user/${userId}`).then((res) => {
            setUser(res.data);
            setIsLoading(false);
        });
    };

    React.useEffect(() => {
        retrieveUser();
    }, [userId]);

    if (isLoading) {
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

    const { first_name, last_name, promo, admin } = user;

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
                <Typography component="h1" variant="h5" sx={{ mb: 2 }} align="center">
                    {first_name} {last_name}
                </Typography>
                {promo ? (
                    <Typography component="h5" gutterBottom variant="h6">
                        Promo : {promo}
                    </Typography>
                ) : null}
                {admin ? (
                    <Typography component="h6" gutterBottom variant="h6">
                        Admin
                    </Typography>
                ) : null}
                <Typography component="h6" gutterBottom variant="h6">
                    Possède {user.cards.length} cartes
                </Typography>
                <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2, color: '#fff' }}
                    onClick={() => navigate(`/utilisateur/${userId}/pokedex`)}
                >
                    Voir le pokedex
                </Button>
            </Paper>
        </Box>
    );
}

export default UserAccount;
