var http = require("http");
var qs = require("querystring");
var fs = require("fs");
var mime = require("mime-types");

let players = [];
let pionkiTab = [
    [0, 2, 0, 2, 0, 2, 0, 2],
    [2, 0, 2, 0, 2, 0, 2, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
]


const add = (name, req, res) => {
    let state;
    if (!players[0]) {
        players[0] = name;
        state = "player1";
    }
    else if (!players[1]) {
        if (players[0] != name) {
            players[1] = name;
            state = "player2";
        }
        else 
            state = "player1";
    }
    else {
        if(players[0] == name)
            state = "player1";
        else if(players[1] == name)
            state = "player2";
        else
            state = "brak miejsc";
    }
    res.writeHead(200, { "content-type": "text/html;charset=utf-8" })
    res.end(state);
}

const check = (response) =>{
    var info = "false";
    if (players[1])
        info = "true";
    response.writeHead(200, { "content-type": "text/html;charset=utf-8" })
    response.end(info);
}

const reset = (response) => {
    players = [];
    pionkiTab = [
        [0, 2, 0, 2, 0, 2, 0, 2],
        [2, 0, 2, 0, 2, 0, 2, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0],
    ];
    response.writeHead(200, { "content-type": "text/html;charset=utf-8" });
    response.end("ok");
}

const  updateTab = (finishObj, req, res) => {
    pionkiTab = JSON.parse(finishObj.data);
    res.writeHead(200, { "content-type": "text/html;charset=utf-8" })
    res.end("ok");
}

const compareTab = (finishObj, req, res) =>{
    var obj = {};
    if (finishObj.data === JSON.stringify(pionkiTab)) 
        obj.zmiany = "false";
    else {
        obj.zmiany = "true";
        obj.pionkiTab = pionkiTab;
    }
    var string = JSON.stringify(obj)
    res.writeHead(200, { "content-type": "text/html;charset=utf-8" })
    res.end(string);
}


const serverResponse = (request, response) => {
    var allData = "";
    request.on("data", function (data) {
        allData += data
    })
    request.on("end", function (data) {
        var finishObj = qs.parse(allData)
        switch (finishObj.action) {
            case "add":
                add(finishObj.name, request, response)
                break;
            case "reset":
                reset(response);
                break;
            case "check":
                check(response);
                break;
            case "update":
                updateTab(finishObj, request, response);
                break;
            case "compare":
                compareTab(finishObj, request, response);
                break;
        }
    })
}

var server = http.createServer(function (req, res) {
    var request = req;
    var response = res;

    switch (request.method) {
        case "GET":
          let url =
            request.url == "/"
              ? "/index.html"
              : request.url;
    
          let type = mime.lookup(url);

          if (type && fs.existsSync(`static/${decodeURI(url)}`)) {
            fs.readFile(`static/${decodeURI(url)}`, function (error, data) {
              response.writeHead(200, {
                "Content-Type": `${type};charset=utf-8`,
              });
              response.write(data);
              response.end();
            });
          }
          break;
        case "POST":
            serverResponse(request, response);
          break;
      } 
})

server.listen(3000, function () {
    console.log("serwer startuje na porcie 3000");
});
