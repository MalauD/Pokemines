import { Box, Button, Grid, Paper, TextField, Typography } from '@mui/material';
import React from 'react';
import Axios from 'axios';
import { useSnackbar } from 'notistack';

export default function DonateToEveryonePage() {
    const [amount, setAmount] = React.useState(0);
    const enqueueSnackbar = useSnackbar();

    const donateToEveryone = () => {
        Axios.post('/api/user/all/donate', { amount: parseInt(amount, 10) }).then(() => {
            enqueueSnackbar(`Les (${amount} MNO$) ont bien été donnés à tous les utilisateurs`, {
                variant: 'success',
            });
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
                <Typography component="h1" variant="h5" sx={{ mb: 2 }} align="center">
                    Donner de l&apos;argent à tous les utilisateurs
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={8}>
                        <TextField
                            fullWidth
                            id="amount"
                            label="Montant (MNO$)"
                            type="number"
                            variant="outlined"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ mt: 2, color: 'white' }}
                            onClick={donateToEveryone}
                        >
                            Valider
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
}
