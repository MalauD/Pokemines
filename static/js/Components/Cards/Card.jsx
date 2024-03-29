import * as React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import { Box, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Textfit } from 'react-textfit';
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
            top: '8.8%',
            left: '14%',
            width: '48cqw',
            height: '10cqw',
            fontFamily: 'Magical Night',
            textAlign: 'center',
        },
        points: {
            top: '8.8%',
            left: '69%',
            width: '19cqw',
            height: '8cqw',
            fontFamily: 'Magical Night',
            textAlign: 'center',
        },
        strength: {
            top: '58%',
            left: '14%',
            fontSize: '5cqw',
            width: '72cqw',
            height: '20cqw',
        },
        weakness: {
            top: '77.5%',
            left: '14%',
            fontSize: '5cqw',
            width: '72cqw',
            height: '20cqw',
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
            width: '41cqw',
            height: '10cqw',
        },
        points: {
            top: '12.5%',
            left: '64%',
            fontSize: '7cqw',
            fontFamily: 'Magical Night',
            width: '16cqw',
            height: '10cqw',
            textAlign: 'center',
        },
        strength: {
            top: '56%',
            left: '16%',
            fontSize: '5cqw',
            width: '63cqw',
            height: '21cqw',
        },
        weakness: {
            top: '75.5%',
            left: '18%',
            fontSize: '5cqw',
            width: '59cqw',
            height: '19cqw',
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
            width: '44cqw',
            height: '10cqw',
            fontSize: '7cqw',
            fontFamily: 'airstrikeacad',
        },
        points: {
            top: '13.8%',
            left: '65%',
            width: '17cqw',
            height: '10cqw',
            fontSize: '7cqw',
            textAlign: 'center',
            fontFamily: 'airstrikeacad',
        },
        strength: {
            top: '56%',
            left: '18%',
            fontSize: '5cqw',
            width: '66cqw',
            height: '19cqw',
        },
        weakness: {
            top: '74%',
            left: '18%',
            fontSize: '5cqw',
            width: '66cqw',
            height: '19cqw',
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
            top: '20.8%',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            fontSize: '7cqw',
            fontFamily: 'Magical Night',
            width: '52cqw',
            height: '7cqw',
        },
        points: {
            top: '13.2%',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            fontSize: '7cqw',
            fontFamily: 'Magical Night',
            width: '22cqw',
            height: '7cqw',
        },
        strength: {
            top: '55%',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            fontSize: '5cqw',
            width: '60cqw',
            height: '21cqw',
        },
        weakness: {
            top: '72.5%',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            fontSize: '5cqw',
            width: '50cqw',
            height: '17cqw',
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
                cursor: 'pointer',
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

            <Textfit
                style={{
                    position: 'absolute',
                    color: 'white',
                    ...styles.name,
                }}
            >
                {name}
            </Textfit>
            <Textfit
                style={{
                    position: 'absolute',
                    color: 'white',
                    ...styles.points,
                }}
            >
                {points}
            </Textfit>
            <Textfit
                max={20}
                style={{
                    position: 'absolute',
                    color: 'white',
                    ...styles.strength,
                }}
            >
                {strength}
            </Textfit>
            <Textfit
                max={20}
                style={{
                    position: 'absolute',
                    color: 'white',
                    ...styles.weakness,
                }}
            >
                {weakness}
            </Textfit>
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
