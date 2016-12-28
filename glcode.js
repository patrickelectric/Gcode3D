Qt.include("three.js")
var camera, scene, renderer;
var cube;
var mesh;

function initializeGL(canvas) {
    camera = new THREE.PerspectiveCamera(27, canvas.innerWidth/canvas.innerHeight, 1, 4000);
    camera.position.z = 2800;
    scene = new THREE.Scene();
    renderer = new THREE.Canvas3DRenderer({canvas: canvas, antialias: true, devicePixelRatio: canvas.devicePixelRatio});
    renderer.setClearColor(0x707070);
    renderer.setSize(canvas.width, canvas.height);
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
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
        colors[ i * 3 ] = (segments-i)*255.0/segments;
        colors[ i * 3 + 1 ] = (segments-i)*255.0/segments;
        colors[ i * 3 + 2 ] = (segments-i)*255.0/segments;
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
    scene.rotation.x = -Math.PI/4;
    scene.rotation.z = time*0.5
    renderer.render(scene, camera);
}
