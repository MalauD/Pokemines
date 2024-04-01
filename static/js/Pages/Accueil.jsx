import React from 'react';
import Axios from 'axios';
import { Box } from '@mui/material';
import Leaderboard from '../Components/Leaderboard/Leaderboard';
import CardLayout from '../Components/Cards/CardLayout';

function Accueil() {
    const [latestCards, setLatestCards] = React.useState([]);

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
                        title="Les dernières cartes crées"
                    />
                )}
            </Box>
        </>
    );
}

export default Accueil;
