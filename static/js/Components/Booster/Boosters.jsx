import React from 'react';
import { Box, Typography } from '@mui/material';
import styled from '@emotion/styled';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BoosterContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    justify-content: center;
`;

export default function Boosters() {
    const [boosters, setBoosters] = React.useState([]);
    const navigate = useNavigate();

    React.useEffect(() => {
        Axios.get('/api/card/booster/all').then((response) => {
            setBoosters(response.data);
        });
    }, []);

    return (
        <>
            <Typography variant="h4" gutterBottom>
                Boosters
            </Typography>
            <BoosterContainer>
                {boosters.map((booster, index) => (
                    <Box
                        sx={{
                            position: 'relative',
                            width: '90vw',
                            maxWidth: '275px',
                            containerType: 'inline-size',
                            cursor: 'pointer',
                        }}
                        onClick={() => navigate(`/booster/${index}`)}
                    >
                        <img
                            alt="background"
                            src={booster.image_path}
                            style={{ width: '100%', height: 'auto', borderRadius: '3%' }}
                        />
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{
                                position: 'absolute',
                                color: 'white',
                                top: '78%',
                                left: '50%',
                                transform: 'translate(-50%)',
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                padding: '0.4rem',
                                borderRadius: '13px',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {booster.price} MNO$
                        </Typography>
                    </Box>
                ))}
            </BoosterContainer>
        </>
    );
}
