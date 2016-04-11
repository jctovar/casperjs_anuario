var links = [];
var json = [];
var fs = require('fs');

function getLinks() {
    var links = document.querySelectorAll('div.listado_profesores div');
    return Array.prototype.map.call(links, function(e) {
        return {'click': e.getAttribute('onclick').substring(21,25)};
    });
}

var casper = require('casper').create({
    pageSettings: {
        loadImages:  false,        // The WebPage instance used by Casper will
        loadPlugins: false         // use these settings
    },
    verbose: true,
    logLevel: "info"
});

var link = casper.cli.get(0);

casper.userAgent('Tezcatlipoca/0.9.34 (the nahuatl spiderbot)');
// the link object
casper.start(link, function() {
    this.echo(this.getTitle());
});

casper.then(function() {
    // aggregate results for the 'casperjs' csearch
    links = this.evaluate(getLinks);
});
// create json stream
casper.then(function() {
    for (i = 0, len = links.length; i < len; i++) {
        var c = links[i].click;
        json.push('http://antares.iztacala.unam.mx/datos_anuario/index.php/anuario/principal/0/' + c +'/'); 
    }
});
// save the json file
casper.run( function () {
    fs.write('links.json', JSON.stringify(json), 'w');
    this.exit();
});