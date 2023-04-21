var scene;
var camera;
var renderer;
var params = {
    color: 0x00ff00
}
function CreateEnvior() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0.9, 0.9, 0.9)
    var gui = new dat.GUI()
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 5000);
    camera.position.x = 200;
    camera.position.y = 200;
    camera.position.z = 200;
    camera.lookAt(new THREE.Vector3(0, 0, 0))
    renderer = new THREE.WebGL1Renderer({ antialias: true, powerPerformance: 'high-performance', physicallyCorrectLights: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.getElementById("webgl").appendChild(renderer.domElement);
    document.getElementById("webgl").addEventListener("mousedown", onDocumentMouseDown, false);

    var controls = new THREE.OrbitControls(camera, renderer.domElement)
    controls.update()
    addBox("wall", 30, 200, 500, -240, 100, 0, new THREE.Color(1,1,1))

    addBoxWithTexture("solYan", 30, 120, 3, 0, 60, 38.5, "woodlight")
    addBoxWithTexture("sagYan", 30, 120, 3, 0, 60, -38.5, "woodlight")
    addBoxWithTexture("ust", 30, 3, 74, 0, 118.5, 0, "woodlight")
    addBoxWithTexture("alt", 30, 3, 74, 0, 1.5, 0, "woodlight")
    addBoxWithTexture("raf1", 30, 3, 74, 0, 30, 0, "woodmid")
    addBoxWithTexture("raf2", 30, 3, 74, 0, 60, 0, "woodmid")
    addBoxWithTexture("raf3", 30, 3, 74, 0, 90, 0, "woodmid")
    // addBoxWithTexture("box1", 1, 1, 1, -1, 0.5, 0, "tas");
    // addBoxWithTexture("box2", 1, 1, 1, 1, 0.5, 0, "tas");
    addBoxWithTexture("floor", 500, 10, 500, 0, -5, 0, "floor");
    addSpotLight("light1", 5, new THREE.Color(1, 1, 1), new THREE.Vector3(500, 500, 500));

    addSphere('option1', 10, 128, 128, -25, -37, -155, 'woodlight')
    addSphere('option2', 10, 128, 128, 0, -37, -155, 'woodmid')
    addSphere('option3', 10, 128, 128, 25, -37, -155, 'wooddark')

    var ambientLight = new THREE.AmbientLight(0xaaaaaa, 1)
    scene.add(ambientLight);
    scene.add(camera);
    // var helper = new THREE.CameraHelper(scene.getObjectByName("light1").shadow.camera)
    // scene.add(helper)
    // gui.add(scene.getObjectByName("light1"), 'distance', 0, 100);
    // gui.add(scene.getObjectByName("light1"), 'penumbra', 0, 1);
    // gui.add(scene.getObjectByName("light1"), 'decay', 0, 1);
    // gui.add(scene.getObjectByName("wall").position, 'x', -300,30);
    // gui.add(scene.getObjectByName("wall").position, 'y', 0, 100);
    // gui.add(scene.getObjectByName("wall").position, 'z', 0, 100);
    gui.addColor(params, 'color').onChange(function () {
        scene.getObjectByName("wall").material.color.set(params.color)
    });
    render();
}
function onDocumentMouseDown(event) {
    if (event.button == 0) {
        // alert("raf rengi değişti")
        var mouse = new THREE.Vector2();
        mouse.x = (event.layerX / $('#webgl').width()) * 2 - 1;
        mouse.y = -(event.layerX / $('#webgl').height()) * 2 + 1;
        var raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        var intersects1 = raycaster.intersectObjects(camera.children, false)
        if (intersects1 > 0) {
            scene.getObjectByName("raf1").material = intersects1[0].object.material;
            scene.getObjectByName("raf2").material = intersects1[0].object.material;
            scene.getObjectByName("raf3").material = intersects1[0].object.material;
        }
    }
}
function render() {
    renderer.render(scene, camera);
    scene.getObjectByName("option1").rotation.y -= 0.04
    scene.getObjectByName("option2").rotation.y -= 0.04
    scene.getObjectByName("option3").rotation.y -= 0.04
    requestAnimationFrame(function () {
        render();
    });
};
function addBox(name, w, h, d, x, y, z, color) {

    var geometry = new THREE.BoxGeometry(w, h, d)
    var metarial = new THREE.MeshStandardMaterial({ color: color });
    var mesh = new THREE.Mesh(geometry, metarial)
    mesh.name = name;
    mesh.position.x = x;
    mesh.position.y = y;
    mesh.position.z = z;
    mesh.castShadow = true
    mesh.receiveShadow = true

    scene.add(mesh);
}

function addSphere(name, r, ws, hs, x, y, z, texture) {

    var geometry = new THREE.SphereGeometry(r, ws, hs)
    var loader = new THREE.TextureLoader();
    var metarial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    metarial.map = loader.load("assets/textures/" + texture + ".jpg")
    metarial.normalMap = loader.load("assets/textures/" + texture + ".jpg")
    metarial.roughnessMap = loader.load("assets/textures/" + texture + ".jpg")
    // metarial.aoMap = loader.load("assets/textures/" + texture + ".jpg")
    metarial.displacementMap = loader.load("assets/textures/" + texture + ".jpg")
    metarial.displacementScale = 0;
    metarial.displacementBias = 0;
    var mesh = new THREE.Mesh(geometry, metarial)
    mesh.name = name;
    mesh.position.x = x;
    mesh.position.y = y;
    mesh.position.z = z;
    mesh.castShadow = true
    mesh.receiveShadow = true

    camera.add(mesh);
}

function addBoxWithTexture(name, w, h, d, x, y, z, texture) {
    var geometry = new THREE.BoxGeometry(w, h, d, 100, 100, 100)
    var metarial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    var loader = new THREE.TextureLoader();
    metarial.map = loader.load("assets/textures/" + texture + ".jpg")
    metarial.normalMap = loader.load("assets/textures/" + texture + ".jpg")
    metarial.roughnessMap = loader.load("assets/textures/" + texture + ".jpg")
    // metarial.aoMap = loader.load("assets/textures/" + texture + ".jpg")
    metarial.displacementMap = loader.load("assets/textures/" + texture + ".jpg")
    metarial.displacementScale = 0;
    metarial.displacementBias = 0;

    var mesh = new THREE.Mesh(geometry, metarial)
    mesh.name = name;
    mesh.position.x = x;
    mesh.position.y = y;
    mesh.position.z = z;
    mesh.castShadow = true
    mesh.receiveShadow = true

    scene.add(mesh);
}
function addSpotLight(name, intensity, color, pos) {
    var light = new THREE.SpotLight(color, intensity);
    light.name = name;
    light.position.x = pos.x;
    light.position.y = pos.y;
    light.position.z = pos.z;

    light.target.position.x = 0;
    light.target.position.y = 0;
    light.target.position.z = 0;
    light.target.updateMatrixWorld();
    light.custShadow = true;
    light.distance = 2000;
    light.penumbra = 0.7;
    light.decay = 1;

    light.updateMatrixWorld();
    light.shadow.mapSize.width = 4096;
    light.shadow.mapSize.height = 4096;
    light.shadow.camera.near = 2;
    light.shadow.camera.far = 100;
    light.shadow.camera.fov = 50;
    scene.add(light)
}
CreateEnvior();