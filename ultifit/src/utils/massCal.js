export const massCal = (ingredients) => {
    let newFat = 0
    let newCalo = 0
    let newPro = 0
    let newCarb = 0
    ingredients.forEach((ingredient, idx) => {
        newFat += ingredient.fat
        newCalo += ingredient.calories
        newPro += ingredient.protein
        newCarb += ingredient.carb
    })
    return {
        calories: newCalo,
        carb: newCarb,
        fat: newFat,
        protein: newPro,
    }
}