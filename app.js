import * as THREE from "https://unpkg.com/three@0.126.1/build/three.module.js";

const scene = new THREE.Scene();

fetch('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson').then(res => res.json()).then(countries => {
    const Globe = new ThreeGlobe()
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
        .polygonsData(countries.features.filter(d => d.properties.ISO_A2 !== 'AQ'))
        .polygonCapColor(() => 'rgba(200, 0, 0, 0.7)')
        .polygonSideColor(() => 'rgba(0, 200, 0, 0.1)')
        .polygonStrokeColor(() => '#111');

    setTimeout(() => Globe.polygonAltitude(() => Math.random()), 4000);

    // Setup renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('globeViz').appendChild(renderer.domElement);

    // Setup scene
    const scene = new THREE.Scene();
    scene.add(Globe);
    scene.add(new THREE.AmbientLight(0xbbbbbb));
    scene.add(new THREE.DirectionalLight(0xffffff, 0.6));

    // Setup camera
    const camera = new THREE.PerspectiveCamera();
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    camera.position.z = 500;

    // Add camera controls
    const tbControls = new THREE.TrackballControls(camera, renderer.domElement);
    tbControls.minDistance = 101;
    tbControls.rotateSpeed = 5;
    tbControls.zoomSpeed = 0.8;

    // Kick-off renderer
    (function animate() { // IIFE
        // Frame cycle
        tbControls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    })();
});