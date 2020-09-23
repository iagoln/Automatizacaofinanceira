
var request = require("request");
const { promises } = require("fs");
const apikey = ""//api key
const criartxtbug = require("../CriarTxtbug");
const buscarticktdealid = async (dealid) => {
  return new Promise((resolver, reject) => {

    var options = {
      'method': 'GET',
      'url': `https://api.hubapi.com/crm-associations/v1/associations/${dealid}/HUBSPOT_DEFINED/27?hapikey=${apikey}`,

    };
    request(options, function (error, response) {
      if (error) throw new Error(error);
      try {
        const idsticket = JSON.parse(response.body)

        resolver(idsticket)
      } catch (err) {
        resolver(error)
        criartxtbug.criararquivotxt(err)
      }

    });

  });
}

const buscarticketid = async (idtickt) => {
  return new Promise((resolver, reject) => {
    try {
      var request = require("request");

      var options = {
        method: 'GET',
        url: `https://api.hubapi.com/crm/v3/objects/tickets/${idtickt}`,
        qs: {
          properties: `data_pagamento,subject,hs_pipeline_stage,vencimento_boleto,jsonticket,content`,
          archived: 'false',
          hapikey: `${apikey}`
        },
        headers: { accept: 'application/json' }
      };

      request(options, function (error, response, body) {
        if (error) throw new Error(error);

        resolver(JSON.parse(body))
      });
    } catch (err) {
      criartxtbug.criararquivotxt(err)
    }
  });
}

const buscarticket = async (dealid) => {
  try {
    const dadostickets = [];
    const idticktes = await buscarticktdealid(dealid)

    if (idticktes == 0) {
      return

    } else {
      try {

        for (let i = 0; i < idticktes.results.length; i++) {

          const idtick = idticktes.results[i]
          const dadosapi = await buscarticketid(idtick)
          dadostickets.push(dadosapi)
        }
        return await dadostickets
        console.log(dadostickets.length)
      } catch (er) {
        console.log("erro na buscar do tickte")
        console.log(er)
      }
    }
  } catch (err) {
    criartxtbug.criararquivotxt(err)
  }
}

exports.buscarticket = buscarticket
















//  apibuscar(2410469782)


// async function apibuscar(Deal){



// var options = {
//   'method': 'GET',
//   'url': `https://api.hubapi.com/crm-associations/v1/associations/${Deal}/HUBSPOT_DEFINED/27?hapikey=b7133eb9-b99c-428b-9c21-55c03c526571`,
//   'headers': {
//     'Cookie': '__cfduid=dd9f5b377e6befd303289ea51ef8d22fd1595291330'
//   }
// };
// request(options, function (error, response) {
//   if (error) throw new Error(error);
//   console.log(response.body);
// });


// }