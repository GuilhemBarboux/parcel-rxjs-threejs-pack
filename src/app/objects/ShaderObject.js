import * as THREE from 'three'
import GlslifyMaterial from '../materials/GlslifyMaterial'

export default class ShaderObject extends THREE.Mesh {
  constructor (materialConfig) {
    const geometry = new THREE.PlaneGeometry(50, 50, 1)
    const material = new GlslifyMaterial(materialConfig)

    super(geometry, material)
  }
}
