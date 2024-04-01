import React from 'react';
import Axios from 'axios';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Link,
} from '@mui/material';
import Leaderboard from '../Components/Leaderboard/Leaderboard';
import CardLayout from '../Components/Cards/CardLayout';

function Accueil() {
    const [latestCards, setLatestCards] = React.useState([]);

    const rows2 = [
        {
            for_who: 'Top 1',
            nom: 'Nintendo Switch',
            illustration: '/Lots/lot_switch_1er.jpg',
        },
        {
            for_who: 'Top 2',
            nom: 'Un drone avec une caméra ',
            illustration: '/Lots/lot_drone_2e.jpg',
        },
        {
            for_who: 'Top 3',
            nom: 'Deux entrées au Parc d’attraction Walygator',
            illustration: '/Lots/lot_wallygator_3e.jpeg',
        },
    ];

    React.useEffect(() => {
        Axios.get('/api/card/latest?limit=5').then((response) => {
            setLatestCards(response.data);
        });
    }, []);

    return (
        <>
            <Leaderboard limit={100} pageSize={10} />
            <Box sx={{ pl: '8vw', pr: '8vw' }}>
                {latestCards.length === 0 ? null : (
                    <CardLayout
                        onlyShowTitle
                        cards={latestCards}
                        title="Les dernières cartes créées"
                    />
                )}
                <Typography variant="h4" sx={{ mt: 2 }} gutterBottom>
                    Les lots à gagner
                </Typography>
                <Typography
                    variant="body1"
                    sx={{ textJustify: 'inter-word', textAlign: 'justify' }}
                    gutterBottom
                >
                    Bien sûr, à la fin de la campagne, de nombreux lots seront distribués à ceux qui
                    auront le plus de points du jeu, ci-dessous un petit tableau de tous les lots à
                    gagner à l’issue de la semaine campagne, si vous excellez à Pokémines.
                </Typography>
                <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
                    <Table sx={{ minWidth: 300 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Illustration</TableCell>
                                <TableCell>Nom du lot</TableCell>
                                <TableCell>Pour qui ?</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows2.map((row) => (
                                <TableRow
                                    key={row.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        <img
                                            src={row.illustration}
                                            alt="icon"
                                            style={{ width: 150, marginLeft: 2 }}
                                        />
                                    </TableCell>
                                    <TableCell>{row.nom}</TableCell>
                                    <TableCell>{row.for_who}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Typography
                    variant="body1"
                    sx={{ textJustify: 'inter-word', textAlign: 'justify', mb: 40 }}
                    gutterBottom
                >
                    Pour les autres lots et plus de détails rendez-vous la page{' '}
                    <Link href="/a-propos">à propos</Link>.
                </Typography>
            </Box>
        </>
    );
}

export default Accueil;
