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
        if (points >= Rarity[i].min && points <= Rarity[i].max) {
            return i;
        }
    }
    return -1;
}


const getInitialRarityPrice = (points) => Math.round(points * 3.333)


export { Rarity, RarityName,CardPointsToRarityIndex, RarityQuantity, getInitialRarityPrice };