export const TDEECal = ({gender, DOB, height, weight, activityLevel}) => {
    let tdee = 0
    let age = Number(ageCal(DOB))
    let multiplier = 0
    
    if (activityLevel == 1)
        multiplier = 1.2
    else if (activityLevel == 2)
        multiplier = 1.375
    else if (activityLevel == 3)
        multiplier = 1.55
    else if (activityLevel == 4)
        multiplier = 1.725
    else if (activityLevel == 5)
        multiplier = 1.9
        
    if (gender == "women")
        return Number(tdee = (655 + (4.35*weight) + (4.7*height) - (4.7*age))*multiplier)
    else if (gender == "men")
        return Number(tdee = (66 + (6.23*weight) + (12.7*height) - (6.8*age))*multiplier)
}

export const ageCal = (dateString) => {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}