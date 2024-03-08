import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
    { field: 'id', headerName: 'ID', minWidth: 90 },
    { field: 'rk', headerName: 'Rang', minWidth: 90 },
    {
        field: 'firstName',
        headerName: 'Prénom',
        minWidth: 150,
    },
    {
        field: 'lastName',
        headerName: 'Nom',
        minWidth: 150,
    },
    {
        field: 'promo',
        headerName: 'Promo',
        minWidth: 150,
        flex: 1,
    },
    {
        field: 'points',
        headerName: 'Points',
        width: 150,
    },
];

const rows = [
    { id: '1', rk: 1, lastName: 'Snow', firstName: 'Jon', promo: 'NA', points: 12500 },
    { id: '2', rk: 2, lastName: 'Lannister', firstName: 'Cersei', promo: '2A', points: 12000 },
    { id: '3', rk: 3, lastName: 'Lannister', firstName: 'Jaime', promo: '3A', points: 11030 },
    { id: '4', rk: 4, lastName: 'Stark', firstName: 'Arya', promo: 'NA', points: 9100 },
    { id: '5', rk: 5, lastName: 'Targaryen', firstName: 'Daenerys', promo: '4A', points: 8300 },
    { id: '6', rk: 6, lastName: 'Melisandre', firstName: 'Danais', promo: 'NA', points: 5960 },
    { id: '7', rk: 7, lastName: 'Clifford', firstName: 'Ferrara', promo: '2A', points: 5440 },
    { id: '8', rk: 8, lastName: 'Frances', firstName: 'Rossini', promo: 'NA', points: 5240 },
    { id: '9', rk: 9, lastName: 'Roxie', firstName: 'Harvey', promo: '3A', points: 1440 },
];

export default function Leaderboard() {
    return (
        <Box sx={{ height: 400, margin: 5, marginTop: 10 }}>
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
                columnVisibilityModel={{
                    id: false,
                }}
                pageSizeOptions={[5]}
                disableRowSelectionOnClick
            />
        </Box>
    );
}
