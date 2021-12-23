export function convertTZ(date, tzString) {
    const newDate = new Date(date)
    const day = newDate.getDay()
    const month = newDate.getMonth()
    const year = newDate.getYear() + 1900
    console.log("🚀 ~ file: convertTZ.js ~ line 4 ~ convertTZ ~ day", year)
    const hour = newDate.getHours()
    const minutes = newDate.getMinutes()
    return hour + ':' + minutes + '   ' + day + '/' + month + '/' + year
}