const express = require("express");
const fs = require("fs");
const Path = require("path");

const Servings = {
    createServings() {

        let servings = {};

        fs.readdir(`${__dirname}/prototypes`, (err, list) => {
            list.forEach((port) => startServer(port));
        });

        function startServer(port) {

            let app = express();

            let appDir = `${__dirname}/prototypes/${port}`;
            app.use(express.static(appDir));

            let server;
            fs.readFile(`${appDir}/prototype-server.json`, (err, content) => {
                let config = JSON.parse(content);

                config.indexServingPaths.forEach((path) =>
                    app.get(path, (req, res) => {
                        res.sendFile(Path.resolve(`${appDir}/index.html`));
                    })
                );

                server = app.listen(port);
            });

            servings[port] = () => {
                server && server.close();
            };
        }

        return {
            restart(port) {
                servings[port] && servings[port]();

                startServer(port);
            }
        };
    }
};

exports.Servings = Servings;