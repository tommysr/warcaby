const http = require("http")
const qs = require("querystring")
const fs = require("fs")
const mime = require("mime-types")
const path = require("path")

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


const addPlayer = (name, res) => {
    let state = "error" //no places left or username taken

    if (!players[0]) {
        players[0] = name
        state = "player1"
    }
    else if (!players[1] && players[0] != name) {
        players[1] = name
        state = "player2"
    }

    res.end(state)
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

    res.end("ok")
}

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
                addPlayer(finishObj.name, res)
                break
            case "reset":
                resetBoard(res)
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
