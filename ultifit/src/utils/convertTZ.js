export function convertTZ(date, tzString) {
    const newDate = new Date(date)
    const day = newDate.getDate()
    let month = newDate.getMonth() + 1
    if(month > 12) {
        month = 1
    }
    const year = newDate.getYear() + 1900
    const hour = newDate.getHours()
    const minutes = newDate.getMinutes()
    return hour + ':' + minutes + '   ' + day + '/' + month + '/' + year
}