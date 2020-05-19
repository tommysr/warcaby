class Game{
    constructor(){
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 45,
            window.innerWidth / window.innerHeight,
            0.1,
            10000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor(0x0066ff);
        this.raycaster = new THREE.Raycaster();
        this.mouseVector = new THREE.Vector2()
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        $("#root").append(this.renderer.domElement);
        this.render() 

        this.szach =  [
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
        ];
        this.pionki = [
            [0, 2, 0, 2, 0, 2, 0, 2],
            [2, 0, 2, 0, 2, 0, 2, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
        ];

        this.picked_material = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            color: 0xffff00,
            transparent: true,
            opacity: 1,
        })

        this.old_material
        this.old_picked
        this.picked
        this.orginal_material
        this.init()
    }

    init(){
        window.onresize = () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
        
        var box = new THREE.BoxGeometry(100, 25, 100);

        var material0 = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load('gfx/black.jpg'),
            transparent: true,
            opacity: 1,
        })

        var material1 = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load('/gfx/white.jpg'),
            transparent: true,
            opacity: 1,
        })

        for (let i = 0; i < this.szach.length; i++) {
            for (let j = 0; j < this.szach[i].length; j++) {
                console.log(j);
                if (this.szach[i][j] == 0) {
                    var cube = new THREE.Mesh(box, material0);
                    cube.userData = { color: "black", x: i, y: j }
                }
                else if (this.szach[i][j] == 1) {
                    var cube = new THREE.Mesh(box, material1);
                    cube.userData = { color: "white", x: i, y: j }
                }
                this.scene.add(cube);
                cube.position.set(i * 100 - 350, 12.5, j * 100 - 350)
            }
        }

    }

    render(){
        requestAnimationFrame(this.render.bind(this));
        this.renderer.render(this.scene, this.camera);
    };

    setPoz(val) {
        let poz = val;
        switch (poz) {
            case "front":
                this.camera.position.set(780, 400, 0)
                this.camera.lookAt(this.scene.position)
                break;
            case "back":
                this.camera.position.set(-780, 400, 0)
                this.camera.lookAt(this.scene.position)
                break;
            case "top":
                this.camera.position.set(0, 1000, 0)
                this.camera.lookAt(this.scene.position)
                break;
            case "side":
                this.camera.position.set(0, 300, 1000)
                this.camera.lookAt(this.scene.position)
                break;
        }
    }


    pick(event) {
        this.mouseVector.x = (event.clientX / $(window).width()) * 2 - 1
        this.mouseVector.y = -(event.clientY / $(window).height()) * 2 + 1
        this.raycaster.setFromCamera(this.mouseVector, this.camera)
        var intersects = this.raycaster.intersectObjects(this.scene.children)

        if(intersects.length>0) {
            var el = intersects[0].object

            if (el.geometry.type == "CylinderGeometry") {

                if (el == this.picked) {
                    el.material = this.origin_material
                    this.putDown()
                }
                else if (el.userData.player == net.get_stan()) {
                    this.picked = el

                    if (this.old_picked) {
                        this.old_picked.material = this.origin_material
                    }

                    this.origin_material = this.picked.material
                    this.old_picked = this.picked

                    this.picked.material = this.picked_material
                }
            }

            if (this.picked) 
                this.pickUp(el, intersects)
        }
    }


    isBox(el){
        return el.geometry.type == "BoxGeometry"
    }

    isBlack(el){
        return el.userData.color == "black"
    }

    isEmpty(el){
        return this.pionki[el.userData.x][el.userData.y] == 0
    }

    isIt(el){
        let krok = false
        if (net.get_stan() == "player1") {
            if (el.userData.x - this.picked.userData.x == -1 && Math.abs(this.picked.userData.y - el.userData.y) == 1) krok = true
            if (el.userData.x - this.picked.userData.x == -2 && Math.abs(this.picked.userData.y - el.userData.y) == 2) {
                var zbijany = {}
                zbijany.x = parseInt((el.userData.x + this.picked.userData.x) / 2)
                zbijany.y = parseInt((el.userData.y + this.picked.userData.y) / 2)

                console.log(zbijany.x, zbijany.y)

                if (this.pionki[zbijany.x][zbijany.y] == 2) {
                    this.pionki[zbijany.x][zbijany.y] = 0
                    krok = true

                    for (let i = 0; i < this.scene.children.length; i++) {
                        if (this.scene.children[i].userData.player == "player2" && this.scene.children[i].userData.x == zbijany.x && this.scene.children[i].userData.y == zbijany.y) {
                            zbijany.obj = this.scene.children[i];
                            this.scene.remove(zbijany.obj);
                        }
                    }
                }
            }
            
        }
        else {
            if (el.userData.x - this.picked.userData.x == 1 && Math.abs(this.picked.userData.y - el.userData.y) == 1) krok = true;
            if (el.userData.x - this.picked.userData.x == 2 && Math.abs(this.picked.userData.y - el.userData.y) == 2) {
                var zbijany = {};
                zbijany.x = parseInt((el.userData.x + this.picked.userData.x) / 2)
                zbijany.y = parseInt((el.userData.y + this.picked.userData.y) / 2)

                console.log(zbijany)

                if (this.pionki[zbijany.x][zbijany.y] == 1) {
                    this.pionki[zbijany.x][zbijany.y] = 0;
                    krok = true;

                    for (let i = 0; i < this.scene.children.length; i++) {
                        if (this.scene.children[i].userData.player == "player1" && this.scene.children[i].userData.x == zbijany.x && this.scene.children[i].userData.y == zbijany.y) {
                            zbijany.obj = this.scene.children[i];
                            this.scene.remove(zbijany.obj);
                        }
                    }
                }
            }
        }

        return krok
    }



    pickUp(el){


        if (this.isBox(el) && this.isBlack(el) && this.isEmpty(el) && this.isIt(el)) {
            this.pionki[this.picked.userData.x][this.picked.userData.y] = 0

            if (net.get_stan())
                this.pionki[el.userData.x][el.userData.y] = net.get_stan() == 'player1' ? 1 : 2
            

            this.picked.userData.x = el.userData.x;
            this.picked.userData.y = el.userData.y;

            this.picked.position.x = el.position.x;
            this.picked.position.z = el.position.z;
            this.picked.position.y = 35;

            this.picked.material = this.origin_material;
            this.putDown()

            net.updateTabs(this.pionki)
        }
        
        
    }


    putDown(){
        this.picked = null
    }


    dajPionki(){
        for (let i in this.szach.length)
            for (let j in this.szach[0].length) {
                let pion = null

                if (this.pionki[i][j] == 1) {
                    pion = new Pionek ("red");
                    pion.userData = { player: "player1", x: i, y: j }
                }
                else if (this.pionki[i][j] == 2) {
                    pion = new Pionek ("green");
                    pion.userData = { player: "player2", x: i, y: j };
                }

                if(pion){
                    this.scene.add(pion);
                    pion.position.set(i * 100 - 350, 35, j * 100 - 350)
                }
            }
    }

    get_pionki(){
        return this.pionki
    }

    set_pionki(pionki){
        this.pionki = pionki
    }

    refresh(){
        let c = 0;
        while (this.scene.children[c]) {
            if (this.scene.children[c].geometry.type == "CylinderGeometry") {
                this.scene.remove(this.scene.children[c])
            }
            else {
                c++;
            }
        }
        this.dajPionki();
    }
}