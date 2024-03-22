import styled from '@emotion/styled';
import { CloudUpload } from '@mui/icons-material';
import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { Rarity, RarityName } from '../CardRarity';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

function CardCreation() {
    const [imagePreview, setImagePreview] = useState(null);
    const [image, setImage] = useState(null);
    const [error, setError] = useState(null);
    const [rarityLevel, setRarityLevel] = useState(0);

    const navigate = useNavigate();

    const cardPoints = React.useMemo(() => {
        const rarity = Rarity[rarityLevel];
        return Math.floor(Math.random() * (rarity.max - rarity.min) + rarity.min);
    }, [rarityLevel]);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setImage(file);
        const imageUrl = URL.createObjectURL(file);
        setImagePreview(imageUrl);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Create multipart form data
        const data = new FormData(event.currentTarget);
        // Send the form data to the server
        if (imagePreview !== null) {
            data.append('image', image);
            data.append('points', cardPoints);
            Axios.post('/api/card/upload', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then(() => {
                    navigate('/admin');
                })
                .catch(() => {
                    setError('Erreur lors de la création de la carte');
                });
        }
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
                    Création de cartes
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
                        fullWidth
                        id="name"
                        label="Nom de la carte"
                        name="name"
                        margin="normal"
                    />

                    <TextField
                        fullWidth
                        id="strength"
                        name="strength"
                        margin="normal"
                        multiline
                        rows={2}
                        label="Force de la carte"
                    />
                    <TextField
                        fullWidth
                        id="weakness"
                        name="weakness"
                        margin="normal"
                        multiline
                        rows={2}
                        label="Faiblesse de la carte"
                    />
                    <Grid container spacing={1} direction="row" margin="normal">
                        <Grid item xs={4}>
                            <TextField
                                id="card_count"
                                label="Exemplaires"
                                type="number"
                                name="card_count"
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <InputLabel id="select-points-label">Rareté</InputLabel>
                                <Select
                                    labelId="select-points-label"
                                    id="select-points"
                                    value={rarityLevel}
                                    onChange={(e) => setRarityLevel(e.target.value)}
                                    autoWidth
                                    label="Rareté"
                                >
                                    {Rarity.map((_, i) => (
                                        <MenuItem value={i}>{RarityName[i]}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Points : {cardPoints}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField id="price" label="Prix" type="number" name="price" />
                        </Grid>
                    </Grid>
                    <Button
                        component="label"
                        role={undefined}
                        fullWidth
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<CloudUpload />}
                        sx={{ mt: 2, color: 'white' }}
                    >
                        Charger une image
                        <VisuallyHiddenInput
                            type="file"
                            accept="image/*"
                            aria-label="Charger une image"
                            onChange={handleImageChange}
                        />
                    </Button>
                    {imagePreview && (
                        <img
                            src={imagePreview}
                            alt="Preview"
                            style={{ width: '100%', marginTop: '1rem' }}
                        />
                    )}
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

export default CardCreation;
