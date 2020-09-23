
var request = require("request");
const apikey = ""
const criartxtbug = require("../CriarTxtbug");
const criarticktsemassociatio = async (subject, hs_pipeline_stage, vencimento_boleto, jsonticket, linkdoboleto, vidid, dealid, valorboleto, contrato) => {
    return new Promise((resolver, reject) => {
        try {
            var options = {
                method: 'POST',
                url: 'https://api.hubapi.com/crm/v3/objects/tickets',
                qs: { hapikey: `${apikey}` },
                headers: { accept: 'application/json', 'content-type': 'application/json' },
                body: {
                    properties: {
                        subject: `${subject}`,
                        hs_pipeline_stage: `${hs_pipeline_stage}`,
                        vencimento_boleto: `${vencimento_boleto}`,
                        jsonticket: `${jsonticket}`,
                        content: `${linkdoboleto}`,
                        valor: valorboleto,
                        contrato: contrato,
                        hs_ticket_priority: "HIGH"
                    },
                },
                json: true
            };

            request(options, function (error, response, body) {
                if (error) throw new Error(error);
                console.log(body)
                resolver(body)

            });
        } catch (err) {
            resolver(err)
            criaarquivotxt.criararquivotxt(err)
        }
    });
}
const associationvid = async (vid, idtickt) => {
    try {
        var options = {
            method: 'PUT',
            url: `https://api.hubapi.com/crm/v3/objects/tickets/${idtickt}/associations/contact/${vid}/ticket_to_contact`,
            qs: { hapikey: `${apikey}` },
            headers: { accept: 'application/json' }
        };
        request(options, function (error, response, body) {
            if (error) throw new Error(error);

            console.log(body);
        });
    } catch (err) {
        criaarquivotxt.criararquivotxt(err)
    }
}
const assoctiondeal = async (dealid, idtickt) => {
    try {
        var options = {
            method: 'PUT',
            url: `https://api.hubapi.com/crm/v3/objects/tickets/${idtickt}/associations/deal/${dealid}/ticket_to_deal`,
            qs: { hapikey: `${apikey}` },
            headers: { accept: 'application/json' }
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);

            console.log(body);
        });
    } catch (err) {
        criaarquivotxt.criararquivotxt(err)
    }

}
const criarticket = async (subject, hs_pipeline_stage, vencimento_boleto, jsonticket, linkdoboleto, vidid, dealid, valorboleto, contrato) => {
    try {
        const idtickt = await criarticktsemassociatio(subject, hs_pipeline_stage, vencimento_boleto, jsonticket, linkdoboleto, vidid, dealid, valorboleto, contrato)
        await assoctiondeal(dealid, idtickt.id)
        await associationvid(vidid, idtickt.id)
    } catch (err) {
        criaarquivotxt.criararquivotxt(err)
    }

}

exports.criarticket = criarticket