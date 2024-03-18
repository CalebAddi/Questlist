import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
let renderer;

// Geometry
const geometry = new THREE.IcosahedronGeometry(1.7, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xffff, wireframe: true });
const icosahedron = new THREE.Mesh(geometry, material);
scene.add(icosahedron);