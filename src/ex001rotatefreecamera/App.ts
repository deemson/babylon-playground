import * as BABYLON from '@babylonjs/core/Legacy/legacy'

export class App {
  engine: BABYLON.Engine
  scene: BABYLON.Scene

  constructor (readonly canvas: HTMLCanvasElement) {
    this.engine = new BABYLON.Engine(canvas)
    window.addEventListener('resize', () => {
      this.engine.resize()
    })
    const scene = new BABYLON.Scene(this.engine)
    const r = 10
    let a = 3 * Math.PI / 2
    const camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 0, 0), scene)
    camera.position.x = Math.cos(a) * r
    camera.position.y = 5
    camera.position.z = Math.sin(a) * r
    camera.target = BABYLON.Vector3.Zero()
    const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, -5), scene)
    light.intensity = 0.7
    const sphere = BABYLON.MeshBuilder.CreateSphere('sphere', { diameter: 2, segments: 32 }, scene)
    sphere.position.y = 1
    BABYLON.MeshBuilder.CreateGround('ground', { width: 6, height: 6 }, scene)

    let isLeft = false
    let isRight = false
    scene.onKeyboardObservable.add((eventData: BABYLON.KeyboardInfo, eventState: BABYLON.EventState) => {
      switch (eventData.type) {
        case BABYLON.KeyboardEventTypes.KEYDOWN:
          switch (eventData.event.key) {
            case 'ArrowLeft':
              isLeft = true
              break
            case 'ArrowRight':
              isRight = true
              break
          }
          break
        case BABYLON.KeyboardEventTypes.KEYUP:
          switch (eventData.event.key) {
            case 'ArrowLeft':
              isLeft = false
              break
            case 'ArrowRight':
              isRight = false
              break
          }
      }
    })
    scene.registerBeforeRender(() => {
      if (isLeft ^ isRight) {
        if (isLeft) {
          a -= (2 / 180 * Math.PI)
        }
        if (isRight) {
          a += (2 / 180 * Math.PI)
        }
      }
      if (a > 2 * Math.PI) {
        a -= 2 * Math.PI
      } else if (a < 0) {
        a += 2 * Math.PI
      }
      camera.position.x = Math.cos(a) * r
      camera.position.z = Math.sin(a) * r
      camera.target = BABYLON.Vector3.Zero()
    })

    this.scene = scene
  }

  run () {
    this.engine.runRenderLoop(() => {
      this.scene.render()
    })
  }
}