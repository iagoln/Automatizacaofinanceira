const deal = require("./hubspot/RequisitarDeal");
const portalhapvida = require("./hapvida/PortalBoleto");
const criaarquivotxt = require("./CriarTxtbug");
const { compileFunction } = require("vm");


const dealbrutoip = async () => {
  const returnedDeals = await deal.dealhub()
  let datahoje = new Date().getTime();
  const resulhap = returnedDeals.filter(function (hap) {
    try {
      return hap.properties.seguradora.value == 'HAPVIDA' && hap.properties.dealstage.value == 'closedwon' && (hap.properties.closedate.value + 18396000000) >= datahoje;
    } catch (err) {
     
    }
  })
  for (let i = 0; i < resulhap.length; i++) {
    try {
      const dealid = resulhap[i].dealId
      const vidid = resulhap[i].associations.associatedVids[0]
      const closedate = resulhap[i].properties.closedate.value
      const cpfs = resulhap[i].properties.cpf_resp_financiero.value
      const nascimento_resp_financeiro = (resulhap[i].properties.nascimento_resp_financeiro.value * 1)
      const valordeal = resulhap[i].properties.amount_in_home_currency.value
      //transformando timetamps em data do formato do site
      var todate = new Date(nascimento_resp_financeiro).getDate() + 1;
      if (todate <= 9) {
        var todate = '0' + todate;
      }
      var tomonth = new Date(nascimento_resp_financeiro).getMonth() + 1.;
      if (tomonth <= 9) {
        var tomonth = '0' + tomonth;
      }
      var toyear = new Date(nascimento_resp_financeiro).getFullYear();
      const nascimentotransfo = todate + '/' + tomonth + '/' + toyear;
      //-------fim da transformação 
      var cpf = cpfs;
      cpf = cpf.trim();
      if (cpf.length < 11) {
        cpf = '0' + cpf;
      }
      if (cpf.length < 10) {
        cpf = '00' + cpf;
      }
      await portalhapvida.boletohapvida(cpf, nascimentotransfo, dealid, valordeal, vidid)

    } catch (err) {
          continue
      
    }
  }

}

dealbrutoip()

const CronJob = require('cron').CronJob
const job = new CronJob('0 0 1 * * 3,5', () => {
  dealbrutoip()
}, null, true, 'America/Sao_Paulo')
