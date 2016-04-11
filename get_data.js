var fs = require('fs');
var utils = require('utils');
var links = JSON.parse(fs.read('links.json'));
var data = [];


var casper = require('casper').create({
    pageSettings: {
        loadImages:  false,        // The WebPage instance used by Casper will
        loadPlugins: false         // use these settings
    },
    verbose: true,
    logLevel: "info"
});

casper.start().each(links, function(self, link) {
    self.thenOpen(link, function() {
        var element = {};
        
        var profe = casper.evaluate(function() {
            return document.querySelector("#div_panel_derecho > table:nth-child(1) > tbody > tr:nth-child(2) > td > div > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(1) > td > label").innerHTML;
        });
        var mail = casper.evaluate(function() {
            return document.querySelector("#div_panel_derecho > table:nth-child(1) > tbody > tr:nth-child(2) > td > div > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(4) > td > table > tbody > tr:nth-child(2) > td > label").innerHTML;
        });
        var cargo = casper.evaluate(function() {
            return document.querySelector("#div_panel_derecho > table:nth-child(1) > tbody > tr:nth-child(2) > td > div > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(2) > td > label").innerHTML;
        });
        
        element.teacher = profe.trim();
        element.email = mail.trim();
        element.position = cargo.trim();
        element.area = casper.cli.get("area");
        
        data.push(element);
    });
});

casper.run( function () {
    //this.echo(JSON.stringify(data));
    fs.write(casper.cli.get("area") +'.json', JSON.stringify(data), 'w');
    this.exit();
});