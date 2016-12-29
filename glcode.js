Qt.include("three.js")
Qt.include("controls.js")

var camera, scene, renderer;
var cube;
var mesh;
var controls;

function initializeGL(canvas) {
    camera = new THREE.PerspectiveCamera(27, canvas.innerWidth/canvas.innerHeight, 1, 11000);

    camera.position.x = 1500;
    camera.position.y = 1500;
    camera.position.z = 1500;
    scene = new THREE.Scene();
    renderer = new THREE.Canvas3DRenderer({canvas: canvas, antialias: true, devicePixelRatio: canvas.devicePixelRatio});
    renderer.setClearColor(0x707070);
    renderer.setSize(canvas.width, canvas.height);
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    scene.rotation.x = -Math.PI/2;

    controls = new THREE.OrbitControls( camera, canvas);

    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
}

function resizeGL(canvas) {
    camera.aspect = canvas.width/canvas.height;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(canvas.devicePixelRatio);
    renderer.setSize(canvas.width, canvas.height);

    var geometry = new THREE.BufferGeometry();
    var material = new THREE.LineBasicMaterial({vertexColors: THREE.VertexColors});

    // Grid
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(-500, 0, 0));
    geometry.vertices.push(new THREE.Vector3(500, 0, 0));

    var linesMaterial = new THREE.LineBasicMaterial(0x000000, 0.2);

    for ( var i = 0; i <= 20; i ++ ) {

        var line = new THREE.Line(geometry, linesMaterial);
        line.position.y = (i*50)-500;
        scene.add(line);

        var line = new THREE.Line(geometry, linesMaterial);
        line.position.x = (i*50)-500;
        line.rotation.z = 90*Math.PI/180;
        scene.add(line);
    }

    mesh = new THREE.Line(geometry, material);
}

function drawLine(pos) {
    var selectedObject = scene.getObjectByName("piece");
    scene.remove(selectedObject);

    var segments = pos.length;
    var geometry = new THREE.BufferGeometry();
    var material = new THREE.LineBasicMaterial({vertexColors: THREE.VertexColors});
    var positions = new Float32Array(segments*3);
    var colors = new Float32Array(segments*3);

    for ( var i = 0; i < segments; i ++ ) {
        var x = pos[i].x;
        var y = pos[i].y;
        var z = pos[i].z;
        positions[ i * 3 ] = x*5;
        positions[ i * 3 + 1 ] = y*5;
        positions[ i * 3 + 2 ] = z*5;
        colors[ i * 3 ] = (segments-i)/segments;
        colors[ i * 3 + 1 ] = colors[ i * 3 ];
        colors[ i * 3 + 2 ] = colors[ i * 3 ];
    }

    geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.computeBoundingSphere();
    geometry.applyMatrix(new THREE.Matrix4().makeTranslation(-500, -500, 0));
    mesh = new THREE.Line(geometry, material);
    mesh.name = "piece"
    scene.add(mesh);
}

var lastDate = 0;
function paintGL(canvas) {
    var time = Date.now()*0.001;
    // required if controls.enableDamping = true, or if controls.autoRotate = true
    controls.update();
    renderer.render(scene, camera);
}

function urlToFileName(url) {
    var splited = String(url).split('/');
    var file = splited[splited.length - 1];
    return file.split('.')[0];
}

function onMouseMove(mouse){
    controls.onMouseMove(mouse);
}

function onPressed(mouse){
    controls.onMouseDown(mouse);
}

function onReleased(mouse){
    controls.onMouseUp(mouse);
}

function onMouseWheel(mouse){
    controls.onMouseWheel(mouse);
}
