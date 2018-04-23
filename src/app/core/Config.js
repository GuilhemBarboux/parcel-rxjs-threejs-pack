import {fromJS} from 'immutable'
import {WebGLRenderer, Scene, PerspectiveCamera} from 'three'
import OrbitControls from 'three-orbitcontrols'

// Canvas
const canvas = document.getElementById('scene')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

// THREE
const scene = new Scene()
const camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 2000)
const renderer = new WebGLRenderer({canvas, antialias: true})
const composer = undefined
const controls = new OrbitControls(camera, renderer.domElement)
const passes = []

// Config
renderer.setClearColor(0x6A5D93)
renderer.setSize(window.innerWidth, window.innerHeight)

// Export
export default fromJS({
  scene,
  camera,
  renderer,
  composer,
  controls,
  passes
})
