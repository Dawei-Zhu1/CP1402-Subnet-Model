// script.js
import {IP} from './IP.js';
import * as CONSTANTS from './constants.js';
import {Layout} from './layout.js'

const ip = new IP()
const layout = new Layout(ip);
layout.refreshAll()

document.addEventListener('keydown',
    (event) => {
        let keyname = event.key,
            keycode = event.code
        event.preventDefault()
        // Ctrl + ArrLeft
        if ((event.ctrlKey || event.metaKey) && event.key === 'ArrowLeft') {
            layout.moveSubnetBoundaryLeftmost()
        } else
            // Ctrl + ArrRight
        if ((event.ctrlKey || event.metaKey) && event.key === 'ArrowRight') {
            layout.moveSubnetBoundaryRightmost()
        } else
            // Ctrl + A
        if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
            layout.moveClassBoundaryLeftmost()
        } else
            // Ctrl + D
        if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
            layout.moveClassBoundaryRightmost()
        } else
            // Single key
        if (keyname === 'ArrowLeft') {
            layout.moveSubnetBoundary(-1)
        } else if (keyname === 'ArrowRight') {
            layout.moveSubnetBoundary()
        } else if (keyname === 'a') {
            layout.moveClassBoundary(-1)
        } else if (keyname === 'd') {
            layout.moveClassBoundary()
        }
    }
)
