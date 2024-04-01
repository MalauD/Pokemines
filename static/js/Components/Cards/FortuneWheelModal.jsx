import { Box, Button, Modal, Typography } from '@mui/material';
import React from 'react';
import propTypes from 'prop-types';
import styled from '@emotion/styled';
import { KeyboardArrowUp } from '@mui/icons-material';
import { RarityName } from '../../CardRarity';

const containerStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

const ImgFortuneWheel = styled('img')({
    width: '100%',
    height: '100%',
    animationTimingFunction: 'cubic-bezier(0.44, -0.205, 0, 1.13)',
});

const imageRotationMapping = [
    { min: 0, max: 180 },
    { min: 181, max: 289 }, // 30%
    { min: 290, max: 344 }, // 15%
    { min: 345, max: 360 }, // 5%
];

const rotationToIndex = (rotation) => {
    const mod_rotation = (rotation + 180) % 360;

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < imageRotationMapping.length; i++) {
        const { min, max } = imageRotationMapping[i];
        if (mod_rotation >= min && mod_rotation <= max) {
            return i;
        }
    }
    return 0;
};

export default function FortuneWheelModal({ modalOpen, onModalClose, onSpinEnded }) {
    const imgRef = React.useRef(null);
    const [spinEnded, setSpinEnded] = React.useState(false);

    const rotationAmount = React.useMemo(() => Math.floor(Math.random() * 360 + 360 * 10), []);

    const selectedCard = React.useMemo(() => rotationToIndex(rotationAmount), [rotationAmount]);

    const spinWheel = () => {
        imgRef.current.classList.add('spin');
        setTimeout(() => {
            setSpinEnded(true);
        }, 5000);
    };

    return (
        <Modal
            open={modalOpen}
            onClose={() => (spinEnded ? onSpinEnded(selectedCard) : onModalClose())}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={containerStyle}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Typography id="modal-modal-title" variant="h5" component="h2" gutterBottom>
                        Roue de la fortune
                    </Typography>
                    <ImgFortuneWheel
                        src="/Cards/fortune_wheel.webp"
                        alt="Roue de la fortune"
                        ref={imgRef}
                    />
                    <KeyboardArrowUp />

                    <Button
                        variant="contained"
                        sx={{ mt: 2, color: 'white' }}
                        onClick={() => (spinEnded ? onSpinEnded(selectedCard) : spinWheel())}
                    >
                        {spinEnded
                            ? `Récupérer la carte ${RarityName[selectedCard]}`
                            : 'Tourner la roue'}
                    </Button>
                </Box>
                <style>
                    {`
                    .spin {
                        animation: spinning 5s cubic-bezier(0.44, -0.205, 0, 1.13) forwards;
                    }
                    @keyframes spinning {
                            from { transform: rotate(0); }
                            to {  transform: rotate(${rotationAmount}deg); }
                    }
                    `}
                </style>
            </Box>
        </Modal>
    );
}

FortuneWheelModal.propTypes = {
    modalOpen: propTypes.bool.isRequired,
    onModalClose: propTypes.func.isRequired,
    onSpinEnded: propTypes.func.isRequired,
};
