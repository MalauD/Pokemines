import { Box, Button, CircularProgress, Grid, Paper, TextField, Typography } from '@mui/material';
import React from 'react';
import Axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import CurrentUserContext from '..';

function UserAccount() {
    const [user, setUser] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [donationAmount, setDonationAmount] = React.useState(0);
    const { userId } = useParams();
    const { currentUser } = React.useContext(CurrentUserContext);
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

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

    const onDonate = () => {
        const donation = parseInt(donationAmount, 10);
        Axios.post(`/api/user/${userId}/donate`, { amount: donation }).then(() => {
            setUser((prevUser) => ({
                ...prevUser,
                account_balance: prevUser.account_balance + donation,
            }));
            setDonationAmount(0);
            enqueueSnackbar(`Donation de ${donation} MNO$ effectuée`, { variant: 'success' });
        });
    };

    const { first_name, last_name, promo, admin, account_balance, rank } = user;

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
                <Typography component="h5" gutterBottom variant="h6">
                    Argent : {account_balance} MNO$
                </Typography>
                <Typography component="h5" gutterBottom variant="h6">
                    Rang : {rank}
                    {rank === 1 ? 'er' : 'ème'}
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
                {currentUser.admin ? (
                    <>
                        <Typography
                            component="h1"
                            variant="h5"
                            sx={{ mb: 2, mt: 5 }}
                            align="center"
                        >
                            Administration
                        </Typography>
                        <Grid container spacing={2} alignItems="center" justify="center">
                            <Grid item>
                                <TextField
                                    fullWidth
                                    label="Montant"
                                    type="number"
                                    variant="outlined"
                                    value={donationAmount}
                                    onChange={(e) => setDonationAmount(e.target.value)}
                                />
                            </Grid>
                            <Grid item>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    sx={{ color: 'white' }}
                                    onClick={onDonate}
                                >
                                    Donner à {first_name}
                                </Button>
                            </Grid>
                        </Grid>
                    </>
                ) : null}
            </Paper>
        </Box>
    );
}

export default UserAccount;
