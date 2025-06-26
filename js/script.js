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
        // let keyCode = event.code
        // event.preventDefault()
        // console.log(keyCode)
        // Ctrl/CMD + Key
        if (event.ctrlKey || event.metaKey) {
            switch (keyName) {
                case 'ArrowLeft':
                    layout.moveSubnetBoundaryFurthermost(DIRECTION.LEFT)
                    break;
                case 'ArrowRight':
                    layout.moveSubnetBoundaryFurthermost()
                    break;
                case 'a':
                    layout.moveClassBoundaryFurthermost(DIRECTION.LEFT)
                    break;
                case 'd':
                    layout.moveClassBoundaryFurthermost()
                    break;
            }
        } else if (event.shiftKey) {
            switch (keyName) {
                case 'A':
                    layout.moveClassBoundaryBlockly(DIRECTION.LEFT)
                    break;
                case 'D':
                    layout.moveClassBoundaryBlockly()
                    break;
                case 'ArrowLeft':
                    layout.moveSubnetBoundaryBlockly(DIRECTION.LEFT)
                    break;
                case 'ArrowRight':
                    layout.moveSubnetBoundaryBlockly()
                    break;
            }
        } else
            // Single key
            switch (keyName) {
                case'ArrowLeft':
                    layout.moveSubnetBoundary(DIRECTION.LEFT)
                    break;
                case 'ArrowRight':
                    layout.moveSubnetBoundary()
                    break;
                case 'a':
                    layout.moveClassBoundary(DIRECTION.LEFT)
                    break;
                case 'd':
                    layout.moveClassBoundary()
                    break;
            }

    }
)
