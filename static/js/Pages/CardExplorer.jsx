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

    return (
        <Box sx={{ height: 400, margin: 5, marginTop: 0 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Explorer
            </Typography>
            <TextField
                id="outlined-basic"
                label="Search"
                variant="outlined"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ marginBottom: 2, width: '100%' }}
            />
            <CardLayout cards={cards} />
        </Box>
    );
}
