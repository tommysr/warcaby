class Ui{
    constructor(){
        this.init();
    }

    init(){
        
        game.camera.position.set(0, 1000, 0)
        game.camera.lookAt(game.scene.position)

        $("#root").on("click", (event) => game.pick(event))
        $("#resetbutton").on("click", () => net.reset())
        $("#loginbutton").on("click", () => net.login())
    }
}