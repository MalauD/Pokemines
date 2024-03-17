import * as React from 'react';
import Box from '@mui/material/Box';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CardLayout from '../Cards/CardLayout';

export default function Marketplace() {
    const [cards, setCards] = React.useState([]);
    const navigate = useNavigate();

    React.useEffect(() => {
        Axios.get('/api/transaction/marketplace').then((res) => {
            const { data } = res;
            const cs = data.map(
                (transaction) => transaction.transactions[0].transaction_type.sender_card
            );
            setCards(cs);
        });
    }, []);

    return (
        <Box sx={{ height: 400, margin: 5, marginTop: 0 }}>
            <CardLayout cards={cards} />
        </Box>
    );
}
