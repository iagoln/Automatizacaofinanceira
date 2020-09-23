

var request = require("request");
const moment = require('moment');
const puppeteer = require('puppeteer');
const buscarticket = require("../hubspot/BuscarTicketDeal");
const criararquivo = require("../hubspot/CriarArquivo");
const criarticket = require("../hubspot/CriarTicket");
const updatedeal = require("../hubspot/UpdateDeal");
const updateticket = require("../hubspot/UpdateTicket");
const criartxtbug = require("../CriarTxtbug");

async function boletohapvida(cpfs, datanscimento, dealid2, valordeal2, vidid2) {

  console.log(cpfs, datanscimento, dealid2, valordeal2, vidid2)

  const nasc = datanscimento
  const dealid = dealid2
  const valordeal = valordeal2
  const vidid = vidid2
  let dados = []
  const cpf = cpfs
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  try {

    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto('https://www.hapvida.com.br/pls/webhap/webnewboleto.login#tabs-3')
    await page.waitFor('body > div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div');
    await page.click('body > div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div');

    await page.waitFor('input[name="pCpf"]');


    await page.type('input[name="pCpf"]', ` `, { delay: 100 });
    await page.type('input[name="pCpf"]', `${cpf}`, { delay: 100 });
    await page.type('#pNascimento2', ` `, { delay: 100 });
    await page.type('#pNascimento2', `${nasc}`, { delay: 100 });
    await page.keyboard.press('Enter', { delay: 100 });
    await page.waitFor(1000);

    try {

      await page.click(`#radio1`);
    } catch (err) {
      let contrato = "não localizado"
      dados.push({
        cpf,
        nasc,
        contrato
      });
      console.log('Não encorentei contratos');
      await browser.close();
      var semcontratos = true
    };
    if (semcontratos != true) {
      await page.waitForSelector('#bt_continuar > span');
      const quantidaderadio = (await page.$$('input[type=radio]')).length;
      if (quantidaderadio > 0) {
        for (let i = 1; i <= quantidaderadio; i++) {

          await page.waitFor(`#radio${i}`)
          const contrato = await page.$eval(`#radio${i}`, el => el.value);
          console.log(contrato);
          await page.click(`#radio${i}`);
          await page.waitFor('#bt_continuar > span')
          await page.click('#bt_continuar > span');
          await page.waitFor('#dialog > div > select > option')

          const quantidadeboletos = (await page.$$('#dialog > div > select > option')).length;
          const primeiralinha = await page.$eval('#dialog > div > select > option:nth-child(1)', el => el.label);
          const allpobrigation = [];
          if (quantidadeboletos >= 1 && primeiralinha != 'NENHUM BOLETO EXIBIDO') {
            for (b = 1; b <= quantidadeboletos; b++) {
              const opc = await page.$eval(`#dialog > div > select > option:nth-child(${b})`, el => el.value);
              console.log(opc);
              allpobrigation.push(opc)
              await page.select(`select[name="pObrigacao"] `, `${opc}`);
              await page.click(`#bt_continuar > span`);
              await page.waitFor(2000);
              let pages = await browser.pages();
              await pages[2].waitFor(`#bt_continuar > span`);
              const codigodebarra = await pages[2].$eval('#dialog > div > div:nth-child(6) > strong > span', el => el.innerText);
              console.log(codigodebarra);
              await pages[2].click(`#bt_continuar > span`);
              await pages[2].waitFor(3000);
              let pages3 = await browser.pages();
              await pages3[3].waitFor(3000);
              try {
                //boleto Santader
                var valorboleto = await pages3[3].$eval('#boleto_parceiro > table.tabelas > tbody > tr:nth-child(5) > td.direito > div.var', el => el.innerText);
                var vencimento = await pages3[3].$eval('#boleto_parceiro > table.tabelas > tbody > tr:nth-child(1) > td.direito > div.var', el => el.innerText);
              } catch (err) {
                // console.log(err)
                try {
                  //boleto bancdo brasil
                  var valorboleto = await pages3[3].$eval('body > center > table:nth-child(6) > tbody > tr > td:nth-child(7) > table > tbody > tr:nth-child(2) > td:nth-child(2) > p > strong', el => el.innerText);
                  var vencimentobrunto = await pages3[3].$eval('body > center > table:nth-child(1) > tbody > tr > td:nth-child(3) > div > center > table:nth-child(1) > tbody > tr > td > p > strong', el => el.innerText);
                  var vencimento = vencimentobrunto.substring(vencimentobrunto.indexOf("ATÉ") + 4).trim();

                } catch (err) {
                  criartxtbug.criararquivotxt(err)
                  console.log(err)
                }
              }

              await pages3[3].screenshot({ path: `./hapvida/boleto/${opc}.png`, fullPage: true });
              await pages3[3].close();
              await pages3[2].close();
              var situacaoparcela = 'Pendente';
              dados.push({
                cpf,
                nasc,
                contrato,
                situacaoparcela,
                codigodebarra,
                valorboleto,
                vencimento,
                opc
              });
              console.log(dados);
              var dia = vencimento.slice(0, 2)
              var mes = vencimento.slice(3, 5)
              var ano = vencimento.slice(6, 11)

              console.log("valordeal" + valordeal + "  " + valorboleto)
              if ((Math.abs(valordeal - valorboleto) <= 70)) {
                updatedeal.updatedeal(dealid, contrato)
                const ticktlozalizados = await buscarticket.buscarticket(dealid)

                const filtroopc = ticktlozalizados.filter(function (opobriga) {
                  const opc22 = JSON.parse(opobriga.properties.jsonticket)
                  return opc22.obrigation == `${opc}`
                })

                if (filtroopc == 0) {
                  const link = await criararquivo.criararquivo(opc)
                  const subject = `Boleto Hapvida Vencimento: ${vencimento}`
                  const hs_pipeline_stage = "1"
                  const vencimento_boleto = ano + "-" + mes + "-" + dia
                  const jsonticket = JSON.stringify({ obrigation: `${opc}`, contrato: `${contrato}`, vidid: vidid, dealid: dealid, seguradora: "hapvida", valorboleto: valorboleto, contrato: contrato })
                  const linkdoboleto = link.objects[0].friendly_url
                  console.log(subject, hs_pipeline_stage, vencimento_boleto, jsonticket, linkdoboleto, vidid, dealid)
                  criarticket.criarticket(subject, hs_pipeline_stage, vencimento_boleto, jsonticket, linkdoboleto, vidid, dealid, valorboleto, contrato)
                }

              } else {

              }
            }
            await page.waitFor(`#bt_voltar > span`);
            await page.click(`#bt_voltar > span`);
          } else {
            var situacaoparcela = "Sem pendencia"
            dados.push({
              cpf,
              nasc,
              contrato,
              situacaoparcela
            });

            await page.click('#bt_voltar > span');
            await page.waitFor(2000)
          }

          //dando baixa
          try {

            const tickttotal = await buscarticket.buscarticket(dealid)
            for (let z = 0; z < tickttotal.length; z++) {
              const jsonticket = JSON.parse(tickttotal[z].properties.jsonticket)
              if (jsonticket.contrato == contrato) {

                const baixaparcela = allpobrigation.filter(function (tickets) {
                  console.log(tickets)
                  console.log(jsonticket.obrigation)
                  return tickets == jsonticket.obrigation
                })
                if (baixaparcela == 0) {
                  updateticket.updateticket(tickttotal[z].id)
                } else {
                }
              }
            }
          } catch (err) {
            criartxtbug.criararquivotxt(err)
            console.log(err)

          }
          // fim dar baixa
        }
        await browser.close();
      }
      await browser.close();
      return dados
    }
  } catch (err) {

    try {
      console.log(err)
      await browser.close();
    } catch (err) {
      criartxtbug.criararquivotxt(err)
      console.log(err)
    }

    criartxtbug.criararquivotxt(err)
    console.log(err);
  }

}

exports.boletohapvida = boletohapvida


