import { Box, Button, Paper, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Admin() {
    const navigate = useNavigate();

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
                    Administration
                </Typography>
                <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 2, color: 'white' }}
                    onClick={() => navigate('/admin/card/create')}
                >
                    Créer des cartes
                </Button>
            </Paper>
        </Box>
    );
}

export default Admin;
