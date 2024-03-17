import { Box, CircularProgress, Paper, Typography } from '@mui/material';
import React, { useState } from 'react';
import Axios from 'axios';
import { useParams } from 'react-router-dom';
import Card from '../Components/Cards/Card';
import MarketPlaceTransactionList from '../Components/Transactions/MarketPlaceTransactionList';
import CurrentUserContext from '..';

function CardPage() {
    const { cardNumber } = useParams();
    const [loading, setLoading] = useState(true);
    const [card, setCard] = useState({});
    const [transactions, setTransactions] = useState([]);
    const { currentUser, setCurrentUser } = React.useContext(CurrentUserContext);

    const RequestTransactionsByNumber = () => {
        Axios.get(`/api/transaction/number/${cardNumber}`).then((res) => {
            const { data } = res;
            setTransactions(data);
            setCard(data[0].transaction_type.sender_card);
            setLoading(false);
        });
    };

    React.useEffect(() => {
        RequestTransactionsByNumber();
    }, [cardNumber]);

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    const onTransactionCompleted = (transaction) => {
        setTransactions((prev) => prev.filter((t) => t._id !== transaction._id));
        setCurrentUser({
            ...currentUser,
            account_balance: currentUser.account_balance - transaction.transaction_type.price,
            cards: [...currentUser.cards, transaction.transaction_type.sender_card._id],
        });
    };

    return (
        <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                height: '100%',
            }}
        >
            <Paper
                sx={{
                    pl: '8vw',
                    pr: '8vw',
                    pt: '4vh',
                    pb: '4vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Card {...card} />
                <Typography variant="h5" gutterBottom sx={{ pt: 2 }}>
                    Ventes sur le marché
                </Typography>
                <MarketPlaceTransactionList
                    transactions={transactions}
                    onTransactionCompleted={onTransactionCompleted}
                />
            </Paper>
        </Box>
    );
}

export default CardPage;
