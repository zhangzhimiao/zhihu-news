const http = require('http');
const request = require('request');
const hostname = 'localhost';
const port = 8010;
const imgPort = 8011;

const apiServer = http.createServer((req, res) => {
    console.log('api请求:' + req.url);
    const url = 'http://news-at.zhihu.com/api/4' + req.url;
    const options = {
        url: url
    };
    function callback(error, response, body){
        if(!error && response.statusCode == 200){
            res.setHeader('content-Type', 'text/plain;chartset=UTF-8');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.end(body);
        }
    }
    request.get(options,callback);
});

apiServer.listen(port, hostname, () => {
    console.log(`接口代理运行在http://${hostname}:${port}/`);
})

const imgServer = http.createServer((req, res) => {
    const url = req.url.split('/img/')[1];
    console.log('图片请求:' + req.url);
    const options = {
        url: url,
        encoding: null
    };
    function callback(error, response, body){
        if(!error && response.statusCode == 200){
            const contentType = response.headers['content-Type'];
            res.setHeader('content-Type', 'text/plain;chartset=UTF-8');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.end(body);
        }
    }
    request.get(options, callback);
});
imgServer.listen(imgPort, hostname, () => {
    console.log(`图片代理运行在http://${hostname}:${imgPort}/`);
})