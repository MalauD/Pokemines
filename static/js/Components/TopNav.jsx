import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import { AccountCircle } from '@mui/icons-material';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Badge, Typography, useMediaQuery } from '@mui/material';
import SearchAccount from './Search/SearchAccount';
import useConnected from '../Hooks/useConnected';
import useAdmin from '../Hooks/useAdmin';
import CurrentUserContext from '..';

const drawerWidth = 240;

const adminNavItems = [
    'Accueil',
    'Leaderboard',
    'Marché',
    'Pokedex',
    'Explorer',
    'Admin',
    'Mon Compte',
];
const disconnectedNavItems = ['Accueil', 'Leaderboard', 'Connexion'];

const pathLookup = {
    Accueil: '/',
    Leaderboard: '/leaderboard',
    Pokedex: '/pokedex',
    Explorer: '/explorer',
    Marché: '/marche',
    Admin: '/admin',
    'Mon Compte': '/moi',
    Connexion: '/connexion',
};

export default function DrawerAppBar(props) {
    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [searchOpen, setSearchOpen] = React.useState(false);
    const isConnected = useConnected();
    const isXs = useMediaQuery((theme) => theme.breakpoints.down('sm'));
    const { currentUser } = React.useContext(CurrentUserContext);
    const isAdmin = useAdmin();
    const navigate = useNavigate();

    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    // eslint-disable-next-line no-nested-ternary
    const navItems = isConnected
        ? isAdmin
            ? adminNavItems.filter((item) => item !== 'Mon Compte')
            : adminNavItems.filter((item) => item !== 'Admin' && item !== 'Mon Compte')
        : disconnectedNavItems;

    const navItemsDrawer = [...navItems, 'Mon Compte'];

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <img src="/android-chrome-512x512.png" alt="Logo" style={{ height: 192 }} />
            <Divider />
            <List>
                {navItemsDrawer.map((item) => (
                    <ListItem key={item} disablePadding>
                        <ListItemButton
                            sx={{ textAlign: 'center' }}
                            onClick={() => navigate(pathLookup[item])}
                        >
                            <ListItemText primary={item} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    const formatAccountBalance = (balance) => {
        if (balance === null) {
            return '0';
        }
        // Use k suffix for thousands and M for millions
        if (balance >= 1000000) {
            return `${(balance / 1000000).toFixed(1)}M`;
        }
        if (balance >= 1000) {
            return `${(balance / 1000).toFixed(1)}k`;
        }
        return balance;
    };

    React.useEffect(() => {
        setSearchOpen(!isXs);
    }, [isXs]);
    const container = window !== undefined ? () => window().document.body : undefined;

    const showAccount = (isXs && !searchOpen) || !isXs;
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar component="nav" sx={{ height: '65px' }}>
                <Toolbar sx={{ color: '#fff' }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 0, display: { md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Box
                        sx={{
                            display: { xs: 'flex', md: 'flex' },
                            height: '100%',
                        }}
                        alignItems="center"
                        justifyContent="center"
                    >
                        <img
                            src="/android-chrome-192x192.png"
                            alt="Logo"
                            style={{
                                height: '100%',
                                paddingTop: 5,
                                paddingBottom: 5,
                                paddingRight: 10,
                            }}
                        />
                    </Box>

                    <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                        {navItems.map((item) => (
                            <Button
                                key={item}
                                sx={{ color: '#fff' }}
                                onClick={() => navigate(pathLookup[item])}
                            >
                                {item}
                            </Button>
                        ))}
                    </Box>
                    {isConnected && (
                        <>
                            {showAccount && (
                                <Button
                                    sx={{
                                        color: '#fff',
                                        marginLeft: 'auto',
                                        pointerEvents: 'none',
                                    }}
                                >
                                    {formatAccountBalance(currentUser.account_balance)} MNO$
                                </Button>
                            )}
                            <Box sx={{}}>
                                {!searchOpen && (
                                    <IconButton
                                        sx={{
                                            height: 55,
                                            width: 55,
                                            display: { xs: 'flex', sm: 'none' },
                                            alignItems: 'center',
                                        }}
                                        size="large"
                                        color="inherit"
                                        onClick={() => setSearchOpen(true)}
                                    >
                                        <SearchIcon />
                                    </IconButton>
                                )}
                                {searchOpen && (
                                    <SearchAccount
                                        autoFocus={isXs}
                                        onFocusLost={() => {
                                            if (isXs) setSearchOpen(false);
                                        }}
                                    />
                                )}
                            </Box>
                            {showAccount && (
                                <IconButton
                                    sx={{
                                        height: 55,
                                        width: 55,
                                        display: { md: 'flex' },
                                        alignItems: 'center',
                                    }}
                                    size="large"
                                    color="inherit"
                                    onClick={() => navigate('/moi')}
                                >
                                    <Badge
                                        badgeContent={`${currentUser.rank}${
                                            currentUser.rank === 1 ? 'er' : 'ème'
                                        }`}
                                        max={10000}
                                        color="secondary"
                                    >
                                        <AccountCircle fontSize="large" />
                                    </Badge>
                                </IconButton>
                            )}
                        </>
                    )}
                </Toolbar>
            </AppBar>
            <nav>
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { lg: 'none', md: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
            </nav>
        </Box>
    );
}

DrawerAppBar.propTypes = {
    window: PropTypes.func.isRequired,
};
