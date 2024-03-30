import React from 'react';
import PropTypes from 'prop-types';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
import Axios from 'axios';
import { useSnackbar } from 'notistack';
import CurrentUserContext from '../..';

export default function MarketPlaceTransactionList({
    transactions,
    onTransactionCompleted,
    onTransactionCancelled,
    showSelection,
}) {
    const { currentUser } = React.useContext(CurrentUserContext);
    const { enqueueSnackbar } = useSnackbar();
    const [selectedRows, setSelectedRows] = React.useState([]);

    const columns = [
        {
            field: 'sender',
            headerName: 'Vendeur',
            flex: 1,
            valueGetter: (params) =>
                `${params.row?.sender.first_name} ${params.row?.sender.last_name}`,
        },
        {
            field: 'price',
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
                            onTransactionCancelled([res.data]);
                        });
                        return;
                    }
                    Axios.post(`/api/transaction/id/${transaction._id}/pay`)
                        .then((res) => {
                            enqueueSnackbar('Transaction effectuée avec succès', {
                                variant: 'success',
                            });
                            onTransactionCompleted(res.data);
                        })
                        .catch(() => {
                            enqueueSnackbar("T'as plus de thunes !", {
                                variant: 'error',
                            });
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

    const onCancelClick = () => {
        Axios.post('/api/transaction/cancel', { transaction_ids: selectedRows })
            .then((res) => {
                enqueueSnackbar(`${res.data.length} transactions annulées avec succès`, {
                    variant: 'success',
                });
                onTransactionCancelled(res.data);
            })
            .catch(() => {
                enqueueSnackbar('Une erreur est survenue', {
                    variant: 'error',
                });
            });
    };

    const showCancelButton = showSelection && selectedRows.length > 0;

    return (
        <Box style={{ height: '100%', width: '100%' }}>
            <Box style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={transactions}
                    columns={columns}
                    autoPageSize
                    disableRowSelectionOnClick
                    disableColumnMenu
                    checkboxSelection={showSelection}
                    getRowId={(row) => row._id}
                    initialState={{
                        sorting: {
                            sortModel: [{ field: 'price', sort: 'asc' }],
                        },
                    }}
                    rowSelectionModel={selectedRows}
                    onRowSelectionModelChange={setSelectedRows}
                />
            </Box>
            {showCancelButton && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ color: 'white' }}
                        onClick={onCancelClick}
                    >
                        Annuler {selectedRows.length} transactions
                    </Button>
                </Box>
            )}
        </Box>
    );
}

MarketPlaceTransactionList.defaultProps = {
    transactions: [],
    onTransactionCompleted: () => {},
    onTransactionCancelled: () => {},
    showSelection: false,
};

MarketPlaceTransactionList.propTypes = {
    transactions: PropTypes.arrayOf(PropTypes.shape({})),
    onTransactionCompleted: PropTypes.func,
    onTransactionCancelled: PropTypes.func,
    showSelection: PropTypes.bool,
};
