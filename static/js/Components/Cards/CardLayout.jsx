import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import Card from './Card';

const CardContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
`;

export default function CardLayout({ cards, title, accessory }) {
    const [sort, setSort] = React.useState('default');

    const sortCards = (cards_input) => {
        switch (sort) {
            case 'points':
                return cards_input.sort((a, b) => b.points - a.points);
            case 'name':
                return cards_input.sort((a, b) => a.name.localeCompare(b.name));
            case 'default':
                return cards_input;
            default:
                return cards_input;
        }
    };

    const sorted_cards = React.useMemo(() => sortCards(cards), [sort, cards]);

    return (
        <>
            <Grid container spacing={2} justifyContent="space-between">
                <Grid item md={2} xs={accessory ? 12 : 2}>
                    <Typography variant="h4" gutterBottom>
                        {title}
                    </Typography>
                </Grid>
                {accessory ? (
                    <Grid item md={6} xs={8}>
                        {accessory}
                    </Grid>
                ) : null}
                <Grid item md={2} xs={4}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel id="sort-label">Trier par :</InputLabel>
                        <Select
                            labelId="sort-label"
                            id="sort"
                            value={sort}
                            label="Trier par :"
                            onChange={(e) => setSort(e.target.value)}
                        >
                            <MenuItem value="default">Default</MenuItem>
                            <MenuItem value="points">Points</MenuItem>
                            <MenuItem value="name">Nom</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            <CardContainer>
                {sorted_cards.map((card) => (
                    <Card
                        key={card._id}
                        name={card.name}
                        points={card.points}
                        strength={card.strength}
                        weakness={card.weakness}
                        card_number={card.card_number}
                    />
                ))}
            </CardContainer>
        </>
    );
}

CardLayout.propTypes = {
    cards: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.shape({
                $oid: PropTypes.string,
            }),
            name: PropTypes.string,
            points: PropTypes.number,
            strength: PropTypes.string,
            weakness: PropTypes.string,
            card_number: PropTypes.number,
        })
    ),
    title: PropTypes.string.isRequired,
    accessory: PropTypes.node,
};

CardLayout.defaultProps = {
    cards: [],
    accessory: null,
};
