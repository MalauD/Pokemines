import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import Axios from 'axios';
import { useSnackbar } from 'notistack';
import CurrentUserContext from '../..';

export default function MarketPlaceTransactionList({
    transactions,
    onTransactionCompleted,
    onTransactionCancelled,
}) {
    const { currentUser } = React.useContext(CurrentUserContext);
    const { enqueueSnackbar } = useSnackbar();

    const columns = [
        {
            field: 'sender',
            headerName: 'Vendeur',
            minWidth: 120,
            valueGetter: (params) =>
                `${params.row?.sender.first_name} ${params.row?.sender.last_name}`,
        },
        {
            field: 'Price',
            headerName: 'Prix',
            minWidth: 90,
            valueGetter: (params) => params.row?.transaction_type.price,
        },
        {
            field: 'action',
            headerName: 'Action',
            minWidth: 120,
            renderCell: (params) => {
                const transaction = params.row;
                const isMyCard = transaction.sender._id === currentUser._id;
                const onClick = () => {
                    if (isMyCard) {
                        Axios.post(`/api/transaction/id/${transaction._id}/cancel`).then((res) => {
                            enqueueSnackbar('Transaction annulée avec succès', {
                                variant: 'success',
                            });
                            onTransactionCancelled(res.data);
                        });
                        return;
                    }
                    Axios.post(`/api/transaction/id/${transaction._id}/pay`).then((res) => {
                        enqueueSnackbar('Transaction effectuée avec succès', {
                            variant: 'success',
                        });
                        onTransactionCompleted(res.data);
                    });
                };

                return (
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ color: 'white' }}
                        size="small"
                        onClick={onClick}
                    >
                        {isMyCard ? 'Annuler' : 'Acheter'}
                    </Button>
                );
            },
        },
    ];

    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={transactions}
                columns={columns}
                autoPageSize
                disableRowSelectionOnClick
                disableColumnMenu
                getRowId={(row) => row._id}
                initialState={{
                    sortModel: {
                        field: 'Price',
                        sort: 'asc',
                    },
                }}
            />
        </div>
    );
}
