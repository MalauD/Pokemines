import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import Axios from 'axios';

export default function MarketPlaceTransactionList({ transactions, onTransactionCompleted }) {
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
                const onClick = () => {
                    Axios.post(`/api/transaction/id/${transaction._id}/pay`).then((res) => {
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
                        Acheter
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
