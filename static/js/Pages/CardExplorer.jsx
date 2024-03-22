import React from 'react';
import Axios from 'axios';
import { Box, TextField, Typography } from '@mui/material';
import CardLayout from '../Components/Cards/CardLayout';

export default function CardExplorer() {
    const [cards, setCards] = React.useState([]);
    const [search, setSearch] = React.useState('');

    React.useEffect(() => {
        Axios.get(`/api/card/search?q=${search}`).then((res) => {
            const { data } = res;
            setCards(data);
        });
    }, [search]);

    const accessory = (
        <TextField
            id="outlined-basic"
            label="Rechercher par nom..."
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ marginBottom: 2, width: '100%' }}
        />
    );

    return (
        <Box sx={{ height: 400, margin: 5, marginTop: 0 }}>
            <CardLayout cards={cards} accessory={accessory} title="Explorer" />
        </Box>
    );
}
