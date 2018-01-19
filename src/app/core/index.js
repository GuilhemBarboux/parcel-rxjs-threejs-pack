import Config from './Config'
import Loop from './Loop'
import Resize from './Resize'

class Core {
  constructor () {
    // Subscribe resize with debounce
    Resize.debounceTime(350).subscribe(this.resize)

    // Start render
    this.start()
  }
  render (state) {
    if (Config.get('composer')) {
      // TODO: add postprocessing
      /* const composer = Config.get('composer')
      const passes = Config.get('passes')

      composer.reset()

      for (let i = 0, l = passes.length; i < l - 1; i++) {
        composer.pass(passes[i])
      }

      composer.toScreen(passes[passes.length - 1]) */
    } else {
      const renderer = Config.get('renderer')
      const scene = Config.get('scene')
      const camera = Config.get('camera')

      renderer.render(scene, camera)
    }
  }
  resize (size = {}) {
    const renderer = Config.get('renderer')
    const composer = Config.get('composer')
    const camera = Config.get('camera')

    // Resize camera
    camera.aspect = size.get('w') / size.get('h')
    camera.updateProjectionMatrix()

    // Resize render
    renderer.setSize(size.get('w'), size.get('h'))
    if (composer) {
      composer.setSize(size.get('w'), size.get('h'))
    }
  }
  start () {
    Loop.subscribe(this.render)
  }
  stop () {
    Loop.unsubscribe(this.render)
  }
}

export default Core
export {
  Config,
  Loop
}
