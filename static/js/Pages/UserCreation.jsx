import {
    Box,
    Button,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Modal,
    Paper,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function UserCreation() {
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        Axios.post('/api/auth/create_user', {
            ...Object.fromEntries(data),
            account_balance: parseFloat(data.get('account_balance')),
            password: 'password',
        })
            .then((res) => {
                setPassword(res.data.password);
                setOpen(true);
            })
            .catch(() => {
                setError('Erreur lors de la création de la carte');
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
            <Modal
                open={open}
                onClose={() => navigate('/admin')}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Mot de passe généré
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {password}
                    </Typography>
                </Box>
            </Modal>
            <Paper sx={{ pl: '8vw', pr: '8vw', pt: '4vh', pb: '4vh' }}>
                <Typography component="h1" variant="h5" sx={{ mb: 2 }} align="center">
                    Création d'un utilisateur
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField fullWidth id="mail" label="Mail" name="mail" margin="normal" />
                    <TextField
                        fullWidth
                        id="first_name"
                        label="Prénom"
                        name="first_name"
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        id="last_name"
                        label="Nom"
                        name="last_name"
                        margin="normal"
                    />
                    <Grid container spacing={0} direction="row">
                        <Grid item xs={6}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="promo-select-label">Promo</InputLabel>
                                <Select
                                    id="promo"
                                    label="Promo"
                                    name="promo"
                                    labelId="promo-select-label"
                                    defaultValue="PNA"
                                >
                                    <MenuItem value="PNA">NA</MenuItem>
                                    <MenuItem value="P2A">2A</MenuItem>
                                    <MenuItem value="P3A">3A</MenuItem>
                                    <MenuItem value="P4A">4A</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                id="account_balance"
                                label="Solde"
                                name="account_balance"
                                type="number"
                                margin="normal"
                                InputProps={{ inputProps: { min: 0 } }}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, color: 'white' }}
                    >
                        Créer
                    </Button>
                    {error && (
                        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                            {error}
                        </Typography>
                    )}
                </Box>
            </Paper>
        </Box>
    );
}
