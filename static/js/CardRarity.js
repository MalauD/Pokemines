import Rarity from './CardRarityPoints.json'

const RarityName = [
    "Ok Tiers",
    "Premium",
    "Banger",
    "Aberrante"
];

const RarityQuantity = [
    20,
    10,
    5,
    2
];

const RarityPrice = [
    100,
    250,
    500,
    2000
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

export { Rarity, RarityName,CardPointsToRarityIndex, RarityQuantity, RarityPrice };