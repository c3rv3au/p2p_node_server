var http = require('http');
var parseString = require('xml2js').parseString;

//result = '<?xml version="1.0"?><result status="OK" response="0.02370285987854"><record><pos>1</pos><title><![CDATA[Online Income Jobs]]></title><url>onlineincomejobs.com</url><description><![CDATA[Onlineincomejobs.com is a news portal dedicated in showing every entrepreneur on how to make money online with Internet Marketing . We feature reviews, news, interviews, events, commentaries that are relevant to all Internet Marketing enthusiasts]]></description><bid>0.0003</bid><click><![CDATA[http://162.210.198.141/redirect_js_new.php?tim=1423185011.0638&p=sc5ca2e33c52dc0e8e216cecd02dc97934&subid=2&affid=913]]></click></record></result>';

var reachnetwork = function(ip, keyword, subid, useragent, referer_url, callback) {
  url = "http://913.yellw.info";
  path = "/xml.php?affid=913&subid=" + subid + '&q=' + urlencode(keyword) + '&useragent=' + urlencode(useragent) + '&ip=' + ip + '&ref=' + urlencode(referer_url) + '&num=10&lang=en&max-response=1';

  //console.log ("Reach path: " + path);
 
  var already_call = false;

  var options = {
    host: '913.yellw.info',
    path: path
  }
  var request = http.request(options, function (res) {
    var data = '';
    res.on('data', function (chunk) {
        data += chunk;
    });
    res.on('end', function () {
      //console.log("Reach Result: " + data);
      parseString(data, function (err, result) {
        if (typeof result === "undefined") {
        } else {
           if (typeof result.result === "undefined") {
           } else {
             if (typeof result.result.record === "undefined") {
             } else if (!already_call) {
               already_call = true;
               callback(result.result);
             }
          }
        }
        if (!already_call) {
          already_call = true;
          callback(null);
        }
      });
    });
  });

  request.on('socket', function (socket) {
    socket.setTimeout(500);  
    socket.on('timeout', function() {
      if (!already_call) {
        already_call = true;
        callback(null);
      }
      //console.log('Reachnetwork Timeout');
      request.abort();
    });
  });

  request.on('error', function (e) {
    if (!already_call) {
      already_call = true;
      callback(null);
    }
    //console.log(e.message);
  });

  request.end();
}

/*
ip = '24.54.53.102';
reachnetwork(ip,'top 10', 2, 'Mozilla/5.0(iPad; U; CPU iPhone OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B314 Safari/531.21.10', 'http://www.toutrix.com/en', function(result) {
  if (result != null)
    console.log(result);
});

ip = '24.54.44.102';
reachnetwork(ip,'music', 2, 'Mozilla/5.0(iPad; U; CPU iPhone OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B314 Safari/531.21.10', 'http://www.toutrix.com/en', function(result) {
  if (result != null)
    console.log(result);
});

ip = '8.8.4.4';
reachnetwork(ip,'gift', 2, 'Mozilla/5.0(iPad; U; CPU iPhone OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B314 Safari/531.21.10', 'http://www.toutrix.com/en', function(result) {
  if (result != null)
    console.log(result);
});

*/

function urlencode(str) {
  str = (str + '')
    .toString();

  // Tilde should be allowed unescaped in future versions of PHP (as reflected below), but if you want to reflect current
  // PHP behavior, you would need to add ".replace(/~/g, '%7E');" to the following.
  return encodeURIComponent(str)
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .
  replace(/\)/g, '%29')
    .replace(/\*/g, '%2A')
    .replace(/%20/g, '+');
}

module.exports = {
  reachnetwork: reachnetwork
}