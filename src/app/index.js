import Core, {Config, Loop} from './core'
import ShaderObject from './objects/ShaderObject'
// import vertexShader from './shaders/vert.glsl'
import fragmentShader from './shaders/frag.glsl'
import {BoxGeometry, Mesh, MeshBasicMaterial, PointLight, Vector2} from 'three'
import imageSrc from '../assets/images/1.jpg'
import imageSrc2 from '../assets/images/2.jpg'
import ImageFragment from './objects/ImageFragment'

const STEP = 1.2

export default class App extends Core {
  constructor () {
    super()

    if (module.hot) {
      module.hot.dispose(() => this.hmr())
    }

    const scene = Config.get('scene')
    const camera = Config.get('camera')
    const renderer = Config.get('renderer')
    const frontLight = new PointLight(0xFFFFFF, 1)
    const backLight = new PointLight(0xFFFFFF, 0.5)
    const cube = new Mesh(
      new BoxGeometry(10, 10, 10),
      new MeshBasicMaterial({color: 0xF0D1E0})
    )
    const imageFragment = new ImageFragment(imageSrc)
    const imageFragment2 = new ImageFragment(imageSrc2)
    const imageFragment3 = new ImageFragment(imageSrc)

    const background = new ShaderObject({
      uniforms: {
        u_resolution: {
          value: new Vector2(window.innerWidth, window.innerHeight)
        }
      },
      // vertexShader,
      fragmentShader
    })

    imageFragment.position.z = -1000
    imageFragment2.position.z = -1500
    imageFragment3.position.z = -2000

    renderer.setClearColor(0xffffff)

    // Update camera position
    camera.position.z = 0
    background.position.z = -10

    // Update light
    frontLight.position.z = 20
    frontLight.position.y = 20
    backLight.position.z = -20
    backLight.position.y = -20

    // Add
    scene.add(
      // background,
      // cube,
      imageFragment,
      imageFragment2,
      imageFragment3,
      frontLight,
      backLight
    )

    // Update
    this.unsuscribers.push(Loop.subscribe(state => {
      imageFragment.position.z += STEP
      imageFragment2.position.z += STEP
      imageFragment3.position.z += STEP
      if (imageFragment.position.z > -1000) imageFragment.update()
      if (imageFragment2.position.z > -1000) imageFragment2.update()
      if (imageFragment3.position.z > -1000) imageFragment3.update()
    }))
  }
}
