// script.js
import {IP} from './IP.js';
import {DIRECTION} from "./constants.js";
import {Layout} from './layout.js'

const ip = new IP()
const layout = new Layout(ip);
layout.displayBinaryIP()
layout.refreshAll()

document.addEventListener('keydown',
    (event) => {
        let keyName = event.key
        let keyCode = event.code
        let kpc = event.charCode
        event.preventDefault()
        // console.log(keyCode)
        // Ctrl/CMD + Key
        console.log(`'${kpc}',`)
        if (event.ctrlKey || event.metaKey) {
            // switch (keyCode) {
            //     case 'ArrowUp':
            //         layout.adjustIPValue([0, 0, 0, 32])
            //         break;
            //     case 'ArrowDown':
            //         layout.adjustIPValue([-1, -1, -1, -64])
            //         break;
            // }
        } else if (event.altKey) {
            switch (keyCode) {
                case 'KeyA':
                    layout.moveClassBoundaryBlockly(DIRECTION.LEFT)
                    break;
                case 'KeyD':
                    layout.moveClassBoundaryBlockly()
                    break;
                case 'KeyW':
                    layout.adjustIPValue([0, 0, 32, 0])
                    break;
                case 'KeyS':
                    layout.adjustIPValue([-1, -1, -32, 0])
                    break;
                case 'ArrowLeft':
                    layout.moveSubnetBoundaryBlockly(DIRECTION.LEFT)
                    break;
                case 'ArrowRight':
                    layout.moveSubnetBoundaryBlockly()
                    break;
                case 'ArrowUp':
                    layout.adjustIPValue([0, 0, 0, 32])
                    break;
                case 'ArrowDown':
                    layout.adjustIPValue([-1, -1, -1, -32])
                    break;
            }
        } else if (event.shiftKey) {
            switch (keyCode) {
                case 'ArrowLeft':
                    layout.moveSubnetBoundaryFurthermost(DIRECTION.LEFT)
                    break;
                case 'ArrowRight':
                    layout.moveSubnetBoundaryFurthermost()
                    break;
                case 'KeyA':
                    layout.moveClassBoundaryFurthermost(DIRECTION.LEFT)
                    break;
                case 'KeyD':
                    layout.moveClassBoundaryFurthermost()
                    break;

                case 'KeyW':
                    layout.adjustIPValue([0, 0, 64, 0])
                    break;
                case 'KeyS':
                    layout.adjustIPValue([-1, -1, -64, 0])
                    break;
                case 'ArrowUp':
                    layout.adjustIPValue([0, 0, 0, 64])
                    break;
                case 'ArrowDown':
                    layout.adjustIPValue([-1, -1, -1, -64])
                    break;
            }
        } else {
            // Single key
            switch (keyCode) {
                case 'KeyA':
                    layout.moveClassBoundary(DIRECTION.LEFT)
                    break;
                case 'KeyD':
                    layout.moveClassBoundary()
                    break;
                case 'KeyW':
                    layout.adjustSubnetValue()
                    break;
                case 'KeyS':
                    layout.adjustSubnetValue(-1)
                    break
                case'ArrowLeft':
                    layout.moveSubnetBoundary(DIRECTION.LEFT)
                    break;
                case 'ArrowRight':
                    layout.moveSubnetBoundary()
                    break;
                case 'ArrowUp':
                    layout.adjustIPValue()
                    break;
                case 'ArrowDown':
                    layout.adjustIPValue([-1, -1, -1, -1])
                    break;
            }
        }
    }
)
