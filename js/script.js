// script.js
import {IP} from './IP.js';
import * as CONSTANTS from './constants.js';
import {Layout} from './layout.js'

const ip = new IP()
const layout = new Layout(ip);
layout.refresh()

document.addEventListener('keydown',
    (event) => {
        let keyname = event.key,
            keycode = event.code
        event.preventDefault()
        // Ctrl + ArrLeft
        if ((event.ctrlKey || event.metaKey) && event.key === 'ArrowLeft') {
            // ip.to_the_most_left_subnet_boundary()
        } else
            // Ctrl + ArrRight
        if ((event.ctrlKey || event.metaKey) && event.key === 'ArrowRight') {
            // ip.to_the_most_right_subnet_boundary()
        } else
            // Ctrl + A
        if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
            // ip.to_the_most_left_provided_boundary()
        } else
            // Ctrl + D
        if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
            // ip.to_the_most_right_provided_boundary()
        } else
            // Single key
        if (keyname === 'ArrowLeft') {
            layout.moveSubnetBoundary(-1)
        } else if (keyname === 'ArrowRight') {
            layout.moveSubnetBoundary()
        } else if (keyname === 'a') {
            layout.class_boundary_shift(-1)
        } else if (keyname === 'd') {
            layout.class_boundary_shift()
        }
    }
)
