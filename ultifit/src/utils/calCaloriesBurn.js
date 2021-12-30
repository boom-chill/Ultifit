export const calCaloriesBurn = (MET, weight) => {
    const newMET = Number(MET)
    const newWeight = Number(weight)
    return parseFloat((newMET * 5 * newWeight) / 200).toFixed(1)
}