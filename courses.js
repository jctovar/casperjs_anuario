var links = [];
var data = [];
var fs = require('fs');

function getLinks() {
    var links = document.querySelectorAll('body > table:nth-child(2) > tbody > tr > td > div > form > table > tbody > tr td input');
    return Array.prototype.map.call(links, function(e) {
        return e.getAttribute('value');
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

casper.userAgent('Tezcatlipoca/0.9.34 (the nahuatl spiderbot)');

casper.start('http://campus.iztacala.unam.mx/prosap/informa.cgi', function() {
    links = this.evaluate(getLinks);
    var len = links.length;
    links = links.splice(0,(len - 2))
});

casper.then(function() {
    for ( var i = 0; i < links.length; i++) {
          casper.thenOpen('http://campus.iztacala.unam.mx/prosap/informa.cgi?id=' + links[i] + '&detalla=Detalles', function() {
            var element = {};
            
            element.course_id = links[i];
            
            element.course_type = casper.evaluate(function() { // ok
                return document.querySelector("body > table:nth-child(2) > tbody > tr > td > div > form > table > tbody > tr:nth-child(1) > td:nth-child(2) > b").innerHTML;
            });
            
            element.course_name = casper.evaluate(function() { // ok
                return document.querySelector("body > table:nth-child(2) > tbody > tr > td > div > form > table > tbody > tr:nth-child(2) > td:nth-child(2) > b").innerHTML;
            });
            
            element.course_field = casper.evaluate(function() { // ok
                return document.querySelector("body > table:nth-child(2) > tbody > tr > td > div > form > table > tbody > tr:nth-child(3) > td:nth-child(2) > b").innerHTML;
            });
            
            element.course_start_date = casper.evaluate(function() { // ok
                return document.querySelector("body > table:nth-child(2) > tbody > tr > td > div > form > table > tbody > tr:nth-child(17) > td:nth-child(2) > table > tbody > tr:nth-child(1) > td:nth-child(2) > b").innerHTML;
            });
            
            element.course_end_date = casper.evaluate(function() { // ok
                return document.querySelector("body > table:nth-child(2) > tbody > tr > td > div > form > table > tbody > tr:nth-child(17) > td:nth-child(2) > table > tbody > tr:nth-child(1) > td:nth-child(4) > b").innerHTML;
            });
       
            element.course_location = casper.evaluate(function() { // ok
                return document.querySelector("body > table:nth-child(2) > tbody > tr > td > div > form > table > tbody > tr:nth-child(19) > td:nth-child(2) > p > b").innerHTML;
            });
            
            element.course_justification = casper.evaluate(function() { // ok
                return document.querySelector("body > table:nth-child(2) > tbody > tr > td > div > form > table > tbody > tr:nth-child(5) > td:nth-child(2) > b").innerHTML;
            });
            
            element.course_level = casper.evaluate(function() { // ok
                return document.querySelector("body > table:nth-child(2) > tbody > tr > td > div > form > table > tbody > tr:nth-child(7) > td:nth-child(2) > b").innerHTML;
            });
            
            element.course_objective = casper.evaluate(function() { // ok
                return document.querySelector("body > table:nth-child(2) > tbody > tr > td > div > form > table > tbody > tr:nth-child(9) > td:nth-child(2) > b").innerHTML;
            });
            
            element.course_requirements = casper.evaluate(function() { // ok
                return document.querySelector("body > table:nth-child(2) > tbody > tr > td > div > form > table > tbody > tr:nth-child(22) > td:nth-child(2) > b").innerHTML;
            });
            
            element.course_url = casper.evaluate(function() { // ok
                return document.querySelector("body > table:nth-child(2) > tbody > tr > td > div > form > input[type=\"hidden\"]").getAttribute('value');
            });

            data.push(element); 
          });
    }
});

casper.then(function() {
    if (data.length > 0 ) {
        casper.open('https://galadriel.ired.unam.mx:8100/courses?account_key=123', {
        method: 'delete'
        });
    }
});

casper.then(function() {
    for ( var i = 0; i < data.length; i++) {
        var obj = data[i];
          casper.thenOpen('https://galadriel.ired.unam.mx:8100/courses?account_key=123', {
              method: 'post',
              data:   obj
          });
    }
});

casper.run(function() {
    this.exit();
});
