var request = require("request");
const apikey = ""
const criartxtbug = require("../CriarTxtbug");

const updateticket = async (ticketid) => {
  try {
    var options = {
      method: 'PATCH',
      url: `https://api.hubapi.com/crm/v3/objects/tickets/${ticketid}`,
      qs: { hapikey: apikey },
      headers: { accept: 'application/json', 'content-type': 'application/json' },
      body: {
        properties: {

          hs_pipeline_stage: '4'
        }
      },
      json: true
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);

      console.log(body);
    });
  } catch (err) {
    criaarquivotxt.criararquivotxt(err)
  }
}


exports.updateticket = updateticket