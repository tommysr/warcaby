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

        this.old_material;
        this.old_picked;
        this.picked;
        this.orginal_material;
        this.init();
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
        requestAnimationFrame(this.render.bind(this)); // funkcja bind(this) przekazuje obiekt this do metody render
        this.renderer.render(this.scene, this.camera);
        console.log("render leci")
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
        this.mouseVector.x = (event.clientX / $(window).width()) * 2 - 1;
        this.mouseVector.y = -(event.clientY / $(window).height()) * 2 + 1;
        this.raycaster.setFromCamera(this.mouseVector, this.camera);
        var intersects = this.raycaster.intersectObjects(this.scene.children);

        if (intersects.length > 0) {
            var element = intersects[0].object;

            if (element.geometry.type == "CylinderGeometry") {

                //console.log(element)
                if (element == this.picked) {
                    //console.log("ten sam")
                    element.material = this.origin_material;
                    this.picked = "";
                }

                else if (element.userData.player == net.get_stan()) {
                    this.picked = element;

                    if (this.old_picked) {
                        this.old_picked.material = this.origin_material;
                    }

                    this.origin_material = this.picked.material;
                    this.old_picked = this.picked;

                    this.picked.material = this.picked_material;
                }
            }

            if (this.picked) {
                //--------- WARUNKI NA PRZESUNIĘCIE
                var geometry = 0, pole = 0, czyste = 0, krok = 0;

                if (element.geometry.type == "BoxGeometry") geometry = 1;
                if (element.userData.color == "black") pole = 1;
                if (this.pionki[element.userData.x][element.userData.y] == 0) czyste = 1;

                if (net.get_stan() == "player1") {
                    if (element.userData.x - this.picked.userData.x == -1 && Math.abs(this.picked.userData.y - element.userData.y) == 1) krok = 1;
                    if (element.userData.x - this.picked.userData.x == -2 && Math.abs(this.picked.userData.y - element.userData.y) == 2) {
                        var zbijany = {};
                        zbijany.x = (element.userData.x + this.picked.userData.x) / 2;
                        zbijany.y = (element.userData.y + this.picked.userData.y) / 2;
                        if (this.pionki[zbijany.x][zbijany.y] == 2) {
                            this.pionki[zbijany.x][zbijany.y] = 0;
                            krok = 1;

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
                    if (element.userData.x - this.picked.userData.x == 1 && Math.abs(this.picked.userData.y - element.userData.y) == 1) krok = 1;
                    if (element.userData.x - this.picked.userData.x == 2 && Math.abs(this.picked.userData.y - element.userData.y) == 2) {
                        var zbijany = {};
                        zbijany.x = (element.userData.x + this.picked.userData.x) / 2;
                        zbijany.y = (element.userData.y + this.picked.userData.y) / 2;
                        if (this.pionki[zbijany.x][zbijany.y] == 1) {
                            this.pionki[zbijany.x][zbijany.y] = 0;
                            krok = 1;

                            for (let i = 0; i < this.scene.children.length; i++) {
                                if (this.scene.children[i].userData.player == "player1" && this.scene.children[i].userData.x == zbijany.x && this.scene.children[i].userData.y == zbijany.y) {
                                    zbijany.obj = this.scene.children[i];
                                    this.scene.remove(zbijany.obj);
                                }
                            }
                        }
                    }
                }


                if (geometry && pole && czyste && krok) {
                    this.pionki[this.picked.userData.x][this.picked.userData.y] = 0

                    if (net.get_stan() == "player1") {
                        this.pionki[element.userData.x][element.userData.y] = 1
                    }
                    else if (net.get_stan() == "player2") {
                        this.pionki[element.userData.x][element.userData.y] = 2
                    }

                    this.picked.userData.x = element.userData.x;
                    this.picked.userData.y = element.userData.y;

                    this.picked.position.x = element.position.x;
                    this.picked.position.z = element.position.z;
                    this.picked.position.y = 35;

                    this.picked.material = this.origin_material;
                    this.picked = "";

                    net.updateTabs(this.pionki)
                }
            }
        }
    }

    dajPionki(){
        for (let i = 0; i < this.szach.length; i++) {
            for (let j = 0; j < this.szach[i].length; j++) {
                if (this.pionki[i][j] == 1) {
                    var pion = new Pionek ("red");
                    pion.userData = { player: "player1", x: i, y: j }
                    this.scene.add(pion);
                    pion.position.set(i * 100 - 350, 35, j * 100 - 350)
                }
                else if (this.pionki[i][j] == 2) {
                    var pion = new Pionek ("green");
                    pion.userData = { player: "player2", x: i, y: j }
                    this.scene.add(pion);
                    pion.position.set(i * 100 - 350, 35, j * 100 - 350)
                }
            }
        }
    }

    get_pionki(){
        return this.pionki;
    }


    set_pionki(new_pionki){
        this.pionki = new_pionki;
    }

    refresh(){
    var c = 0;
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