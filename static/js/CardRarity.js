import Rarity from './CardRarityPoints.json'

const RarityName = [
    "Ok Tiers",
    "Premium",
    "Banger",
    "Aberrante"
];

const RarityQuantity = [
    300,
    300,
    300,
    300
];

const CardPointsToRarityIndex = (points) => {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < Rarity.length; i++) {
        if (points >= Rarity[i].min && points < Rarity[i].max) {
            return i;
        }
    }
    return -1;
}

const getInitialRarityPrice = (points) => {
    const rarityIndex = CardPointsToRarityIndex(points);
    const {min, max} = Rarity[rarityIndex];
    return Math.round((max + min) / (2*(max-min)) * (points - min));
}


export { Rarity, RarityName,CardPointsToRarityIndex, RarityQuantity, getInitialRarityPrice };