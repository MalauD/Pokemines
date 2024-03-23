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

const CardPointsToRarityIndex = (points) => {
    for (let i = 0; i < Rarity.length; i++) {
        if (points >= Rarity[i].min && points < Rarity[i].max) {
            return i;
        }
    }
    return -1;
}

export { Rarity, RarityName,CardPointsToRarityIndex };