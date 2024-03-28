import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button } from '@mui/material';
import { useSnackbar } from 'notistack';
import Card from './Card';

export default function CardReveal({ cards, onRevealEnd }) {
    const [currentCardIndex, setCurrentCardIndex] = React.useState(0);
    const { enqueueSnackbar } = useSnackbar();

    const handleNext = () => {
        if (currentCardIndex === cards.length - 1) {
            enqueueSnackbar('Les cartes ont été transférées dans votre collection', {
                variant: 'success',
            });
            onRevealEnd();
            return;
        }
        setCurrentCardIndex((prev) => prev + 1);
    };

    const handlePrevious = () => {
        setCurrentCardIndex((prev) => prev - 1);
    };

    const currentCard = cards[currentCardIndex];

    return (
        <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
            <Card
                name={currentCard.name}
                image={currentCard.image}
                card_number={currentCard.card_number}
                points={currentCard.points}
                strength={currentCard.strength}
                weakness={currentCard.weakness}
            />
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                width="100%"
                marginTop={3}
            >
                <Button
                    onClick={handlePrevious}
                    disabled={currentCardIndex === 0}
                    color="primary"
                    variant="contained"
                    sx={{ color: 'white' }}
                >
                    Précédente
                </Button>
                <Button
                    onClick={handleNext}
                    color="primary"
                    variant="contained"
                    sx={{ color: 'white' }}
                >
                    {currentCardIndex === cards.length - 1 ? 'Terminer' : 'Suivante'}
                </Button>
            </Box>
        </Box>
    );
}

CardReveal.propTypes = {
    cards: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            image: PropTypes.string.isRequired,
            card_number: PropTypes.number.isRequired,
            points: PropTypes.number.isRequired,
            strength: PropTypes.number.isRequired,
            weakness: PropTypes.number.isRequired,
        })
    ).isRequired,
    onRevealEnd: PropTypes.func.isRequired,
};
