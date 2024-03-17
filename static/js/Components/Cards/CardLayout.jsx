import React from 'react';
import Card from './Card';

export default function CardLayout({ cards }) {
    return (
        <div>
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
        </div>
    );
}
