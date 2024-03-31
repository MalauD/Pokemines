import * as React from 'react';
import PropTypes from 'prop-types';
import { Box, Chip, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Textfit } from 'react-textfit';
import { ThreeSixty } from '@mui/icons-material';
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
            fontFamily: 'Bauhaus',
            textAlign: 'center',
            color: '#0053c3',
        },
        points: {
            top: '8.8%',
            left: '69%',
            width: '19cqw',
            height: '8cqw',
            fontFamily: 'Bauhaus',
            textAlign: 'center',
            color: '#0053c3',
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
        backCardPath: '/Cards/card_common_back_trans.webp',
    },
    {
        img: {
            top: '23.2%',
            left: '14%',
            width: '72.5cqw',
            height: '41.8cqw',
        },
        name: {
            top: '13.5%',
            left: '16%',
            fontSize: '7cqw',
            fontFamily: 'The Last Shuriken',
            width: '41cqw',
            height: '10cqw',
            color: '#000',
        },
        points: {
            top: '13.5%',
            left: '64%',
            fontSize: '7cqw',
            fontFamily: 'The Last Shuriken',
            width: '16cqw',
            height: '10cqw',
            textAlign: 'center',
            color: '#000',
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
            left: '20%',
            fontSize: '5cqw',
            width: '60cqw',
            height: '19cqw',
        },
        backGroundPath: '/Cards/card_rare_front_trans.webp',
        backCardPath: '/Cards/card_rare_back_trans.webp',
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
            color: '#fff',
        },
        points: {
            top: '13.8%',
            left: '65%',
            width: '17cqw',
            height: '10cqw',
            fontSize: '7cqw',
            textAlign: 'center',
            fontFamily: 'airstrikeacad',
            color: '#fff',
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
        backCardPath: '/Cards/card_epique_back_trans.webp',
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
            fontFamily: 'Viking',
            width: '52cqw',
            height: '7cqw',
            color: '#ccb906',
        },
        points: {
            top: '13.2%',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            fontSize: '7cqw',
            fontFamily: 'Viking',
            width: '22cqw',
            height: '7cqw',
            color: '#ccb906',
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
        backCardPath: '/Cards/card_legendary_back_trans.webp',
    },
];

export default function Card({
    name,
    points,
    strength,
    weakness,
    card_number,
    count,
    image,
    sx,
    reversedByDefault,
}) {
    const navigate = useNavigate();
    const [reverse, setReverse] = React.useState(reversedByDefault);

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
        >
            <IconButton
                onClick={() => setReverse(!reverse)}
                sx={{ position: 'absolute', bottom: '5%', right: '5%' }}
            >
                <ThreeSixty sx={{ color: 'white' }} fontSize="large" color="primary" />
            </IconButton>
            {reverse ? (
                <img
                    src={styles.backCardPath}
                    alt={name}
                    onClick={() => navigate(`/carte/numero/${card_number}`)}
                    style={{ width: '100%', height: 'auto' }}
                />
            ) : (
                <>
                    <img
                        src={styles.backGroundPath}
                        alt={name}
                        onClick={() => navigate(`/carte/numero/${card_number}`)}
                        style={{ width: '100%', height: 'auto' }}
                    />
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
                        {name
                            .toUpperCase()
                            .normalize('NFD')
                            .replace(/[\u0300-\u036f]/g, '')}
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
                </>
            )}
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
    reversedByDefault: PropTypes.bool,
};

Card.defaultProps = {
    card_number: null,
    count: null,
    image: null,
    sx: {},
    reversedByDefault: false,
};
