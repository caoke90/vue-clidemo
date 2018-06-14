
const path = require('path');
const express = require('express');
const proxyMiddleware = require('http-proxy-middleware');
// default port where dev server listens for incoming traffic
const port = process.env.PORT || 80;

const mockArr = require("../mock/index.js");
const cardsJSON = require("./cardsJSON");

const mockUrl = {}
mockArr.forEach(function(item) {
	Object.assign(mockUrl, item)
})
var bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

var formidable = require("formidable");


const list = []
if(mockArr.length) {
	var urlMock = mockArr[0]
	Object.keys(urlMock).forEach(function(url) {
		var mock = urlMock[url];
		list.push({
			key: url,
			value: mock,
		})
	})
}




//文件上传
app.post('/upload', function(req, res, next) {
	var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = __dirname + '/../static/';
    form.maxFieldsSize = 10 * 1024 * 1024;
	 //解析
    form.parse(req, function (err, fields, files) {

        if(err) return res.json(err);
        for (var file in files) {
            //后缀名
            var extName = /\.[^\.]+/.exec(files[file].name);
            var ext = Array.isArray(extName)
                ? extName[0]
                : '';
            //重命名，以防文件重复
            var avatarName =  files[file].name;
            //移动的文件目录
            var newPath = form.uploadDir + avatarName;
            fs.renameSync(files[file].path, newPath);
            fields[file] = {
                size: files[file].size,
                url: uri+staticPath+"/"+avatarName,
                path: newPath,
                name: files[file].name,
                type: files[file].type,
                extName: ext
            };
        }
        res.json( fields);
    });
});
//保存card数据
app.post("/subject/h5/savecard", function(req, res) {
	var cards = JSON.parse(req.body.cardlist)
	cards.forEach(function(arr) {
		if(arr.card_group) {
			for(var i = 0; i < arr.card_group.length; i++) {
				var card = arr.card_group[i];
				if(typeof card.card_type=="number"){
          card.card_type="card"+card.card_type;
        }
				if(card.card_type == "card20") {
					var item = cardsJSON.getCardData(card.card_type);
          item.title=card.title;
          item.height=card.pic_height;
					arr.card_group[i] = item;
				}
        if(card.card_type == "card21") {
          var item = cardsJSON.getCardData(card.card_type);
          item.title=card.title;
          item.height=card.pic_height;
          arr.card_group[i] = item;
        }
				if(card.card_type == "card9") {
          var item = cardsJSON.getCardData(card.card_type);
					arr.card_group[i] = item;
				}
        if(card.card_type == "card100") {
          var item = cardsJSON.getCardData(card.card_type);
          if(Array.isArray(item)){
            arr.card_group[i] = item[0|Math.random()*item.length];
          }else{
            arr.card_group[i] = item
          }
        }
				if(card.card_type == "card25") {
          var item = cardsJSON.getCardData(card.card_type);
					arr.card_group[i] = item;
				}
        if(card.card_type == "card31") {
          card.diff_endtime=parseInt((new Date(card.end_time).getTime()-new Date().getTime())/1000);
          card.diff_warningtime=parseInt((new Date(card.warning_time).getTime()-new Date().getTime())/1000);
        }
        if(card.card_type == "card32") {
          var item = cardsJSON.getCardData(card.card_type);
          card.rate=item.rate;
          card.update_url=item.update_url;
          card.update_url_freq=item.update_url_freq;
          card.count=item.count;
        }
        if(card.card_type == "card33") {
          var item = cardsJSON.getCardData(card.card_type);
          item.title=card.title;
          item.desc=card.desc;
          item.is_pic=card.is_pic;
          item.width=card.width;
          item.height=card.height;
          item.button_vote_text=card.button_vote_text;
          item.button_have_vote_text=card.button_have_vote_text;
          arr.card_group[i] = item;
        }
				if(card.card_type == "card2008") {
          var item = cardsJSON.getCardData(card.card_type);
					arr.card_group[i] = item;
				}
        if(card.card_type == "card3001") {
          var item = cardsJSON.getCardData(card.card_type);
          arr.card_group[i] = item;
        }
			}
		}
	})
	fs.writeFileSync(__dirname + "/../mock/subject/h5/getcardinfo", JSON.stringify({
		"status": 1,
		"message": "ok",
		"data": {
			"cards": JSON.parse(req.body.cardlist)
		}
	}, null, 2))
	fs.writeFileSync(__dirname + "/../mock/subject/h5/getpageinfo", JSON.stringify({
		"status": 1,
		"message": "ok",
		"data": {
			"cards": cards
		}
	}, null, 2))
	res.json({
		status: 1
	})
})

const fs = require("fs")
const rewrite = require("./rewrite")
Object.keys(mockUrl).forEach(function(url) {
	var mock = mockUrl[url];

	if(/^http:/.test(mock)) {

		var options = {
			target: mock.replace(/(http:\/\/[^/]+)\/.+/, "$1"),
			changeOrigin: true,
			pathRewrite: {}
		};
		options.pathRewrite[url] = mock.replace(/http:\/\/[^/]+\//, "/")
		app.use(proxyMiddleware(options.filter || url, options));
	} else {
		var filepath = path.join(__dirname, "../mock" + mock)
		if(fs.existsSync(filepath)) {
			app.use(url, function(req, res, next) {
				res.jsonp(JSON.parse(fs.readFileSync(filepath).toString()))
			});
		} else {
			app.use(rewrite(url, mock));
		}

	}

});

app.use("/", express.static(__dirname+'/../../dist'));

function getIPAdress() {
    var interfaces = require('os').networkInterfaces();
    for(var devName in interfaces) {
        var iface = interfaces[devName];
        for(var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
}
const opn = require('opn');


const readyPromise = new Promise(resolve => {

    if(port!==80){
        var uri = 'http://' + getIPAdress() + ':' + port;
        console.log('> Listening at ' + uri + '\n');
        opn(uri,{app: ['chrome']});
	}

});
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync(__dirname+'/private.pem', 'utf8');
var certificate = fs.readFileSync(__dirname+'/file.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

var SSLPORT = 443;

httpServer.listen(port, function() {
    console.log('HTTP Server is running on: http://localhost:%s', port);
});
httpsServer.listen(SSLPORT, function() {
    console.log('HTTPS Server is running on: https://localhost:%s', SSLPORT);
});

module.exports = {
	ready: readyPromise,
	close: () => {
        console.log("close")

	}
};
