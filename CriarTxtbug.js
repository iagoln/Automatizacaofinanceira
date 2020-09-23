
var fs = require('fs');

const criararquivotxt = (texto)=>{
    const dataerro = new Date().getDate() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getFullYear() +
        "-" + new Date().getHours() + "e" + new Date().getMinutes()+"miliseconds" + new Date().getMilliseconds() 
    fs.writeFile(`./bugs/${dataerro}.txt`, `${texto}`, function (erro) {

        if (erro) {
            throw erro;
        }
    });
}
exports.criararquivotxt =criararquivotxt