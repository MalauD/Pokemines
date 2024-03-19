import { Box, Chip, CircularProgress, Grid, Paper, Typography } from '@mui/material';
import React from 'react';
import Axios from 'axios';
import { useParams } from 'react-router-dom';

function Transaction() {
    const { transactionId } = useParams();
    const [transaction, setTransaction] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);

    const retrieveTransaction = () => {
        setIsLoading(true);
        Axios.get(`/api/transaction/${transactionId}`).then((res) => {
            setTransaction(res.data);
            setIsLoading(false);
        });
    };

    React.useEffect(() => {
        retrieveTransaction();
    }, [transactionId]);

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    const { transaction_type, _id, status } = transaction;

    return (
        <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Paper sx={{ pl: '8vw', pr: '8vw', pt: '4vh', pb: '4vh' }}>
                <Typography component="h1" variant="h5" sx={{ mb: 2 }} align="center">
                    Transaction {_id}
                </Typography>
                <Grid container spacing={1}>
                    <Grid item xs={3}>
                        <Chip label={status} />
                    </Grid>
                    <Grid item xs={6}>
                        <Chip label={transaction_type.type} />
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
}

export default Transaction;
