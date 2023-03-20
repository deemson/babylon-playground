import {
  ArcRotateCamera,
  DeviceSourceEvent,
  DeviceSourceManager,
  DeviceType,
  Engine, GamepadManager,
  HemisphericLight,
  MeshBuilder, Nullable,
  Scene,
  Vector3,
  Gamepad
} from '@babylonjs/core'
import { DeviceSourceType } from '@babylonjs/core/DeviceInput/internalDeviceSourceManager'

interface KeyboardInputFlags {
  isUp: boolean
  isDown: boolean
  isLeft: boolean
  isRight: boolean
}

export class App {
  engine: Engine
  scene: Scene

  constructor (readonly canvas: HTMLCanvasElement) {
    this.engine = new Engine(canvas)
    window.addEventListener('resize', () => {
      this.engine.resize()
    })
    const scene = new Scene(this.engine)
    const camera = new ArcRotateCamera('camera1', 0, Math.PI / 3, 10, new Vector3(0, 0, 0), scene)
    const light = new HemisphericLight('light', new Vector3(0, 1, -5), scene)
    light.intensity = 0.7
    const cube = MeshBuilder.CreateBox('cube', {
      width: 2,
      height: 2,
      depth: 2
    })
    cube.position.y = 1
    MeshBuilder.CreateGround('ground', { width: 6, height: 6 }, scene)

    const inputState: {
      keyboard: { camera: KeyboardInputFlags, cube: KeyboardInputFlags }
    } = {
      keyboard: {
        camera: { isUp: false, isDown: false, isLeft: false, isRight: false },
        cube: { isUp: false, isDown: false, isLeft: false, isRight: false }
      }
    }

    const deviceSourceManager = new DeviceSourceManager(this.engine)
    deviceSourceManager.onDeviceConnectedObservable.add((deviceSourceType: DeviceSourceType) => {
      const deviceName = DeviceType[deviceSourceType.deviceType]
      console.log(`${deviceName} connected`)
      switch (deviceSourceType.deviceType) {
        case DeviceType.Keyboard:
          deviceSourceManager.getDeviceSource(DeviceType.Keyboard)?.onInputChangedObservable.add((kbEvent: DeviceSourceEvent<DeviceType.Keyboard>) => {
            const isPressed = kbEvent.type === 'keydown'
            switch (kbEvent.key) {
              case 'ArrowUp':
                inputState.keyboard.camera.isUp = isPressed
                break
              case 'ArrowDown':
                inputState.keyboard.camera.isDown = isPressed
                break
              case 'ArrowLeft':
                inputState.keyboard.camera.isLeft = isPressed
                break
              case 'ArrowRight':
                inputState.keyboard.camera.isRight = isPressed
                break
              case 'w':
              case 'W':
                inputState.keyboard.cube.isUp = isPressed
                break
              case 's':
              case 'S':
                inputState.keyboard.cube.isDown = isPressed
                break
              case 'a':
              case 'A':
                inputState.keyboard.cube.isLeft = isPressed
                break
              case 'd':
              case 'D':
                inputState.keyboard.cube.isRight = isPressed
                break
            }
          })
          break
      }
    })
    deviceSourceManager.onDeviceDisconnectedObservable.add((deviceSourceType: DeviceSourceType) => {
      const deviceName = DeviceType[deviceSourceType.deviceType]
      console.log(`${deviceName} disconnected`)
    })

    const gamepadManager = new GamepadManager()
    let gamepad: Nullable<Gamepad> = null
    gamepadManager.onGamepadConnectedObservable.add((gamepadEvent: Gamepad) => {
      console.log(`${gamepadEvent.id} ${gamepadEvent.index} connected`)
      gamepad = gamepadEvent
    })
    gamepadManager.onGamepadDisconnectedObservable.add((gamepad: Gamepad) => {
      console.log(`${gamepad.id} ${gamepad.index} disconnected`)
    })

    const alphaKeyboardStep = 2 / 180 * Math.PI
    const betaKeyboardStep = 2 / 180 * Math.PI
    const cubeKeyboardStep = 2 / 180 * Math.PI

    scene.registerBeforeRender(() => {
      if (inputState.keyboard.camera.isUp ^ inputState.keyboard.camera.isDown) {
        if (inputState.keyboard.camera.isUp) {
          camera.beta -= betaKeyboardStep
        }
        if (inputState.keyboard.camera.isDown) {
          camera.beta += betaKeyboardStep
        }
      }
      if (inputState.keyboard.camera.isLeft ^ inputState.keyboard.camera.isRight) {
        if (inputState.keyboard.camera.isLeft) {
          camera.alpha -= alphaKeyboardStep
        }
        if (inputState.keyboard.camera.isRight) {
          camera.alpha += alphaKeyboardStep
        }
      }
      if (inputState.keyboard.cube.isUp ^ inputState.keyboard.cube.isDown) {
        if (inputState.keyboard.cube.isUp) {
          cube.rotation.z -= cubeKeyboardStep
        }
        if (inputState.keyboard.cube.isDown) {
          cube.rotation.z += cubeKeyboardStep
        }
      }
      if (inputState.keyboard.cube.isLeft ^ inputState.keyboard.cube.isRight) {
        if (inputState.keyboard.cube.isLeft) {
          cube.rotation.x -= cubeKeyboardStep
        }
        if (inputState.keyboard.cube.isRight) {
          cube.rotation.x += cubeKeyboardStep
        }
      }
      if (gamepad != null) {
        if (Math.abs(gamepad.leftStick.x) > 0.1) {
          cube.rotation.x += gamepad.leftStick.x * cubeKeyboardStep
        }
        if (Math.abs(gamepad.leftStick.y) > 0.1) {
          cube.rotation.z -= gamepad.leftStick.y * cubeKeyboardStep
        }
        if (Math.abs(gamepad.rightStick.x) > 0.1) {
          camera.alpha += gamepad.rightStick.x * alphaKeyboardStep
        }
        if (Math.abs(gamepad.rightStick.y) > 0.1) {
          camera.beta += gamepad.rightStick.y * betaKeyboardStep
        }
      }
    })

    this.scene = scene
  }

  run () {
    this.engine.runRenderLoop(() => {
      this.scene.render()
    })
  }
}