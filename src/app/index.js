import Core, {Config, Loop} from './core'
import ShaderObject from './objects/ShaderObject'
// import vertexShader from './shaders/vert.glsl'
import fragmentShader from './shaders/frag.glsl'
import {BoxGeometry, Mesh, MeshBasicMaterial, TextureLoader, PointLight, Vector2, RepeatWrapping} from 'three'
import imageSrc from '../assets/images/1.jpg'
import { Image as ImageJs } from 'image-js'
import { treemap, hierarchy } from 'd3'

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
      new MeshBasicMaterial({color: 0xF0D1E0})
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

    ImageJs.load(imageSrc)
      .then((image) => {
        const grey = image.grey()
        const histogram = grey.getHistogram({
          maxSlots: 16,
          useAlpha: false
        })

        const map = treemap()
          .size([grey.width / 2, grey.height / 2])
          .padding(2)
          .round(true)

        const root = hierarchy({
          name: 'root',
          children: histogram.map((value, name) => ({
            name: name * 4,
            value
          }))
        })
          .sum(d => d.value)
          .sort((a, b) => b.value - a.value)

        map(root)

        const texture = new TextureLoader().load(grey.toDataURL(), () => {
          texture.wrapS = RepeatWrapping
          texture.wrapT = RepeatWrapping

          root.each((d) => {
            if (d.data.name !== 'root') {
              const square = new Mesh(
                new BoxGeometry(d.x1 - d.x0, d.y1 - d.y0, 1),
                new MeshBasicMaterial({
                  map: texture.clone()
                })
              )

              square.material.map.repeat.set((d.x1 - d.x0) / root.x1, (d.y1 - d.y0) / root.y1)
              square.material.map.offset.set(d.x0 / root.x1, d.y0 / root.y1)
              square.material.map.rotation = Math.random() * Math.PI * 2
              square.material.map.needsUpdate = true

              square.position.x = ((d.x0 + (d.x1 - d.x0) / 2) - root.x1 / 2)
              square.position.y = ((d.y0 + (d.y1 - d.y0) / 2) - root.y1 / 2)

              // square.position.z = Math.random() * 80
              // square.rotation.x = Math.random() * Math.PI * 2

              scene.add(square)
            }
          })
        })
      })

    // Add
    scene.add(
      background,
      // cube,
      frontLight,
      backLight
    )

    // Update
    this.unsuscribers.push(Loop.subscribe(state => {}))
  }
}
