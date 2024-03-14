import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

const columns = [
    {
        field: '_id',
        headerName: 'ID',
    },
    {
        field: 'name',
        valueGetter: (params) => params.row.transaction_type.sender_card.name,
        headerName: 'Nom de carte',
        minWidth: 150,
    },
    {
        field: 'points',
        valueGetter: (params) => params.row.transaction_type.sender_card.points,
        headerName: 'Points',
        width: 150,
    },
    {
        field: 'price',
        valueGetter: (params) => params.row.transaction_type.price,
        headerName: 'Prix',
        width: 150,
    },
];

function getRowId(row) {
    return row._id;
}

export default function Marketplace() {
    const [rows, setRows] = React.useState([]);
    const navigate = useNavigate();

    React.useEffect(() => {
        Axios.get('/api/transaction/marketplace').then((res) => {
            setRows(res.data);
        });
    }, []);

    const handleRowClick = (params) => {
        navigate(`/transaction/${params.row._id}`);
    };

    return (
        <Box sx={{ height: 400, margin: 5, marginTop: 0 }}>
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 5,
                        },
                    },
                }}
                getRowId={getRowId}
                pageSizeOptions={[5]}
                onRowClick={handleRowClick}
                disableRowSelectionOnClick
            />
        </Box>
    );
}
