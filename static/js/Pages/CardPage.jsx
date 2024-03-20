import { Box, Button, CircularProgress, Grid, Paper, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import Axios from 'axios';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { LineChart } from '@mui/x-charts/LineChart';
import Card from '../Components/Cards/Card';
import MarketPlaceTransactionList from '../Components/Transactions/MarketPlaceTransactionList';
import CurrentUserContext from '..';

function CardPage() {
    const { cardNumber } = useParams();
    const [loading, setLoading] = useState(true);
    const [card, setCard] = useState({});
    const [transactions, setTransactions] = useState([]);
    const { currentUser, setCurrentUser } = React.useContext(CurrentUserContext);
    const { enqueueSnackbar } = useSnackbar();
    const [ownedCards, setOwnedCards] = useState([]);
    const [sellingPrice, setSellingPrice] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [priceHistory, setPriceHistory] = useState([]);

    const alreadyInMarketPlaceCards = transactions
        .filter((t) => t.sender._id === currentUser._id)
        .map((t) => t.transaction_type.sender_card._id);
    const candidates = ownedCards.filter((c) => !alreadyInMarketPlaceCards.includes(c._id));

    React.useEffect(() => {
        Axios.get(`/api/card/number/${cardNumber}`).then((res) => {
            setCard(res.data[0]);
            setOwnedCards(res.data.filter((c) => c.owner.$oid === currentUser._id));

            Axios.get(`/api/transaction/number/${cardNumber}?status=Waiting`).then((res2) => {
                const { data } = res2;
                setTransactions(data);
                setLoading(false);
            });
            Axios.get(`/api/transaction/number/${cardNumber}?status=Completed`).then((res2) => {
                const p = res2.data.map((t) => ({
                    price: t.transaction_type.price,
                    date: new Date(t.completed_at.$date.$numberLong / 1),
                }));
                setPriceHistory(p.sort((a, b) => a.date.getTime() - b.date.getTime()));
            });
        });
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
        setOwnedCards((prev) => [...prev, transaction.transaction_type.sender_card]);
        setCurrentUser({
            ...currentUser,
            account_balance: currentUser.account_balance - transaction.transaction_type.price,
            cards: [...currentUser.cards, transaction.transaction_type.sender_card._id],
        });
    };

    const onTransactionCancelled = (transaction) => {
        setTransactions((prev) => prev.filter((t) => t._id !== transaction._id));
    };

    const sellCard = () => {
        if (sellingPrice <= 0) {
            enqueueSnackbar('Le prix de vente doit être positif', { variant: 'error' });
            return;
        }
        if (quantity <= 0) {
            enqueueSnackbar('La quantité doit être positive', { variant: 'error' });
            return;
        }
        if (candidates.length < quantity) {
            enqueueSnackbar("Vous n'avez pas assez de cartes à vendre", { variant: 'error' });
            return;
        }
        Axios.post('/api/transaction/sell', {
            card_ids: candidates.slice(0, quantity).map((c) => c._id),
            price: parseInt(sellingPrice, 10),
        }).then((res) => {
            const newTransactions = res.data;
            setTransactions([...transactions, ...newTransactions]);
            enqueueSnackbar(`${newTransactions.length} cartes ajoutées au marché`, {
                variant: 'success',
            });
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
                    transactions={transactions.filter((t) => t.sender._id !== currentUser._id)}
                    onTransactionCompleted={onTransactionCompleted}
                    onTransactionCancelled={onTransactionCancelled}
                />
                <Typography variant="h5" gutterBottom sx={{ pt: 2 }}>
                    {ownedCards.length !== 0
                        ? `Vous possédez ${ownedCards.length} exemplaires de cette carte (dont ${candidates.length} à vendre)`
                        : 'Vous ne possédez pas cette carte'}
                </Typography>
                {ownedCards.length > 0 && (
                    <>
                        <Grid
                            container
                            spacing={2}
                            alignItems="center"
                            justifyContent="center"
                            sx={{ mb: 2 }}
                        >
                            <Grid item xs={5}>
                                <TextField
                                    label="Prix de vente"
                                    variant="outlined"
                                    fullWidth
                                    type="number"
                                    sx={{ mt: 2, height: '100%' }}
                                    value={sellingPrice}
                                    onChange={(e) => setSellingPrice(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={5}>
                                <TextField
                                    label="Quantité"
                                    variant="outlined"
                                    fullWidth
                                    type="number"
                                    sx={{ mt: 2, height: '100%' }}
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={5}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={sellCard}
                                    sx={{ mt: 0, color: 'white', height: '100%' }}
                                >
                                    Mettre en vente
                                </Button>
                            </Grid>
                        </Grid>
                        <MarketPlaceTransactionList
                            transactions={transactions.filter(
                                (t) => t.sender._id === currentUser._id
                            )}
                            onTransactionCompleted={onTransactionCompleted}
                            onTransactionCancelled={onTransactionCancelled}
                        />
                    </>
                )}
                <Typography variant="h5" gutterBottom sx={{ pt: 2 }}>
                    Historique des prix
                </Typography>
                <LineChart
                    xAxis={[
                        {
                            dataKey: 'date',
                            name: 'Date',
                            valueFormatter: (date) => date.toLocaleString(),
                            scaleType: 'time',
                        },
                    ]}
                    series={[
                        {
                            dataKey: 'price',
                            name: 'Prix',
                        },
                    ]}
                    dataset={priceHistory}
                    height={300}
                    yAxis={[
                        {
                            type: 'number',
                            min: 0,
                        },
                    ]}
                />
            </Paper>
        </Box>
    );
}

export default CardPage;
