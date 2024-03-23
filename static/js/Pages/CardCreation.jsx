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
import { Rarity, RarityName, RarityPrice, RarityQuantity } from '../CardRarity';
import Card from '../Components/Cards/Card';

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
    const [cardName, setCardName] = useState('');
    const [cardStrength, setCardStrength] = useState('');
    const [cardWeakness, setCardWeakness] = useState('');
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
            data.append('card_count', RarityQuantity[rarityLevel]);
            data.append('price', RarityPrice[rarityLevel]);
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
                        autoFocus
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                    />

                    <TextField
                        fullWidth
                        id="strength"
                        name="strength"
                        margin="normal"
                        multiline
                        rows={2}
                        label="Force de la carte"
                        value={cardStrength}
                        onChange={(e) => setCardStrength(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        id="weakness"
                        name="weakness"
                        margin="normal"
                        multiline
                        rows={2}
                        label="Faiblesse de la carte"
                        value={cardWeakness}
                        onChange={(e) => setCardWeakness(e.target.value)}
                    />
                    <FormControl fullWidth margin="normal">
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
                        <FormHelperText>
                            Points : {cardPoints}, Exemplaires: {RarityQuantity[rarityLevel]}, Prix:{' '}
                            {RarityPrice[rarityLevel]}
                        </FormHelperText>
                    </FormControl>
                    <Button
                        component="label"
                        role={undefined}
                        fullWidth
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<CloudUpload />}
                        margin="normal"
                        sx={{ color: 'white' }}
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
                        <Grid
                            container
                            direction="column"
                            alignItems="center"
                            justifyContent="center"
                            sx={{ mt: 2 }}
                        >
                            <Grid item>
                                <Card
                                    name={cardName}
                                    strength={cardStrength}
                                    weakness={cardWeakness}
                                    points={cardPoints}
                                    image={imagePreview}
                                    count={RarityQuantity[rarityLevel]}
                                />
                            </Grid>
                        </Grid>
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
