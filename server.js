const http = require("http")
const fs = require("fs")
const mime = require("mime-types")
const path = require("path")
const qs = require("querystring")

let players = [];
let pawnsTab = []

const addPlayer = (name) => {
    if(!players[0]){
        players[0] = name
        return 'first player'
    }
    if(!players[1]){
        if(players[0] == name)
            return 'the given user already exists'
        else{
            players[1] = name
            return 'second player'
        }
    }
    else
        return 'lack of space'
}


const reset = (res) => {
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

const update = (finish, res) => {
    pawnsTab = JSON.parse(finish.data)
    res.end("ok")
}

const compare = (finish, res) =>{
    var obj = {}

    if (finish.data === JSON.stringify(pawnsTab)) 
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
        var finish = qs.parse(allData)

        switch (finish.action) {
            case "add":
                res.end(addPlayer(finish.name))
                break
            case "reset":
                reset(res)
                res.end("ok")
                break
            case "check":
                res.end(players[1] ? players[1] : "")
                break
            case "update":
                update(finish, res)
                break
            case "compare":
                compare(finish, res)
                break
        }
    })
}

var server = http.createServer(function (req, res) {
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
