class Pionek extends THREE.Mesh {
    constructor(color) {
        super();
        this.geometry = new THREE.CylinderGeometry(40, 40, 25, 32);
        this.createMaterial(color)
    } 

    createMaterial(color){
        this.material = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load(`/gfx/${color}.png`),
            transparent: true,
            opacity: 1,
        })
    }
}

