export function kFormatter(numb) {
    let num = parseFloat(numb).toFixed(0)
    return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
}

export function formatNumber(num, fix) {
    if(num == 0) return 0
    return parseFloat(num).toFixed(fix)
}