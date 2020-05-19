class Game{
    constructor(){
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera( 45,
            window.innerWidth / window.innerHeight,
            0.1,
            10000)
        this.renderer = new THREE.WebGLRenderer()
        this.raycaster = new THREE.Raycaster()
        this.mouseVector = new THREE.Vector2()

        this.renderer.setClearColor(0x6d6875)
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        $("#root").append(this.renderer.domElement)
        this.render() 

        this.board =  []
        this.pawns = [
            [0, 2, 0, 2, 0, 2, 0, 2],
            [2, 0, 2, 0, 2, 0, 2, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
        ]

        this.sourceMaterial = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            color: 0x0c9ad9,
            transparent: true,
            opacity: 0.4,
        })

        this.choosenBefore
        this.choosenPawn
        this.materialOrigin

        for(let i = 0; i < 8; i++)
            if(i%2)
                this.board.push([0, 1, 0, 1, 0, 1, 0, 1])
            else
                this.board.push([1, 0, 1, 0, 1, 0, 1, 0])
        
      
        this.init()
    }


    getPawns(){
        return this.pawns
    }

    setPawns(pawns){
        this.pawns = pawns
    }

    clearChoosen(){
        this.choosenPawn = null
    }

    changeCameraAngle(side) {
        switch (side) {
            case "front":
                this.camera.position.set(800, 500, 0)
                this.camera.lookAt(this.scene.position)
                break
            case "back":
                this.camera.position.set(-800, 500, 0)
                this.camera.lookAt(this.scene.position)
                break
            case "side":
                this.camera.position.set(0, 600, 700)
                this.camera.lookAt(this.scene.position)
                break
        }
    }

    placePawns(){
        for (let i = 0; i < this.board.length; i++) 
            for (let j = 0; j < this.board[i].length; j++) {
                let pion = null
                if (this.pawns[i][j] == 1) {
                    pion = new Pionek ("whitep")
                    pion.userData = { player: "first player", x: i, y: j }
                }
                else if (this.pawns[i][j] == 2) {
                    pion = new Pionek ("blackp")
                    pion.userData = { player: "second player", x: i, y: j }
                }

                if(pion){
                    this.scene.add(pion)
                    pion.position.set(i * 100 - 350, 20, j * 100 - 350)
                }
            }
    }

    init(){
        window.onresize = () => {
            this.camera.aspect = window.innerWidth / window.innerHeight
            this.camera.updateProjectionMatrix()
            this.renderer.setSize(window.innerWidth, window.innerHeight)
        }
        
        var box = new THREE.BoxGeometry(100, 10, 100)
        var firstBoardMaterial = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load('gfx/black.png'),
            transparent: true,
            opacity: 1,
        })
        var secondBoardMaterial = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load('/gfx/white.png'),
            transparent: true,
            opacity: 1,
        })

        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[i].length; j++) {
                if (this.board[i][j] == 0) {
                    var cube = new THREE.Mesh(box, firstBoardMaterial)
                    cube.userData = { color: "black", x: i, y: j }
                }
                else if (this.board[i][j] == 1) {
                    var cube = new THREE.Mesh(box, secondBoardMaterial)
                    cube.userData = { color: "white", x: i, y: j }
                }
                this.scene.add(cube)
                cube.position.set(i * 100 - 350, 12.5, j * 100 - 350)
            }
        }
    }

    removePawn(x, y){
        for (let i = 0; i < this.scene.children.length; i++) 
            if (this.scene.children[i].userData.player == 'first player' || this.scene.children[i].userData.player == 'second player')
                if(this.scene.children[i].userData.x == x && this.scene.children[i].userData.y == y) 
                    this.scene.remove(this.scene.children[i])
    }

    isBoxGeometry(el){
        return el.geometry.type == "BoxGeometry"
    }

    isPlaceBlack(el){
        return el.userData.color == "black"
    }

    isPawnEmpty(el){
        return this.pawns[el.userData.x][el.userData.y] == 0
    }

    isPossibleToBeat(el){
        let krok = false
        if (net.getState() == 'first player') {
            if (el.userData.x - this.choosenPawn.userData.x == -1 && Math.abs(this.choosenPawn.userData.y - el.userData.y) == 1) 
                krok = true

            if (el.userData.x - this.choosenPawn.userData.x == -2 && Math.abs(this.choosenPawn.userData.y - el.userData.y) == 2) {
                var zbijany = {}
                zbijany.x = parseInt((el.userData.x + this.choosenPawn.userData.x) / 2)
                zbijany.y = parseInt((el.userData.y + this.choosenPawn.userData.y) / 2)

                if (this.pawns[zbijany.x][zbijany.y] == 2) {
                    this.pawns[zbijany.x][zbijany.y] = 0
                    krok = true
                    this.removePawn(zbijany.x, zbijany.y)
                }
            }
        }
        else {
            if (el.userData.x - this.choosenPawn.userData.x == 1 && Math.abs(this.choosenPawn.userData.y - el.userData.y) == 1) 
                krok = true

            if (el.userData.x - this.choosenPawn.userData.x == 2 && Math.abs(this.choosenPawn.userData.y - el.userData.y) == 2) {
                var zbijany = {}
                zbijany.x = (el.userData.x + this.choosenPawn.userData.x) / 2
                zbijany.y = (el.userData.y + this.choosenPawn.userData.y) / 2

                if (this.pawns[zbijany.x][zbijany.y] == 1) {
                    this.pawns[zbijany.x][zbijany.y] = 0
                    krok = true
                    this.removePawn(zbijany.x, zbijany.y)
                }
            }
        }

        return krok
    }

    checkChoosen(el){
        if (this.isBoxGeometry(el) && this.isPlaceBlack(el) && this.isPawnEmpty(el) && this.isPossibleToBeat(el)) {
            this.pawns[this.choosenPawn.userData.x][this.choosenPawn.userData.y] = 0

            if (net.getState())
                this.pawns[el.userData.x][el.userData.y] = net.getState() == 'first player' ? 1 : 2
            
            this.choosenPawn.userData.x = el.userData.x
            this.choosenPawn.userData.y = el.userData.y
            this.choosenPawn.position.x = el.position.x
            this.choosenPawn.position.z = el.position.z
            this.choosenPawn.position.y = 20
            this.choosenPawn.material = this.materialOrigin
            this.clearChoosen()
            net.updateTabs(this.pawns)
        }
    }


    choose(event) {
        this.mouseVector.x = (event.clientX / $(window).width()) * 2 - 1
        this.mouseVector.y = -(event.clientY / $(window).height()) * 2 + 1
        this.raycaster.setFromCamera(this.mouseVector, this.camera)
        var intersects = this.raycaster.intersectObjects(this.scene.children)

        if(intersects.length>0) {
            var el = intersects[0].object
            if (el.geometry.type == "CylinderGeometry") {
                if (el == this.choosenPawn) {
                    el.material = this.materialOrigin
                    this.clearChoosen()
                }
                else if (el.userData.player == net.getState()) {
                    this.choosenPawn = el
                    if (this.choosenBefore) {
                        this.choosenBefore.material = this.materialOrigin
                    }
                    this.materialOrigin = this.choosenPawn.material
                    this.choosenBefore = this.choosenPawn
                    this.choosenPawn.material = this.sourceMaterial
                }
            }
            if (this.choosenPawn) 
                this.checkChoosen(el, intersects)
        }
    }



    refresh(){
        for(let i = 0; i < this.scene.children.length && this.scene.children[i]; i++)
            if(this.scene.children[i].geometry.type == 'CylinderGeometry'){
                this.scene.remove(this.scene.children[i])
                i--
            }
        this.placePawns()
    }

    render(){
        requestAnimationFrame(this.render.bind(this))
        this.renderer.render(this.scene, this.camera)
    }
}