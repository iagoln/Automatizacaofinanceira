const fs = require('fs');
var request = require("request");
const apikey = ""
const criartxtbug = require("../CriarTxtbug");
const updatedeal = (dealid, contrato) => {
    try{
    var options5 = {
        'method': 'PUT',
        'url': `https://api.hubapi.com/deals/v1/deal/${dealid}?hapikey=${apikey}`,
        'headers': {
            'Content-Type': 'application/json',
            'Cookie': '__cfduid=dbf1032d5ae0d622c1d593a2eb40fa1cc1592076612'
        },
        body: JSON.stringify({ "properties": [{ "name": "carteirinha", "value": `${contrato}` }] })

    };
    request(options5, function (error, response) {
        if (error) throw new Error(error);
      
    });
}catch(err){
    criartxtbug.criararquivotxt(err)
}
}

exports.updatedeal = updatedeal



