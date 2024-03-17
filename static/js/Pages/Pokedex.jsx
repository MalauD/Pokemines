import React from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import CardLayout from '../Components/Cards/CardLayout';
import CurrentUserContext from '..';

export default function Pokedex() {
    const [cards, setCards] = React.useState([]);
    const { currentUser } = React.useContext(CurrentUserContext);

    React.useEffect(() => {
        Axios.get(`/api/user/${currentUser._id}/cards`).then((res) => {
            const { data } = res;
            const cs = data.map((group) => group.cards[0]);
            setCards(cs);
        });
    }, []);

    return (
        <Box sx={{ height: 400, margin: 5, marginTop: 0 }}>
            <CardLayout cards={cards} />
        </Box>
    );
}
