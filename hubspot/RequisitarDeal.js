var request = require("request")
const returnedDeals = [];
const API_KEY = ''
const count = 100;
const dealhapvida = [];
const criartxtbug = require("../CriarTxtbug");
async function dealhub() {

    return new Promise((resolver, reject) => {
        try{
        resulhap()
        function resulhap(offset) {
            if (typeof offset == 'undefined') {
                offsetParam = null;
            } else {
                offsetParam = `offset=${offset}`;
            }
            const hapikeyParam = `hapikey=${API_KEY}`
            const paramsString = `?count=${count}&${hapikeyParam}&${offsetParam}`;

            const finalUrl = `https://api.hubapi.com/deals/v1/deal/paged${paramsString}&includeAssociations=true&properties=seguradora&properties=dealname&properties=cpf_resp_financiero&properties=closedate&properties=dia_de_vencimento&properties=nascimento_resp_financeiro&properties=dealstage&properties=amount_in_home_currency&properties=hubspot_owner_id&properties=jsonboleto&properties=nascimento_resp_financeir&properties=carteirinha`
            console.log(finalUrl)
            request(finalUrl, (error, response, body) => {
                try{
                if (error) {
                    console.log('error', error)
                    throw new Error
                }
                const parsedBody = JSON.parse(body)
                parsedBody.deals.forEach(deal => {
                    returnedDeals.push(deal);
                });
                if (parsedBody['hasMore']) {
                    resulhap(parsedBody['offset'])
                } else {
                    resolver(returnedDeals)
                }
            }catch(eer){
                resolver(eer)
                criaarquivotxt.criararquivotxt(err)
            }
            });

        };
    }catch(err){
        resolver(eer)
        criaarquivotxt.criararquivotxt(err)
    }
    });
}
exports.dealhub = dealhub


