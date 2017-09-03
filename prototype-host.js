const express = require("express");
const multer = require("multer");
const fs = require("fs");
var cpUpload = multer({ dest: __dirname + '/uploads/' }).fields([{ name: 'file', maxCount: 1 }]);
const mkdirp = require("mkdirp");
var extract = require('extract-zip');
var Servings = require("./servings.js").Servings;
const rimraf = require("rimraf");

const PrototypeHost = {
    startHost(port) {
        let app = express();

        let servings = Servings.createServings();

        app.post("/deploy/:port", cpUpload, (req, res) => {
            let targetPort = req.params.port;

            let uploadedFile = req.files["file"][0];

            let uploadedPath = uploadedFile.path;

            let deployDir = `${__dirname}/prototypes/${targetPort}`;
            rimraf(deployDir, () => {
                mkdirp(deployDir, () => {
                    extract(uploadedPath, {dir: deployDir}, function (err) {
                        fs.unlink(uploadedPath);

                        servings.restart(targetPort);
                    });
                });
            });
            res.json({});
        });

        app.listen(port, () => {
            console.log(`[${new Date()}] Hosting prototypes at ${port}`);
        });
    }
};

exports.PrototypeHost = PrototypeHost;