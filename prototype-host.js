const express = require("express");
const multer = require("multer");
const fs = require("fs");
var cpUpload = multer({ dest: __dirname + '/uploads/' }).fields([{ name: 'file', maxCount: 1 }]);
const mkdirp = require("mkdirp");
var extract = require('extract-zip');
var Servings = require("./servings.js").Servings;

const PrototypeHost = {
    startHost(port) {
        let app = express();

        let servings = Servings.createServings();

        app.post("/deploy", cpUpload, (req, res) => {
            let targetPort = req.query.port;

            let uploadedFile = req.files["file"][0];

            let uploadedPath = uploadedFile.path;

            mkdirp(__dirname + "/prototypes/" + targetPort, () => {

                extract(uploadedPath, {dir: __dirname + "/prototypes/" + targetPort}, function (err) {
                    fs.unlink(uploadedPath);

                    servings.restart(targetPort);
                });
            });
            res.json({});
        });

        app.listen(port, () => {
            console.log(`Hosting prototypes at ${port}`);
        });
    }
};

exports.PrototypeHost = PrototypeHost;