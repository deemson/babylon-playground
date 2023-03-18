import { App } from './ex001rotatefreecamera/App'

window.addEventListener('DOMContentLoaded', () => {
  let canvas = document.getElementById('renderCanvas') as HTMLCanvasElement
  let app = new App(canvas)
  app.run()
})