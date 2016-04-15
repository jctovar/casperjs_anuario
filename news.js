var links = [];
var fs = require('fs');

function getLinks() {
    var links = document.querySelectorAll('tbody li');
    return Array.prototype.map.call(links, function(e) {
        return {'news_url': e.getElementsByTagName("a")[0].getAttribute('href'), 
        'news_img': e.getElementsByTagName("img")[0].getAttribute('src'), 'news_text': e.getElementsByTagName("img")[0].getAttribute('alt')};
    });
}

var casper = require('casper').create({
    pageSettings: {
        loadImages:  false,        
        loadPlugins: false 
    },
    verbose: true,
    logLevel: "info"
});

casper.start('http://www.iztacala.unam.mx/noticias.php', function() {
    links = this.evaluate(getLinks);
});

casper.then(function() {
    casper.open('https://galadriel.ired.unam.mx:8100/news?account_key=123', {
      method: 'delete'
    });
});

casper.then(function() {
    for ( var i = 0; i < links.length; i++) {
          var obj = links[i];
          casper.thenOpen('https://galadriel.ired.unam.mx:8100/news?account_key=123', {
              method: 'post',
              data:   obj
          });
    }
});

casper.run(function() {
    this.exit();
});
