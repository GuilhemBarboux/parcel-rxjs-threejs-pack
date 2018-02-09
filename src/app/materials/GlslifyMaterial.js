import * as THREE from 'three'
const glsl = require('glslify')

export default class GlslifyObject extends THREE.ShaderMaterial {
  constructor (config = {}) {
    if (config.vertexShader) {
      config.vertexShader = glsl(config.vertexShader)
    }

    if (config.fragmentShader) {
      config.fragmentShader = glsl(config.fragmentShader)
    }

    super(config)
  }
}
