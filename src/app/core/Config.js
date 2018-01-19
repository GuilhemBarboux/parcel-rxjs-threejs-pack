import {fromJS} from 'immutable'
import {WebGLRenderer, Scene, PerspectiveCamera} from 'three'

// THREE
const scene = new Scene()
const camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new WebGLRenderer({antialias: true})
const composer = undefined
const passes = []

// Config
renderer.setClearColor(0x6A5D93)
renderer.setSize(window.innerWidth, window.innerHeight)

// DOM
const container = document.getElementById('scene')
container.appendChild(renderer.domElement)

// Export
export default fromJS({
  scene,
  camera,
  renderer,
  composer,
  passes
})
