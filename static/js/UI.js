/*
    UI - obsługa interfejsu użytkownika
*/
class Ui{
    constructor(){
        this.init();
    }

    init(){
        game.setPoz("side");

        $("#select").on("change", function () {
            game.setPoz($("#select").val());
        });
    
        $("#root").on("click", function (event) {
            game.pick(event)
        })

        $("#resetbutton").on("click", () => net.reset());

        $("#loginbutton").on("click", () => net.login());
    
    }
}
