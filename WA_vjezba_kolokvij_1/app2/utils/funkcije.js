export function razlikaDana(pocetak, kraj){
    let d1= new Date(pocetak)
    let d2= new Date(kraj)

    let rez= (d2-d1)/(1000*60*60*24)

    return rez
}