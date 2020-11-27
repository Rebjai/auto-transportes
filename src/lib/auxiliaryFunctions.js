const parseMonth = (month) => {
    let mes = month+1
    return parse2digit(mes)
}
const parse2digit = (num) => {
    if (num<10) {
        num = '0' + num
    }
    return num
}
export default parseMonth
export {parseMonth, parse2digit}