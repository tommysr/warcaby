class Net {
    constructor() {
        this.czekaj;
        this.stan;
        this.mojlogin;
        this.porownywanie;
    }

    loginClick() {
        console.log("l");
        var login = $("#loginname").val()
        $.ajax({
            url: "/",
            data: { action: "add", name: login },
            type: "POST",
            success: (data) => {
                switch (data) {
                    case "player1":
                        // $(".status").html(`user: ${data.toUpperCase()} `  + login + "</br>Waiting for the secend player");
                        $(".status").html(`<h1>${data}: ${login}</h1><p>connected to game (white pawns)</p>`);
                        $("#logindiv").css("display", "none");
                        $(".status").css("display", "block");
                        $(".lds-grid").css("display", "inline-block");
                        game.setPoz("front");
                        game.dajPionki()

                        this.czekaj = setInterval(() => { this.check() }, 500);
                        this.porownywanie = setInterval(() => this.compareTabs(), 1000);
                        this.stan = data;
                        this.mojlogin = login;
                        break;

                    case "player2":
                        $(".status").html(`<h1>${data}: ${login}</h1><p>connect to game (black pawns)</p>`);
                        $("#logindiv").css("display", "none");
                        $(".status").css("display", "block");
                        game.setPoz("back");

                        game.dajPionki()
                        this.porownywanie = setInterval(() => this.compareTabs(), 1000);
                        this.stan = data;
                        this.mojlogin = login;
                        break;

                    case "login zajęty":
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

    resetClick() {
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

    check() {
        console.log("k");
        $.ajax({
            url: "/",
            data: { action: "check" },
            type: "POST",
            success: (data) => {
                if (data == "true") {
                    this.stop();
                    $(".status").html(`${$(".status").html()}player2 join to game (black pawns)`)
                    $(".lds-grid").css("display", "none");
                    $(".backgroundToMenu").css("display", "none");
                }
            },
            error: function (xhr, status, error) {
                console.log("error")
            },
        });
    }

    get_stan() {
        return this.stan;
    }

    stop() {
        clearInterval(this.czekaj);
    }

    updateTabs(pionki) {
        console.log("u");
        clearInterval(this.porownywanie)
        $.ajax({
            url: "/",
            data: { action: "update", data: JSON.stringify(pionki) },
            type: "POST",
            success: (data) => {
                console.log(data);
                if (data = "ok") {
                    this.porownywanie = setInterval(() => { this.compareTabs() }, 1000);
                }
            },
            error: function (xhr, status, error) {
                console.log("error")
                this.updateTabs(game.get_pionki());
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
                var obj = JSON.parse(data)
                if (obj.zmiany == true) {
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




