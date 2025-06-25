// script.js
import {IP} from './IP.js';
// import * as CONSTANTS from './constants.js';
import {Layout} from './layout.js'

const ip = new IP()
const layout = new Layout(ip);
layout.refreshAll()

document.addEventListener('keydown',
    (event) => {
        let keyName = event.key
        // let keycode = event.code
        event.preventDefault()
        // Ctrl/CMD + Key
        if (event.ctrlKey || event.metaKey) {
            switch (keyName) {
                case 'ArrowLeft':
                    layout.moveSubnetBoundaryLeftmost()
                    break;
                case 'ArrowRight':
                    layout.moveSubnetBoundaryRightmost()
                    break;
                case 'a':
                    layout.moveClassBoundaryLeftmost()
                    break;
                case 'd':
                    layout.moveClassBoundaryRightmost()
                    break;
            }
        } else
            // Single key
            switch (keyName) {
                case'ArrowLeft':
                    layout.moveSubnetBoundary(-1)
                    break;
                case 'ArrowRight':
                    layout.moveSubnetBoundary()
                    break;
                case 'a':
                    layout.moveClassBoundary(-1)
                    break;
                case 'd':
                    layout.moveClassBoundary()
                    break;
            }

    }
)
