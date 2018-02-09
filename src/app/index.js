import Core, {Config, Loop} from './core'
import ShaderObject from './objects/ShaderObject'
// import vertexShader from './shaders/vert.glsl'
import fragmentShader from './shaders/frag.glsl'
import {BoxGeometry, Mesh, MeshLambertMaterial, PointLight, Vector2} from 'three'

export default class App extends Core {
  constructor () {
    super()

    if (module.hot) {
      module.hot.dispose(() => this.hmr())
    }

    const scene = Config.get('scene')
    const camera = Config.get('camera')
    const frontLight = new PointLight(0xFFFFFF, 1)
    const backLight = new PointLight(0xFFFFFF, 0.5)
    const cube = new Mesh(
      new BoxGeometry(10, 10, 10),
      new MeshLambertMaterial({color: 0xF0D1E0})
    )
    const background = new ShaderObject({
      uniforms: {
        u_resolution: {
          value: new Vector2(window.innerWidth, window.innerHeight)
        }
      },
      // vertexShader,
      fragmentShader
    })

    // Update camera position
    camera.position.z = 100
    background.position.z = -10

    // Update light
    frontLight.position.z = 20
    frontLight.position.y = 20
    backLight.position.z = -20
    backLight.position.y = -20

    // Add
    scene.add(
      background,
      cube,
      frontLight,
      backLight
    )

    // Update
    this.unsuscribers.push(Loop.subscribe(state => {
      cube.rotation.x -= 0.02
      cube.rotation.y += 0.02
    }))
  }
}
