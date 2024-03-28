import React from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Button,
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import Axios from 'axios';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import CurrentUserContext from '..';
import CardReveal from '../Components/Cards/CardReveal';

const icon_path = [
    '/Cards/Icons/icon_common.webp',
    '/Cards/Icons/icon_rare.webp',
    '/Cards/Icons/icon_epic.webp',
    '/Cards/Icons/icon_legendary.webp',
];

function DisplayBoosterOptions({ options }) {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 200 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Issues</TableCell>
                        <TableCell align="right">Probabilité</TableCell>
                        <TableCell align="right">Composition</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {options.map((row, index) => (
                        <TableRow
                            // eslint-disable-next-line react/no-array-index-key
                            key={index + 1}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {index + 1}
                            </TableCell>
                            <TableCell align="right">{row.probability * 100}%</TableCell>
                            <TableCell align="right">
                                {row.composition.map((card_count, level) =>
                                    [...Array(card_count)].map(() => (
                                        <img
                                            src={icon_path[level]}
                                            alt="icon"
                                            style={{ width: 20, margin: 2 }}
                                        />
                                    ))
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

DisplayBoosterOptions.propTypes = {
    options: PropTypes.arrayOf(
        PropTypes.shape({
            probability: PropTypes.number.isRequired,
            composition: PropTypes.arrayOf(PropTypes.number).isRequired,
        })
    ).isRequired,
};

export default function BoosterBuyPage() {
    const [booster, setBooster] = React.useState(null);
    const { boosterId } = useParams();
    const [boosterCards, setBoosterCards] = React.useState(null);
    const { currentUser, setCurrentUser } = React.useContext(CurrentUserContext);
    const { enqueueSnackbar } = useSnackbar();

    React.useEffect(() => {
        Axios.get('/api/card/booster/all').then((response) => {
            setBooster(response.data[boosterId]);
        });
    }, []);

    const handleBuy = () => {
        if (currentUser.account_balance < booster.price) {
            enqueueSnackbar('Solde insuffisant', { variant: 'error' });
        }
        Axios.post(`/api/card/booster/${boosterId}/pay`)
            .then((cards) => {
                setBoosterCards(cards.data);
                setCurrentUser({
                    ...currentUser,
                    account_balance: currentUser.account_balance - booster.price,
                    cards: [...currentUser.cards, cards],
                });
            })
            .catch((error) => {
                if (error.response) {
                    if (error.response.data.includes('NotEnoughCards')) {
                        enqueueSnackbar("Ce booster n'est plus disponible", {
                            variant: 'error',
                        });
                    } else if (error.response.data.includes('InsufficientFunds')) {
                        enqueueSnackbar('Solde insuffisant', { variant: 'error' });
                    }
                    return;
                }
                enqueueSnackbar('Erreur inconnue', { variant: 'error' });
            });
    };

    if (boosterCards) {
        return (
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
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
                    <Typography variant="h4" gutterBottom>
                        Ouverture du {booster.name}
                    </Typography>
                    <CardReveal
                        cards={boosterCards}
                        onRevealEnd={() => {
                            setBoosterCards(null);
                        }}
                    />
                </Paper>
            </Box>
        );
    }

    if (!booster) {
        return (
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
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
                <Typography variant="h4" gutterBottom>
                    {booster.name}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Prix : {booster.price} MNO$
                </Typography>
                <DisplayBoosterOptions options={booster.options} />
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ color: 'white', marginTop: 2, minWidth: '200px' }}
                    onClick={handleBuy}
                >
                    Acheter
                </Button>
            </Paper>
        </Box>
    );
}
