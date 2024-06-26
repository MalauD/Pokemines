import * as React from 'react';
import Box from '@mui/material/Box';
import Axios from 'axios';
import CardLayout from '../Components/Cards/CardLayout';
import Boosters from '../Components/Booster/Boosters';

export default function Marche() {
    const [cards, setCards] = React.useState([]);

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
            <Boosters />
            <CardLayout cards={cards} title="Marché" />
        </Box>
    );
}
