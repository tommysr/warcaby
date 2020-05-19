class Ui{
    constructor(){
        this.init();
    }

    init(){
        game.changeCameraAngle("side");
        $("#root").on("click", (event) => game.choose(event));
        $("#reset").on("click", () => net.reset());
        $("#loginin").on("click", () => net.login());
    }

    firstPlayerUi(data, login){
        $(".state").css("display", "block");
        $(".state").html(`<h1>${data}: ${login}</h1><p>connected to game - WHITE</p>`);
        $("#login").css("display", "none");
        $(".lds-spinner").css("display", "inline-block");
        $(".waiting").click(function(event){
            event.stopImmediatePropagation();
        });
    }

    secondPlayerJoined(data){
        $(".state").html(
            `${$(".state").html()}${data} joined to game - BLACK`
          );
          $(".lds-spinner").css("display", "none");
          $(".waiting").css("display", "none");
    }

    secondPlayerUi(data, login){
        $(".state").css("display", "block");
        $(".state").html(`<h1>${data}: ${login}</h1><p>connected to game - BLACK</p>`);
        $("#login").css("display", "none");
        $(".waiting").css("display", "none");
    }

    showInfo(data){
        $(".state").css("display", "block");
        $(".state").html(`<h1>${data}</h1>`)
    }

    showBlockScreen(){
        $(".waiting").css("display", "flex");
        $(".waiting").click(function (event) {
          event.stopImmediatePropagation();
        });
    }

    updateCounter(count){
        $(".waiting").html(`<h1>${count}</h1>`);
    }

    hideBlockScreen(){
        $(".waiting").css("display", "none");
    }
}
