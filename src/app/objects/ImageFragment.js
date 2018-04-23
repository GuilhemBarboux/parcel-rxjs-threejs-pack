import {BoxGeometry, Mesh, MeshBasicMaterial, Object3D, RepeatWrapping, LinearFilter, TextureLoader, Vector3} from 'three'
import {Image as ImageJs} from 'image-js'
import {hierarchy, treemap} from 'd3'

const LIMIT = 20
const SIZE = 512
const DELTA = 0.0015

export default class ImageFragment extends Object3D {
  constructor (src) {
    super()
    this.texture = undefined
    this.data = []
    this.transition = 1.0
    this.load(src)
  }
  load (src) {
    ImageJs.load(src)
      .then((image) => {
        const grey = image.crop({
          x: 0,
          y: 0,
          width: SIZE,
          height: SIZE
        })

        const histogram = grey.getHistogram({
          channel: 0,
          maxSlots: 32,
          useAlpha: false
        })

        const map = treemap()
          .size([SIZE / 4, SIZE / 4])

        this.data = hierarchy({
          name: 'root',
          children: histogram.map((value, name) => ({
            name: name * 4,
            value
          }))
        })
          .sum(d => d.value)

        map(this.data)

        this.texture = new TextureLoader().load(grey.toDataURL(), () => {
          this.texture.wrapS = RepeatWrapping
          this.texture.wrapT = RepeatWrapping
          this.texture.minFilter = LinearFilter
          this.fragment()
        })
      })
  }
  fragment () {
    if (this.data && this.texture) {
      this.clear()

      this.data.each((d) => {
        if (d.data.name !== 'root') {
          const square = new Mesh(
            new BoxGeometry(d.x1 - d.x0, d.y1 - d.y0, 0),
            new MeshBasicMaterial({
              map: this.texture.clone()
            })
          )

          square.material.map.repeat.set((d.x1 - d.x0) / this.data.x1, (d.y1 - d.y0) / this.data.y1)
          square.material.map.offset.set(d.x0 / this.data.x1, d.y0 / this.data.y1)
          // square.material.map.rotation = Math.random() * Math.PI * 2
          square.material.map.needsUpdate = true

          square.position.set(
            (0.5 - Math.random()) * 400,
            (0.5 - Math.random()) * 400,
            -Math.random() * 400
          )

          if (square.position.x <= LIMIT && square.position.x >= -LIMIT) {
            square.position.x = square.position.x > 0 ? LIMIT : -LIMIT
          }

          if (square.position.y <= LIMIT && square.position.y >= -LIMIT) {
            square.position.y = square.position.y > 0 ? LIMIT : -LIMIT
          }

          square.startPosition = new Vector3(
            (d.x0 + (d.x1 - d.x0) / 2) - this.data.x1 / 2,
            (d.y0 + (d.y1 - d.y0) / 2) - this.data.y1 / 2,
            0
          )

          square.transition = square.position.clone().add(
            square.startPosition.clone().negate()
          )

          this.add(square)
        }
      })
    }
  }
  update (step) {
    if (this.transition > -1) this.transition -= DELTA

    this.children.forEach((c) => {
      const v = c.transition.clone().multiplyScalar(this.transition)
      c.position.copy(v.add(c.startPosition))
    })
  }
  clear () {
    while (this.children.length) {
      this.children.remove(this.children[0])
    }
  }
}
