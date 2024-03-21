import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Card from './Card';

const CardContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
`;

export default function CardLayout({ cards }) {
    return (
        <CardContainer>
            {cards.map((card) => (
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
};

CardLayout.defaultProps = {
    cards: [],
};
