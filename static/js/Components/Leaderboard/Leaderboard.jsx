import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

const columns = [
    {
        field: 'rank',
        headerName: 'Classement',
        width: 120,
    },
    {
        field: 'first_name',
        headerName: 'Prénom',
        minWidth: 120,
    },
    {
        field: 'last_name',
        headerName: 'Nom',
        minWidth: 80,
    },
    {
        field: 'promo',
        headerName: 'Promo',
        minWidth: 40,
        flex: 1,
    },
    {
        field: 'total_points',
        headerName: 'Points',
        width: 100,
    },
];

export default function Leaderboard({ pageSize, limit }) {
    const [rows, setRows] = React.useState([]);
    const navigate = useNavigate();

    React.useEffect(() => {
        const fetchLeaderboard = () => {
            Axios.get(`/api/user/leaderboard?limit${limit}`).then((res) => {
                setRows(res.data.filter((user) => user.total_points > 0 && user.mail !== 'admin'));
            });
        };

        fetchLeaderboard();

        const interval = setInterval(() => {
            fetchLeaderboard();
        }, 30 * 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Box sx={{ pl: '8vw', pr: '8vw', pt: '4vh', pb: '4vh', minHeight: 400 }}>
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize,
                        },
                    },
                }}
                disableColumnMenu
                pageSizeOptions={[pageSize]}
                disableRowSelectionOnClick
                getRowId={(row) => row._id}
                onRowClick={(row) => navigate(`/utilisateur/${row.row._id}`)}
            />
        </Box>
    );
}

Leaderboard.defaultProps = {
    pageSize: 10,
    limit: 100,
};

Leaderboard.propTypes = {
    pageSize: PropTypes.number,
    limit: PropTypes.number,
};
