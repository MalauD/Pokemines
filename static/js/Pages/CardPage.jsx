import {
    Box,
    Button,
    CircularProgress,
    Grid,
    Paper,
    Slider,
    TextField,
    Typography,
} from '@mui/material';
import React, { useState } from 'react';
import Axios from 'axios';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { LineChart } from '@mui/x-charts/LineChart';
import Card from '../Components/Cards/Card';
import MarketPlaceTransactionList from '../Components/Transactions/MarketPlaceTransactionList';
import CurrentUserContext from '..';
import SearchAccount from '../Components/Search/SearchAccount';
import MarketPlaceCardOwners from '../Components/Transactions/MarketPlaceCardOwners';
import { getInitialRarityPrice } from '../CardRarity';

const groupCardByUser = (cards) => {
    const grouped = {};
    cards.forEach((card) => {
        if (!grouped[card.owner._id]) {
            grouped[card.owner._id] = {
                owner: card.owner,
                quantity: 0,
            };
        }
        grouped[card.owner._id].quantity += 1;
    });
    return Object.values(grouped);
};

function CardPage() {
    const { cardNumber } = useParams();
    const [loading, setLoading] = useState(true);
    const [cards, setCards] = useState({});
    const [transactions, setTransactions] = useState([]);
    const { currentUser, setCurrentUser } = React.useContext(CurrentUserContext);
    const { enqueueSnackbar } = useSnackbar();
    const [ownedCards, setOwnedCards] = useState([]);
    const [sellingPrice, setSellingPrice] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [priceHistory, setPriceHistory] = useState([]);
    const [adminSelectedUser, setAdminSelectedUser] = useState(null);
    const [donationQuantity, setDonationQuantity] = useState(1);

    const alreadyInMarketPlaceCards = transactions
        .filter((t) => t.sender._id === currentUser._id)
        .map((t) => t.transaction_type.sender_card._id);
    const candidates = ownedCards.filter((c) => !alreadyInMarketPlaceCards.includes(c._id));

    React.useEffect(() => {
        Axios.get(`/api/card/number/${cardNumber}`).then((res) => {
            setCards(res.data);
            setSellingPrice(getInitialRarityPrice(res.data[0].points));
            setOwnedCards(res.data.filter((c) => c.owner._id === currentUser._id));

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

    const onTransactionCancelled = (cancelledTransactions) => {
        const cancelledTransactionsIds = cancelledTransactions.map((t) => t._id);
        setTransactions((prev) => prev.filter((t) => !cancelledTransactionsIds.includes(t._id)));
    };

    const onDonate = () => {
        if (!adminSelectedUser) {
            enqueueSnackbar('Veuillez sélectionner un utilisateur', { variant: 'error' });
            return;
        }
        if (donationQuantity <= 0) {
            enqueueSnackbar('La quantité doit être positive', { variant: 'error' });
            return;
        }
        if (candidates.length < donationQuantity) {
            enqueueSnackbar("Vous n'avez pas assez de cartes à donner", { variant: 'error' });
            return;
        }
        const cardsToDonate = candidates.slice(0, donationQuantity);
        Axios.post(`/api/user/${adminSelectedUser.id}/transfer`, {
            card_ids: cardsToDonate.map((c) => c._id),
        }).then(() => {
            enqueueSnackbar('Cartes données avec succès', { variant: 'success' });
            setOwnedCards((prev) => prev.filter((c) => !cardsToDonate.includes(c)));
            setCurrentUser({
                ...currentUser,
                cards: currentUser.cards.filter(
                    (c) => !cardsToDonate.map((cD) => cD._id).includes(c)
                ),
            });
        });
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

    const initial_price = getInitialRarityPrice(cards[0].points);
    const max_price = Math.round(initial_price * 1.07);
    const min_price = Math.round(initial_price * 0.93);

    const sliderMarks = [
        {
            value: min_price,
            label: `${min_price} MNO$`,
        },
        {
            value: initial_price,
            label: `${initial_price} MNO$`,
        },
        {
            value: max_price,
            label: `${max_price} MNO$`,
        },
    ];

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
                <Card {...cards[0]} />
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
                            <Grid item xs={8}>
                                <Slider
                                    valueLabelDisplay="auto"
                                    max={max_price}
                                    min={min_price}
                                    marks={sliderMarks}
                                    value={sellingPrice}
                                    onChange={(_, value) => setSellingPrice(value)}
                                    track={false}
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
                            showSelection
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
                <Typography variant="h5" gutterBottom sx={{ pt: 2 }}>
                    Propriétaires
                </Typography>
                <MarketPlaceCardOwners cards={groupCardByUser(cards)} />
                {currentUser.admin && candidates.length > 0 ? (
                    <>
                        <Typography
                            component="h1"
                            variant="h5"
                            sx={{ mb: 2, mt: 5 }}
                            align="center"
                        >
                            Administration
                        </Typography>
                        <Grid container spacing={2} alignItems="center" justify="center">
                            <Grid item xs={4}>
                                <SearchAccount onAccountSelected={setAdminSelectedUser} />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Quantité"
                                    variant="outlined"
                                    fullWidth
                                    type="number"
                                    sx={{ mt: 2 }}
                                    value={donationQuantity}
                                    onChange={(e) => setDonationQuantity(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    sx={{ color: 'white' }}
                                    onClick={onDonate}
                                >
                                    Donner à{' '}
                                    {adminSelectedUser ? adminSelectedUser.first_name : '...'}
                                </Button>
                            </Grid>
                        </Grid>
                    </>
                ) : null}
            </Paper>
        </Box>
    );
}

export default CardPage;
