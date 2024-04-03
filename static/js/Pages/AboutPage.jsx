import React from 'react';
import {
    Typography,
    Box,
    Paper,
    List,
    ListItem,
    ListItemText,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    ListItemButton,
    Link,
} from '@mui/material';

export default function AboutPage() {
    const rows = [
        {
            icon: '/Cards/Icons/icon_common.webp',
            name: 'Ok Tiers (commune)',
            plage_points: 'de 46 à 50 points',
            plage_prix: 'de 138 à 182 MNO$',
            proba: '50%',
        },
        {
            icon: '/Cards/Icons/icon_rare.webp',
            name: 'Premium (rare)',
            plage_points: 'de 76 à 84 points',
            plage_prix: 'de 230 à 304 MNO$',
            proba: '30%',
        },
        {
            icon: '/Cards/Icons/icon_epic.webp',
            name: 'Banger (épique)',
            plage_points: 'de 153 à 167 points',
            plage_prix: 'de 462 à 604 MNO$',
            proba: '15%',
        },
        {
            icon: '/Cards/Icons/icon_legendary.webp',
            name: 'Aberrante (légendaire)',
            plage_points: 'de 460 à 500 points',
            plage_prix: 'de 1387 à 1813 MNO$',
            proba: '5%',
        },
    ];

    const rows2 = [
        {
            for_who: 'Top 1',
            nom: 'Nintendo Switch',
            illustration: '/Lots/lot_switch_1er.jpg',
        },
        {
            for_who: 'Top 2',
            nom: 'Un drone avec une caméra ',
            illustration: '/Lots/lot_drone_2e.jpg',
        },
        {
            for_who: 'Top 3',
            nom: 'Deux entrées au Parc d’attraction Walygator',
            illustration: '/Lots/lot_wallygator_3e.jpeg',
        },
    ];

    const lots_pool = [
        {
            illustration: '/Lots/lot_ballon_foot_pool.jpg',
            description: 'Ballon de foot (x1)',
        },
        {
            illustration: '/Lots/lot_ballon_volley_pool.jpeg',
            description: 'Ballon de volley (x1)',
        },
        {
            illustration: '/Lots/lot_chaise_camping_pool.jpg',
            description: 'Chaises de camping personnalisées (x2)',
        },
        {
            illustration: '/Lots/lot_climbup_pool.jpeg',
            description: 'Entrée gratuite Climb Up (x10)',
        },
        {
            illustration: '/Lots/lot_kasteel_pool.jpg',
            description: 'Écusson Kasteel (x1)',
        },
        {
            illustration: '/Lots/lot_cd_pool.jpeg',
            description: 'Album Minestendo (x10)',
        },
        {
            illustration: '/Lots/lot_mug_pool.jpeg',
            description: 'Mug personnalisé Lyf x MNO (x9)',
        },
        {
            illustration: '/Lots/lot_paillason_pool.jpg',
            description: 'Paillason (x3)',
        },
        {
            illustration: '/Lots/lot_poliakov_pool.jpg',
            description: 'Bouteille de Poliakov vide personnalisée (x1)',
        },
        {
            illustration: '/Lots/lot_spliiit_pool.png',
            description: 'Carde cadeau de 5€ Spliiit (x10)',
        },
        {
            illustration: '/Lots/lot_trousse_pool.jpeg',
            description: 'Trousse Lyf x MNO (x2)',
        },
        {
            illustration: '/Lots/lot_voiture_pool.png',
            description: 'Voiture télécommandée (x4)',
        },
        {
            illustration: '/Lots/lot_pates_a_tartiner_pool.jpg',
            description: 'Pâtes à tartiner des Sœurs Macarons (x4)',
        },
    ];

    return (
        <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'left',
                paddingLeft: { xs: 2, sm: '10vw' },
                paddingRight: { xs: 2, sm: '10vw' },
            }}
        >
            <Typography variant="h4" gutterBottom sx={{ alignSelf: 'center' }}>
                À propos
            </Typography>
            <Typography variant="h5" gutterBottom>
                Sommaire
            </Typography>
            <List sx={{ listStyleType: 'disc', marginLeft: 4 }}>
                <ListItem sx={{ display: 'list-item' }}>
                    <ListItemButton component="a" href="#principe-du-jeu">
                        <ListItemText primary="Principe du jeu" />
                    </ListItemButton>
                </ListItem>
                <ListItem sx={{ display: 'list-item' }}>
                    <ListItemButton component="a" href="#obtention-cartes">
                        <ListItemText primary="Obtention des cartes" />
                    </ListItemButton>
                </ListItem>
                <ListItem sx={{ display: 'list-item' }}>
                    <ListItemButton component="a" href="#types-cartes">
                        <ListItemText primary="Les types de cartes" />
                    </ListItemButton>
                </ListItem>
                <ListItem sx={{ display: 'list-item' }}>
                    <ListItemButton component="a" href="#lots">
                        <ListItemText primary="Lots à gagner" />
                    </ListItemButton>
                </ListItem>
                <ListItem sx={{ display: 'list-item' }}>
                    <ListItemButton component="a" href="#support">
                        <ListItemText primary="Support" />
                    </ListItemButton>
                </ListItem>
            </List>
            <Typography variant="h5" gutterBottom id="principe-du-jeu" sx={{ marginTop: 2 }}>
                Principe du jeu
            </Typography>
            <Typography
                variant="body1"
                sx={{ textJustify: 'inter-word', textAlign: 'justify' }}
                gutterBottom
            >
                Le but de Pokémines est de collectionner les cartes correspondantes aux différentes
                personnes et figures des mines, pour avoir la plus grande collection possible,
                obtenir des points, et surtout… vous éclater en écrasant vos potes ! :). Pour
                acquérir des cartes, vous pouvez acheter des boosters de valeurs différentes dans le
                marché ou directement acheter des cartes aux autres joueurs depuis ce même marché
                grâce à la monnaie du jeu : les MNO$. <br /> Les boosters sont des paquets de cartes
                constitués aléatoirement, qui ont une valeur dépendante de la qualité et du nombre
                de cartes à l’intérieur. Afin d’obtenir des pièces, vous devrez participer aux
                événement bangers organisés par MNO, faire des défis toujours plus aberrants, et
                acheter ou vendre vos cartes aux autres dans le magasin !<br /> À chaque carte est
                attribuée un nombre de points, déterminé aléatoirement et en fonction de sa rareté.
                Plus vous aurez de cartes, plus vous aurez de points, et plus vous gagnerez des lots
                incroyables !! Votre but sera donc de récolter un maximum de MNO$ pour acheter des
                cartes et avoir le maximum de points ! <br /> À tout moment, vous pourrez vous créer
                une carte à votre nom, en allant voir un membre de MNO au QG, au cours des activités
                ou directement quand vous nous croisez !
            </Typography>
            <Typography variant="h5" gutterBottom id="obtention-cartes" sx={{ marginTop: 2 }}>
                Obtention des cartes
            </Typography>
            <Typography
                variant="body1"
                sx={{ textJustify: 'inter-word', textAlign: 'justify' }}
                gutterBottom
            >
                L’obtention des cartes se fait de plusieurs manières.
            </Typography>
            <Typography variant="h6" gutterBottom>
                Les boosters
            </Typography>
            <Typography variant="body1" sx={{ textJustify: 'inter-word', textAlign: 'justify' }}>
                Vous pouvez acheter sur le marché des boosters contre des MNO$. Les boosters sont
                des paquets de cartes constitués aléatoirement, qui ont une valeur dépendante de la
                qualité et du nombre de cartes à l’intérieur. Vous pourrez acheter ces boosters dans
                l’onglet “marché” du menu déroulant. Il existe trois types de boosters:
            </Typography>
            <List sx={{ listStyleType: 'disc', marginLeft: 4 }}>
                <ListItem sx={{ display: 'list-item' }}>
                    <ListItemText
                        primary="Booster Bronze"
                        secondary={`Prix : 500 MNO$ - Contient 3 cartes : "OK Tiers" (commune) et "Premium" (rare)`}
                    />
                </ListItem>
                <ListItem sx={{ display: 'list-item' }}>
                    <ListItemText
                        primary="Booster Argent"
                        secondary={`Prix : 1000 MNO$ - Contient 5 cartes : "OK Tiers" (commune), "Premium" (rare) et "Banger" (épique)`}
                    />
                </ListItem>
                <ListItem sx={{ display: 'list-item' }}>
                    <ListItemText
                        primary="Booster Or"
                        secondary={`Prix : 1750 MNO$ - Contient entre 3 et 5 cartes dont une grande part de rareté "Premium" (rare) et "Banger" (épique). C’est aussi votre seule chance de trouver une carte “Aberrante” (légendaire)!`}
                    />
                </ListItem>
            </List>
            <Typography
                variant="body1"
                sx={{ textJustify: 'inter-word', textAlign: 'justify' }}
                gutterBottom
            >
                Le détail des prix et de la répartition des cartes peut être retrouvée en cliquant
                directement sur les boosters dans le marché
            </Typography>
            <Typography variant="h6" gutterBottom>
                Achat et vente de cartes
            </Typography>
            <Typography
                variant="body1"
                sx={{ textJustify: 'inter-word', textAlign: 'justify' }}
                gutterBottom
            >
                Un autre moyen d’acquérir des cartes est par l’achat et la vente de cartes dans le
                marché. <br /> Pour acheter une carte, rendez vous dans le marché, regardez les
                différentes offres proposées par les autres joueurs ainsi que par le jeu, et
                choisissez celle qui vous plaît !
            </Typography>
            <Typography variant="h5" gutterBottom id="types-cartes" sx={{ marginTop: 2 }}>
                Les types de cartes
            </Typography>
            <Typography
                variant="body1"
                sx={{ textJustify: 'inter-word', textAlign: 'justify' }}
                gutterBottom
            >
                Il existe, quatre raretés de cartes : des cartes “Ok Tiers” (Communes), des cartes
                “Premium” (Rares), des cartes “Banger” (Épiques) et des cartes “Aberrantes”
                (Légendaires). Plus la carte est rare, plus elle a de points, et par conséquent plus
                elle est chère MAIS aussi plus elle vous fera gagner de places dans le leaderboard
                et vous donnera une chance de remporter des lots incroyables ! <br />
                Voici un tableau des cartes et des plages dans lesquelles leurs points et leur prix
                peuvent se trouver ainsi que le pourcentage de chances que l’on a lors de la
                création de notre carte de tomber sur cette rareté.
            </Typography>
            <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
                <Table sx={{ minWidth: 300 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Icône</TableCell>
                            <TableCell align="center">Nom/Rareté</TableCell>
                            <TableCell align="center">Plage de points</TableCell>
                            <TableCell align="center">Plage de prix</TableCell>
                            <TableCell align="right">Probabilité à la création</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow
                                key={row.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    <img
                                        src={row.icon}
                                        alt="icon"
                                        style={{ width: 20, margin: 1 }}
                                    />
                                </TableCell>
                                <TableCell align="center">{row.name}</TableCell>
                                <TableCell align="center">{row.plage_points}</TableCell>
                                <TableCell align="center">{row.plage_prix}</TableCell>
                                <TableCell align="right">{row.proba}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Typography variant="h5" gutterBottom id="lots" sx={{ marginTop: 2 }}>
                Lots à gagner
            </Typography>
            <Typography
                variant="body1"
                sx={{ textJustify: 'inter-word', textAlign: 'justify' }}
                gutterBottom
            >
                Bien sûr, à la fin de la campagne, de nombreux lots seront distribués à ceux qui
                auront le plus de points du jeu, ci-dessous un petit tableau de tous les lots à
                gagner à l’issue de la semaine campagne, si vous excellez à Pokémines.
            </Typography>
            <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
                <Table sx={{ minWidth: 300 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Illustration</TableCell>
                            <TableCell>Nom du lot</TableCell>
                            <TableCell>Pour qui ?</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows2.map((row) => (
                            <TableRow
                                key={row.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    <img
                                        src={row.illustration}
                                        alt="icon"
                                        style={{ width: 150, marginLeft: 2 }}
                                    />
                                </TableCell>
                                <TableCell>{row.nom}</TableCell>
                                <TableCell>{row.for_who}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Typography
                variant="body1"
                sx={{ textJustify: 'inter-word', textAlign: 'justify' }}
                gutterBottom
            >
                Lots supplémentaire à gagner, deux lots différents pour les 4e au 10e et un lot pour
                les 11e au 54e
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 2,
                    marginBottom: 2,
                }}
            >
                {lots_pool.map((lot) => (
                    <Box
                        key={lot.description}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 150,
                        }}
                    >
                        <img
                            src={lot.illustration}
                            alt="icon"
                            style={{ width: '100%', height: '100%' }}
                        />
                        <Typography variant="caption" sx={{ textAlign: 'center', marginTop: 1 }}>
                            {lot.description}
                        </Typography>
                    </Box>
                ))}
            </Box>
            <Typography variant="h5" gutterBottom id="support" sx={{ marginTop: 2 }}>
                Support
            </Typography>
            <Typography
                variant="body1"
                sx={{ textJustify: 'inter-word', textAlign: 'justify', marginBottom: 20 }}
                gutterBottom
            >
                Si vous avez des problèmes d’ordre technique lors de l’utilisation du site
                Pokemines, vous pouvez nous écrire à l’adresse{' '}
                <Link href="mailto:support@pokemines.com">support@pokemines.com</Link> pour avoir de
                l’assistance.
            </Typography>
        </Box>
    );
}
