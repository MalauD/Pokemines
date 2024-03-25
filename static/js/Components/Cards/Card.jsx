import * as React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import { Box, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CardPointsToRarityIndex } from '../../CardRarity';

const card_style = [
    {
        img: {
            top: '18.2%',
            left: '10.9%',
            width: '78.5cqw',
            height: '49.8cqw',
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
        backGroundPath: '/Cards/card_common_front_trans.webp',
    },
    {
        img: {
            top: '23.2%',
            left: '13%',
            width: '68.5cqw',
            height: '39.8cqw',
        },
        name: {
            top: '12.5%',
            left: '16%',
            fontSize: '7cqw',
            fontFamily: 'Magical Night',
        },
        points: {
            top: '12.5%',
            left: '64%',
            fontSize: '7cqw',
            fontFamily: 'Magical Night',
        },
        strength: {
            top: '56%',
            left: '16%',
            fontSize: '5cqw',
            width: '63cqw',
        },
        weakness: {
            top: '75.5%',
            left: '18%',
            fontSize: '5cqw',
            width: '59cqw',
        },
        backGroundPath: '/Cards/card_rare_front_trans.webp',
    },
    {
        img: {
            top: '23%',
            left: '16%',
            width: '67.5cqw',
            height: '43.8cqw',
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
            top: '56%',
            left: '18%',
            fontSize: '5cqw',
            width: '66cqw',
        },
        weakness: {
            top: '74%',
            left: '18%',
            fontSize: '5cqw',
            width: '66cqw',
        },
        backGroundPath: '/Cards/card_epique_front_trans.webp',
    },
    {
        img: {
            top: '28.2%',
            left: '12.9%',
            width: '72.5cqw',
            height: '35.8cqw',
        },
        name: {
            top: '19.8%',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            fontSize: '7cqw',
            fontFamily: 'Magical Night',
        },
        points: {
            top: '11.2%',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            fontSize: '7cqw',
            fontFamily: 'Magical Night',
        },
        strength: {
            top: '55%',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            fontSize: '5cqw',
            width: '72cqw',
        },
        weakness: {
            top: '72.5%',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            fontSize: '5cqw',
            width: '55cqw',
        },
        backGroundPath: '/Cards/card_legendary_front_trans.webp',
    },
];

export default function Card({ name, points, strength, weakness, card_number, count, image, sx }) {
    const navigate = useNavigate();

    const rarityIndex = CardPointsToRarityIndex(points);

    const styles = card_style[rarityIndex];

    return (
        <Box
            sx={{
                position: 'relative',
                width: '90vw',
                maxWidth: '400px',
                containerType: 'inline-size',
                ...sx,
            }}
            onClick={() => navigate(`/carte/numero/${card_number}`)}
        >
            <img src={styles.backGroundPath} alt={name} style={{ width: '100%', height: 'auto' }} />
            <img
                src={image || `/api/card/number/${card_number}/image`}
                alt={name}
                style={{
                    position: 'absolute',
                    color: 'white',
                    zIndex: -1,
                    objectFit: 'cover',
                    ...styles.img,
                }}
            />
            {count ? (
                <Chip
                    label={count}
                    color="primary"
                    sx={{ position: 'absolute', top: '2%', left: '3%', color: 'white' }}
                />
            ) : null}

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
    card_number: PropTypes.number,
    count: PropTypes.number,
    image: PropTypes.string,
    sx: PropTypes.shape({}),
};

Card.defaultProps = {
    card_number: null,
    count: null,
    image: null,
    sx: {},
};
