class Net {
    constructor() {
        this.waitForPlayer = {
            id: null,
            stop: function(){
                if(!this.id) return

                clearInterval(this.id)
                this.id = null
            }
        }
        this.state
        this.userLogin
        this.comparison
    }
    
    login(){
        let login = $("#loginname").val()
        $.ajax({
            url: "/",
            data: { action: "add", name: login },
            type: "POST",
            success: (data) => {
                switch (data) {
                    case "player1":
                        $(".status").css("display", "block")
                        this.stat = `<h1>Nick gracza: ${login}</h1>Połączono(białe)`
                        $(".status").html(this.stat)
                        $("#login").css("display", "none")
                        
                        $(".backgroundToMenu").click(function(event){
                            event.stopImmediatePropagation()
                        })

                        game.camera.position.set(780, 400, 0)
                        game.camera.lookAt(game.scene.position)

                        game.addPawns()

                        this.waitForPlayer.id = setInterval(() => { this.check() }, 500)
                        this.comparison= setInterval(() => this.compareTabs(), 1000)
                        this.state = data
                        this.userLogin = login
                        break

                    case "player2":
                        $(".status").css("display", "block")
                        $(".status").html(`<h1>Nick gracza: ${login}</h1>Połączo(czarne)`)
                        $("#login").css("display", "none")
                        $(".backgroundToMenu").css("display", "none")
                        
                        
                        game.camera.position.set(-780, 400, 0)
                        game.camera.lookAt(game.scene.position)
                        game.addPawns()

                        this.comparison= setInterval(() => this.compareTabs(), 1000)
                        this.state = data
                        this.userLogin = login
                        break

                    case "username taken":
                        $(".status").css("display", "block")
                        $(".status").html(`<h1>${data}</h1>`)
                        break

                    case "no places left":
                        $(".status").css("display", "block")
                        $(".status").html(`<h1>${data}</h1>`)
                        break
                }
            },
            error: function () {
                console.log("error add")
            },
        })
    }

    reset(){
        $.ajax({
            url: "/",
            data: { action: "reset" },
            type: "POST",
            success: (data) => {
                if (data == "ok") {
                    location.reload()
                }
            },
            error: function () {
                console.log("error")
            },
        })
    }

    check() {
        $.ajax({
            url: "/",
            data: { action: "check" },
            type: "POST",
            success: (data) => {
                if (data != "") {
                    this.waitForPlayer.stop()

                    $(".status").html(`${this.stat}<br/>${data} dołączył(czarne)`)
                    $(".backgroundToMenu").css("display", "none")
                }
            },
            error: function () {
                console.error("error check")
            },
        })
    }


    block(){

        $(".backgroundToMenu").html(`<h1>${this.time}</h1>`)

        if(this.time <= 0)
            $(".backgroundToMenu").css("display", "none")
        else
            $(".backgroundToMenu").css("display", "block")
    }


    updateTabs(pionki){
        clearInterval(this.comparison)
        $.ajax({
            url: "/",
            data: { action: "update", data: JSON.stringify(pionki) },
            type: "POST",
            success: (data) => {
                if (data == "ok") {
                    clearInterval(this.comparison)
                    this.time = 30

                    $(".backgroundToMenu").click(function(event){
                        event.stopImmediatePropagation()
                    })

                    this.block()

                    this.comparison= setInterval(() =>{
                        this.compareTabs() 
                        this.time--
                        this.block()
                    }, 1000)
                }
            },
            error: function () {
                console.log("error update")
                this.updateTabs(game.pionki)
            },
        })
    }

    compareTabs(mode = false) {
        $.ajax({
            url: "/",
            data: { action: "compare", data: JSON.stringify(game.pionki) },
            type: "POST",
            success: (data) => {
                let obj = JSON.parse(data)
                if (obj.zmiany == "true") {
                    this.time = 0
                    this.block()

                    if(mode)
                        $(".backgroundToMenu").css("display", "none")
                    
                    game.pionki = obj.pionkiTab
                    game.refresh()
                }
            },
            error: function () {
                console.log("error compare")
            },
        })
    }
}




