const Rarity = [
    { min: 10, max: 40 },
    { min: 40, max: 80 },
    { min: 80, max: 130 },
    { min: 130, max: 1000 },
];

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