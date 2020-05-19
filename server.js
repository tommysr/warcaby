const http = require("http")
const qs = require("querystring")
const fs = require("fs")
const mime = require("mime-types")
const path = require("path")

let players = [];
let pawnsTab = []


const addPlayer = (name) => {
    if(!players[0]){
        players[0] = name
        return 'firstplayer'
    }
    if(!players[1]){
        if(players[0] == name)
            return 'existing'
        else{
            players[1] = name
            return 'secondplayer'
        }
    }
    else
        return 'toomany'
}


const resetBoard = (res) => {
    players = []
    pawnsTab = [
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
    pawnsTab = JSON.parse(finishObj.data)
    res.end("ok")
}

const compareTab = (finishObj, res) =>{
    var obj = {}

    if (finishObj.data === JSON.stringify(pawnsTab)) 
        obj.changes = "false"
    else {
        obj.changes = "true"
        obj.pawnsTab = pawnsTab
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

const server = http.createServer(function (req, res) {
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
    console.log("Starting on port: 3000")
});
