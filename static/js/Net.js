class Net {
    constructor() {
        this.czekaj;
        this.stan;
        this.mojlogin;
        this.porownywanie;
    }
    
    login(){
        console.log("l");
        var login = $("#loginname").val()
        $.ajax({
            url: "/",
            data: { action: "add", name: login },
            type: "POST",
            success:  (data) => {
                switch (data) {
                    case "player1":
                        $("#info").html(data + ": " + login + "</br>Czekanie na gracza 2")
                        game.setPoz("front");
                        game.dajPionki()

                        this.czekaj = setInterval(() => this.check(), 500);
                        this.zniknij();
                        this.porownywanie = setInterval(() => this.compareTabs() , 1000);
                        this.stan = data;
                        this.mojlogin = login;
                        break;

                    case "player2":
                        $("#info").text(data + ": " + login)
                        game.setPoz("back");

                        game.dajPionki()
                        this.zniknij()
                        this.porownywanie = setInterval( () => this.compareTabs() , 1000);
                        this.stan = data;
                        this.mojlogin = login;
                        break;

                    case "loginz":
                        $("#info").text(data)
                        break;

                    case "brak miejsc":
                        $("#info").text(data)
                        break;
                }
            },
            error: function (xhr, status, error) {
                console.log("error")
            },
        });
    }

    reset(){
        console.log("r");
        $.ajax({
            url: "/",
            data: { action: "reset" },
            type: "POST",
            success: (data) => {
                if (data == "ok") {
                    location.reload();
                }
            },
            error: function (xhr, status, error) {
                console.log("error")
            },
        });
    }

    zniknij() {
        $("#form").css("display", "none");
    }

    check() {
        console.log("k");
        $.ajax({
            url: "/",
            data: { action: "check" },
            type: "POST",
            success: (data) => {
                if (data == "true") {
                    this.stop();
                    $("#info").html(this.stan + ": " + this.mojlogin + "</br>Gracz 2 dołączył")
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
        console.log("u");
        clearInterval(this.porownywanie)
        $.ajax({
            url: "/",
            data: { action: "update", data: JSON.stringify(pionki) },
            type: "POST",
            success: (data) => {
                console.log(data);
                if (data == "ok") {
                    this.porownywanie = setInterval(() =>{ this.compareTabs() }, 1000);
                }
            },
            error: function (xhr, status, error) {
                console.log("error")
                this.updateTabs(game.get_pionki())
            },
        });
    }

    compareTabs() {
        console.log("i");
        $.ajax({
            url: "/",
            data: { action: "compare", data: JSON.stringify(game.get_pionki()) },
            type: "POST",
            success: (data) => {
                console.log(data);
                var obj = JSON.parse(data);
                console.log(obj.zmiany)
                if (obj.zmiany == "true") {
                    game.set_pionki(obj.pionkiTab);
                    game.refresh();
                }
            },
            error: function (xhr, status, error) {
                console.log("error")
            },
        });
    }

}


  

  