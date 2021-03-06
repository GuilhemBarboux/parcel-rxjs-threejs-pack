import Core, {Config, Loop} from './core'
import {BoxGeometry, Mesh, MeshLambertMaterial, PointLight} from 'three'

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
    const mesh = new Mesh(
      new BoxGeometry(10, 10, 10),
      new MeshLambertMaterial({color: 0xF0D1E0})
    )

    // Update camera position
    camera.position.z = 100

    // Update light
    frontLight.position.z = 20
    frontLight.position.y = 20
    backLight.position.z = -20
    backLight.position.y = -20

    // Add
    scene.add(
      mesh,
      frontLight,
      backLight
    )

    // Update
    this.unsuscribers.push(Loop.subscribe(state => {
      mesh.rotation.x -= 0.02
      mesh.rotation.y += 0.02
    }))
  }
}
