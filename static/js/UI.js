class Ui{
    constructor(){
        this.init();
    }

    init(){
        game.setPoz("side");
        $("#select").on("change", () => game.setPoz($("#select").val()))
        $("#root").on("click", (event) => game.pick(event))
        $("#resetbutton").on("click", () => net.reset())
        $("#loginbutton").on("click", () => net.login())
    }
}