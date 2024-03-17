import * as React from 'react';
import PropTypes from 'prop-types';
import MuiCard from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Card({ name, points, strength, weakness, card_number }) {
    const navigate = useNavigate();

    return (
        <MuiCard sx={{ maxWidth: 345 }} onClick={() => navigate(`/carte/numero/${card_number}`)}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="140"
                    image={`/api/card/number/${card_number}/image`}
                    alt="green iguana"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Points: {points}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Strength: {strength}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Weakness: {weakness}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </MuiCard>
    );
}

Card.propTypes = {
    name: PropTypes.string.isRequired,
    points: PropTypes.number.isRequired,
    strength: PropTypes.string.isRequired,
    weakness: PropTypes.string.isRequired,
    card_number: PropTypes.number.isRequired,
};
