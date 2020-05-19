const http = require("http")
const path = require("path")
const qs = require("querystring")
const fs = require("fs")
const mime = require("mime-types")

let players = [];
let pawns = []


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


function resetBoard(){
    players = []
    pawns = [
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



function compare (finishObj, res){
    var obj = {}

    if (finishObj.data === JSON.stringify(pawns)) 
        obj.zmiany = "false"
    else {
        obj.zmiany = "true"
        obj.pionkiTab = pawns
    }

    res.end(JSON.stringify(obj))
}


var server = http.createServer(function (req, res) {
    switch (req.method) {
        case "GET":
            let url = req.url == "/" ? "/index.html" : req.url
    
            fs.readFile(path.join('static', decodeURI(url)), function (error, data) {
                res.writeHead(200, { "Content-Type": `${mime.lookup(url)};charset=utf-8` })

                if(error)
                    console.error('err:', error)
                else
                    res.write(data)

                res.end()
            })
            break;
        case "POST":
            res.writeHead(200, { "content-type": "text/html;charset=utf-8" })
            var allData = "";
            req.on("data", function (data) {
                allData += data
            })
            req.on("end", function () {
                let data = qs.parse(allData)
                switch (data.action) {
                    case "add":
                        res.end(addPlayer(data.name))
                        break
                    case "reset":
                        resetBoard()
                        res.end("ok")
                        break
                    case "check":
                        res.end(players[1] ? players[1] : "")
                        break
                    case "update":
                        pawns = JSON.parse(data.data)
                        res.end("ok")
                        break
                    case "compare":
                        compare(data, res)
                        break
                }
            })
        break;
    } 
})

server.listen(3000, function () {
    console.log("serwer startuje na porcie 3000")
});
