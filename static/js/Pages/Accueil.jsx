import React from 'react';
import Leaderboard from '../Components/Leaderboard/Leaderboard';

function Accueil() {
    return <Leaderboard limit={100} pageSize={10} />;
}

export default Accueil;
