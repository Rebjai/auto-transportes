const parseMonth = (month) => {
    let mes = month+1
    console.log(mes);
    if (mes<10) {
        mes = '0' + mes
    }
    return mes
}
export default parseMonth
export {parseMonth}