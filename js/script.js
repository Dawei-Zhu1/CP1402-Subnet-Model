// script.js
import {IP} from './IP.js';
import {DIRECTION} from "./constants.js";

import {Layout} from './layout.js'

const ip = new IP()
const layout = new Layout(ip);
layout.refreshAll()

document.addEventListener('keydown',
    (event) => {
        let keyName = event.key
        let keyCode = event.code
        // event.preventDefault()
        // console.log(keyCode)
        // Ctrl/CMD + Key
        if (event.ctrlKey || event.metaKey) {
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
            }
        } else if (event.shiftKey) {
            switch (keyCode) {
                case 'KeyA':
                    layout.moveClassBoundaryBlockly(DIRECTION.LEFT)
                    break;
                case 'KeyD':
                    layout.moveClassBoundaryBlockly()
                    break;
                case 'ArrowLeft':
                    layout.moveSubnetBoundaryBlockly(DIRECTION.LEFT)
                    break;
                case 'ArrowRight':
                    layout.moveSubnetBoundaryBlockly()
                    break;
            }
        } else if (event.altKey) {
        } else {
            // Single key
            switch (keyCode) {
                case 'KeyA':
                    layout.moveClassBoundary(DIRECTION.LEFT)
                    break;
                case 'KeyD':
                    layout.moveClassBoundary()
                    break;
                case'ArrowLeft':
                    layout.moveSubnetBoundary(DIRECTION.LEFT)
                    break;
                case 'ArrowRight':
                    layout.moveSubnetBoundary()
                    break;
            }
        }
    }
)
