import React from 'react';
import Leaderboard from '../Components/Leaderboard/Leaderboard';

function LeaderboardPage() {
    return <Leaderboard limit={500} pageSize={100} />;
}

export default LeaderboardPage;
