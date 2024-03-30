import React from 'react';
import PropTypes from 'prop-types';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';

export default function MarketPlaceCardOwners({ cards }) {
    const navigate = useNavigate();

    const columns = [
        {
            field: 'owner',
            headerName: 'Propriétaire',
            flex: 1,
            valueGetter: (params) =>
                `${params.row?.owner.first_name} ${params.row?.owner.last_name}`,
        },
        {
            field: 'quantity',
            headerName: 'Quantité',
            minWidth: 110,
            valueGetter: (params) => params.row?.quantity,
        },
    ];

    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={cards.filter((card) => card.owner.mail !== 'admin')}
                columns={columns}
                autoPageSize
                disableRowSelectionOnClick
                disableColumnMenu
                getRowId={(row) => row.owner._id}
                onRowClick={(row) => {
                    navigate(`/utilisateur/${row.row.owner._id}`);
                }}
                initialState={{
                    sorting: {
                        sortModel: [{ field: 'quantity', sort: 'desc' }],
                    },
                }}
            />
        </div>
    );
}

MarketPlaceCardOwners.propTypes = {
    cards: PropTypes.arrayOf(
        PropTypes.shape({
            owner: PropTypes.shape({
                _id: PropTypes.string,
                first_name: PropTypes.string,
                last_name: PropTypes.string,
            }),
            quantity: PropTypes.number,
        })
    ),
};

MarketPlaceCardOwners.defaultProps = {
    cards: [],
};
