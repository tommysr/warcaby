class Pionek extends THREE.Mesh {

    constructor(kolor) {
        super();
        this.geometry = new THREE.CylinderGeometry(40, 40, 25, 32);
        this.createMaterial(kolor)
    } 

    createMaterial(kolor){
        this.material = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load(`/gfx/${kolor}.jpg`),
            transparent: true,
            opacity: 1,
        })
    }



}

