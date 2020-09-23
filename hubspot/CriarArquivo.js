const fs = require('fs');
var request = require("request");
const { resolve } = require('path');
const apikey = ""
const criartxtbug = require("../CriarTxtbug");
const criararquivo = async (opc) => {
    return new Promise((resolve, reject) => {
        try {
            const options = {
                method: "POST",
                url: `http://api.hubapi.com/filemanager/api/v2/files?hapikey=${apikey}`,
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                formData: {
                    "folder_paths": `./hapvida/boleto/${opc}.png`,
                    "files": fs.createReadStream(`./hapvida/boleto/${opc}.png`)
                }
            };
            request(options, function (err, res, body) {
                if (err) console.log(err);
                // console.log(body)
                try {
                    const parsebody = JSON.parse(body)
                    resolve(parsebody)
                } catch (err) {
                    resolve(err)
                    criartxtbug.criararquivotxt(err)
                }

            });
        } catch (err) {
            criartxtbug.criararquivotxt(err)
        }
    })
}

exports.criararquivo = criararquivo
