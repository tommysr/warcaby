const http = require("http")
const qs = require("querystring")
const fs = require("fs")
const mime = require("mime-types")
const path = require("path")

let players = [];
let pionkiTab = []


const addPlayer = (name) => {

    if(!players[0]){
        players[0] = name
        return 'player1'
    }
    if(!players[1]){
        if(players[0] == name)
            return 'username taken'
        else{
            players[1] = name
            return 'player2'
        }
    }
    else
        return 'no places left'
}


const resetBoard = (res) => {
    players = []
    pionkiTab = [
        [0, 2, 0, 2, 0, 2, 0, 2],
        [2, 0, 2, 0, 2, 0, 2, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0]
    ]
}
resetBoard()

const updateTab = (finishObj, res) => {
    pionkiTab = JSON.parse(finishObj.data)
    res.end("ok")
}

const compareTab = (finishObj, res) =>{
    var obj = {}

    if (finishObj.data === JSON.stringify(pionkiTab)) 
        obj.zmiany = "false"
    else {
        obj.zmiany = "true"
        obj.pionkiTab = pionkiTab
    }

    res.end(JSON.stringify(obj))
}


const serverres = (req, res) => {
    var allData = "";
    req.on("data", function (data) {
        allData += data
    })
    req.on("end", function (data) {
        var finishObj = qs.parse(allData)

        switch (finishObj.action) {
            case "add":
                res.end(addPlayer(finishObj.name))
                break
            case "reset":
                resetBoard(res)
                res.end("ok")
                break
            case "check":
                res.end(players[1] ? players[1] : "")
                break
            case "update":
                updateTab(finishObj, res)
                break
            case "compare":
                compareTab(finishObj, res)
                break
        }
    })
}

var server = http.createServer(function (req, res) {
    var req = req
    var res = res

    switch (req.method) {
        case "GET":
            let url =
            req.url == "/" ? "/index.html" : req.url
    
            let type = mime.lookup(url);

            fs.readFile(path.join('static', decodeURI(url)), function (error, data) {
                res.writeHead(200, { "Content-Type": `${type};charset=utf-8` })

                if(error)
                    console.error('err:', error)
                else
                    res.write(data)

                res.end()
            })
            break;
        case "POST":
            res.writeHead(200, { "content-type": "text/html;charset=utf-8" })
            serverres(req, res)
          break;
      } 
})

server.listen(3000, function () {
    console.log("serwer startuje na porcie 3000")
});
