import * as React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const card_style = [
    {
        img: {
            top: '18.2%',
            left: '11.1%',
            width: '78.5cqw',
        },
        name: {
            top: '8.2%',
            left: '14%',
            fontSize: '7cqw',
            fontFamily: 'Magical Night',
        },
        points: {
            top: '8.2%',
            left: '69%',
            fontSize: '7cqw',
            fontFamily: 'Magical Night',
        },
        strength: {
            top: '58%',
            left: '14%',
            fontSize: '5cqw',
            width: '72cqw',
        },
        weakness: {
            top: '77.5%',
            left: '14%',
            fontSize: '5cqw',
            width: '72cqw',
        },
        backGroundPath: '/Cards/card_common_front_trans.png',
    },
    {
        img: {
            top: '23%',
            left: '16%',
            width: '67.5cqw',
        },
        name: {
            top: '13.8%',
            left: '17%',
            fontSize: '7cqw',
            fontFamily: 'airstrikeacad',
        },
        points: {
            top: '13.8%',
            left: '65%',
            fontSize: '7cqw',
            fontFamily: 'airstrikeacad',
        },
        strength: {
            top: '57%',
            left: '18%',
            fontSize: '5cqw',
            width: '66cqw',
        },
        weakness: {
            top: '74.5%',
            left: '18%',
            fontSize: '5cqw',
            width: '66cqw',
        },
        backGroundPath: '/Cards/card_epique_front_trans.png',
    },
];

export default function Card({ name, points, strength, weakness, card_number }) {
    const navigate = useNavigate();

    const styles = card_style[0];

    return (
        <Box
            sx={{ position: 'relative', width: '400px', containerType: 'inline-size' }}
            onClick={() => navigate(`/carte/numero/${card_number}`)}
        >
            <img src={styles.backGroundPath} alt={name} style={{ width: '100%', height: 'auto' }} />
            <img
                src={`/api/card/number/${card_number}/image`}
                alt={name}
                style={{
                    position: 'absolute',
                    color: 'white',
                    zIndex: -1,
                    ...styles.img,
                }}
            />
            <Typography
                variant="h6"
                component="div"
                sx={{
                    position: 'absolute',
                    color: 'white',
                    ...styles.name,
                }}
            >
                {name}
            </Typography>
            <Typography
                variant="h6"
                component="div"
                sx={{
                    position: 'absolute',
                    color: 'white',
                    ...styles.points,
                }}
            >
                {points}
            </Typography>
            <Typography
                variant="h6"
                component="div"
                sx={{
                    position: 'absolute',
                    color: 'white',
                    ...styles.strength,
                }}
            >
                {strength}
            </Typography>
            <Typography
                variant="h6"
                component="div"
                sx={{
                    position: 'absolute',
                    color: 'white',
                    ...styles.weakness,
                }}
            >
                {weakness}
            </Typography>
        </Box>
    );
}

Card.propTypes = {
    name: PropTypes.string.isRequired,
    points: PropTypes.number.isRequired,
    strength: PropTypes.string.isRequired,
    weakness: PropTypes.string.isRequired,
    card_number: PropTypes.number.isRequired,
};
