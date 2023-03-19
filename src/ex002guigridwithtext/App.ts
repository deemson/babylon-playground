import { AdvancedDynamicTexture, Grid, TextBlock } from '@babylonjs/gui'
import { Engine, FreeCamera, HemisphericLight, MeshBuilder, Scene, Vector3 } from '@babylonjs/core'

export class App {
  engine: Engine
  scene: Scene

  constructor (readonly canvas: HTMLCanvasElement) {
    this.engine = new Engine(canvas)
    window.addEventListener('resize', () => {
      this.engine.resize()
    })
    const scene = new Scene(this.engine)
    const camera = new FreeCamera('camera1', new Vector3(0, 5, -10), scene)
    camera.target = new Vector3(0, 0, 0)
    const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene)
    light.intensity = 0.7
    const sphere = MeshBuilder.CreateSphere('sphere', { diameter: 2, segments: 32 }, scene)
    sphere.position.y = 1
    MeshBuilder.CreateGround('ground', { width: 6, height: 6 }, scene)

    const guiTexture = AdvancedDynamicTexture.CreateFullscreenUI('GUI')

    const colors = [
      '#00b2ff',
      '#8cff00',
      '#bf00ff',
      '#d5360d',
    ]
    const texts = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']

    const grid = new Grid()
    grid.addColumnDefinition(1 / 3)
    grid.addColumnDefinition(1 / 3)
    grid.addColumnDefinition(1 / 3)
    grid.addRowDefinition(1 / 3)
    grid.addRowDefinition(1 / 3)
    grid.addRowDefinition(1 / 3)
    const indexes = [0, 1, 2]
    indexes.forEach(yIndex => {
      indexes.forEach(xIndex => {
        const textBlock = new TextBlock()
        textBlock.text = texts[yIndex * 3 + xIndex]
        textBlock.color = colors[(yIndex * 3 + xIndex) % colors.length]
        grid.addControl(textBlock, yIndex, xIndex)
      })
    })

    guiTexture.addControl(grid)

    this.scene = scene
  }

  run () {
    this.engine.runRenderLoop(() => {
      this.scene.render()
    })
  }
}