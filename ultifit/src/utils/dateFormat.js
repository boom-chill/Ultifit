export const dateFormat = (date) => {
    const dateSplit = date.split('-')
    const daySplit = dateSplit[2].split('T')
    return daySplit[0] + '/' + dateSplit[1] + '/' + dateSplit[0]
}

export const monthFormat = (date) => {
    const dateSplit = date.split('-')
    const daySplit = dateSplit[2].split('T')
    return dateSplit[1] + '-' + dateSplit[0]
}