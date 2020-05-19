class Net {
    constructor() {
        this.czekaj;
        this.stan;
        this.mojlogin;
        this.porownywanie;
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
                        $(".status").css("display", "block");
                        $(".status").html(`<h1>${data}: ${login}</h1><p>connected to game (white pawns)</p>`);
                        $("#logindiv").css("display", "none");
                        
                        $(".lds-grid").css("display", "inline-block");
                        $(".backgroundToMenu").click(function(event){
                            event.stopImmediatePropagation();
                        });
                        game.setPoz("front");
                        game.dajPionki()

                        this.czekaj = setInterval(() => { this.check() }, 500);
                        this.porownywanie = setInterval(() => this.compareTabs(), 1000);
                        this.stan = data;
                        this.mojlogin = login;
                        break

                    case "player2":
                        $(".status").css("display", "block");
                        $(".status").html(`<h1>${data}: ${login}</h1><p>connect to game (black pawns)</p>`);
                        $("#logindiv").css("display", "none");
                        $(".backgroundToMenu").css("display", "none");
                        
                
                        game.setPoz("back");
                        game.dajPionki();

                        this.porownywanie = setInterval(() => this.compareTabs(), 1000);
                        this.stan = data;
                        this.mojlogin = login;
                        break;

                    case "username taken":
                        $(".status").css("display", "block");
                        $(".status").html(`<h1>${data}</h1>`)
                        break;

                    case "no places left":
                        $(".status").css("display", "block");
                        $(".status").html(`<h1>${data}</h1>`)
                        break;
                }
            },
            error: function (xhr, status, error) {
                console.log("error")
            },
        });
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
            error: function (xhr, status, error) {
                console.log("error")
            },
        });
    }

    check() {
        $.ajax({
            url: "/",
            data: { action: "check" },
            type: "POST",
            success: (data) => {
                if (data != "") {
                    this.stop();

                    $(".status").html(`${$(".status").html()}${data} joined to game (black pawns)`)
                    $(".lds-grid").css("display", "none");
                    $(".backgroundToMenu").css("display", "none");
                }
            },
            error: function (xhr, status, error) {
                console.log("error")
            },
        });
    }

    get_stan(){
        return this.stan;
    }

    stop() {
        clearInterval(this.czekaj);
    }

    updateTabs(pionki){
        clearInterval(this.porownywanie)
        $.ajax({
            url: "/",
            data: { action: "update", data: JSON.stringify(pionki) },
            type: "POST",
            success: (data) => {
                if (data == "ok") {
                    let i = 30;
                    $(".backgroundToMenu").css("display", "block");
                    $(".backgroundToMenu").click(function(event){
                        event.stopImmediatePropagation();
                    });
                    this.porownywanie = setInterval(() =>{
                        this.compareTabs(1) 
                        $(".backgroundToMenu").html(`<h1>${i}</h1>`);
                        if(i==0){
                            $(".backgroundToMenu").css("display", "none");
                            clearInterval(this.porownywanie);
                        }
                        i--;
                    }, 1000);
                }
            },
            error: function (xhr, status, error) {
                console.log("error")
                this.updateTabs(game.get_pionki());
            },
        });
    }

    compareTabs(mode) {
        $.ajax({
            url: "/",
            data: { action: "compare", data: JSON.stringify(game.get_pionki()) },
            type: "POST",
            success: (data) => {
                let obj = JSON.parse(data);
                if (obj.zmiany == "true") {
                    if(mode==1){
                        $(".backgroundToMenu").css("display", "none");
                    }
                    game.set_pionki(obj.pionkiTab);
                    game.refresh();
                }
            },
            error: function (xhr, status, error) {
                console.log("error")
            },
        })
    }

}




