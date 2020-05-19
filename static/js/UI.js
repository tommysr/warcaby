class Ui{
    constructor(){
        this.init();
    }

    init(){
        game.changeCameraAngle("side");
        $("#root").on("click", (event) => game.pick(event));
        $("#resetbutton").on("click", () => net.reset());
        $("#loginbutton").on("click", () => net.login());
    }

    firstPlayerUi(data, login){
        $(".status").css("display", "block");
        $(".status").html(`<h1>${data}: ${login}</h1><p>connected to game (white pawns)</p>`);
        $("#logindiv").css("display", "none");
        $(".lds-grid").css("display", "inline-block");
        $(".backgroundToMenu").click(function(event){
            event.stopImmediatePropagation();
        });
    }

    secondPlayerJoined(data){
        $(".status").html(
            `${$(".status").html()}${data} joined to game (black pawns)`
          );
          $(".lds-grid").css("display", "none");
          $(".backgroundToMenu").css("display", "none");
    }

    secondPlayerUi(data, login){
        $(".status").css("display", "block");
        $(".status").html(`<h1>${data}: ${login}</h1><p>connect to game (black pawns)</p>`);
        $("#logindiv").css("display", "none");
        $(".backgroundToMenu").css("display", "none");
    }

    showInfo(data){
        $(".status").css("display", "block");
        $(".status").html(`<h1>${data}</h1>`)
    }

    showBlockScreen(){
        $(".backgroundToMenu").css("display", "block");
        $(".backgroundToMenu").click(function (event) {
          event.stopImmediatePropagation();
        });
    }

    updateCounter(count){
        $(".backgroundToMenu").html(`<h1>${count}</h1>`);
    }

    hideBlockScreen(){
        $(".backgroundToMenu").css("display", "none");
    }
}
