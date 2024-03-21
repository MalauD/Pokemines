import * as React from 'react';
import PropTypes from 'prop-types';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { Autocomplete, Grid } from '@mui/material';
import Axios from 'axios';
import { AccountCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'inherit',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        [theme.breakpoints.up('sm')]: {
            width: '18ch',
            '&:focus': {
                width: '26ch',
            },
        },
    },
}));

export default function SearchAccount({ onAccountSelected }) {
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);

    const onInputChange = (event, newValue) => {
        if (newValue) {
            setLoading(true);
            Axios.get(`/api/user/search?q=${newValue}&maxResults=20&page=0`).then((response) => {
                setOptions(response.data);
                setLoading(false);
            });
        }
    };

    return (
        <Autocomplete
            id="asynchronous-demo"
            sx={{
                maxWidth: 300,
                color: 'inherit',
                borderColor: 'inherit',
            }}
            open={open}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            isOptionEqualToValue={(option, value) =>
                option.first_name === value.first_name && option.last_name === value.last_name
            }
            getOptionLabel={(option) => `${option.first_name} ${option.last_name}`}
            options={options}
            loading={loading}
            onInputChange={onInputChange}
            onChange={(event, newValue) => {
                if (onAccountSelected) onAccountSelected(newValue);
                else navigate(`/utilisateur/${newValue.id}`);
            }}
            renderInput={(params) => (
                <Search ref={params.InputProps.ref}>
                    <SearchIconWrapper>
                        <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                        placeholder="Cherche un mineur"
                        inputProps={{ ...params.inputProps, 'aria-label': 'search' }}
                    />
                </Search>
            )}
            renderOption={(props, option) => (
                <li {...props}>
                    <Grid container alignItems="center">
                        <Grid item sx={{ display: 'flex', width: 30 }}>
                            <AccountCircle />
                        </Grid>
                        <Grid item sx={{ width: 'calc(100% - 30px)', wordWrap: 'break-word' }}>
                            {option.first_name} {option.last_name}
                        </Grid>
                    </Grid>
                </li>
            )}
        />
    );
}

SearchAccount.propTypes = {
    onAccountSelected: PropTypes.func,
};

SearchAccount.defaultProps = {
    onAccountSelected: null,
};
