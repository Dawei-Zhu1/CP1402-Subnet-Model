// script.js
import {IP} from './IP.js';
import * as CONSTANTS from './constants.js';
import {draw} from './layout.js'

const ip = new IP()

draw(ip)
// var ip = {
//     dec: [],
//     bin: "",
//     class_bit_number: 16,
//     subnet_bit_number: 8,
//     host_bit_number: 8,
//     __initialise__: function () {
//         this.bin = generate_ip() // Int
//         this.dec = bin_to_256nary(this.bin)
//         this.subnet = this.get_subnet_address()
//
//     },
//     subnet_boundary_shift_left: function () {
//         if (this.subnet_bit_number > 0) {
//             this.subnet_bit_number--
//             this.host_bit_number++
//             this.set_subnet_mask()
//         }
//     },
//     subnet_boundary_shift_right: function () {
//         if (this.host_bit_number > LEAST_SUBNET_BITS) {
//             this.subnet_bit_number++
//             this.host_bit_number--
//             this.set_subnet_mask()
//         }
//     },
//     provided_boundary_shift_left: function () {
//         if (this.class_bit_number > 1) {
//             this.class_bit_number--
//             this.subnet_bit_number++
//             this.set_provided_mask()
//         }
//     },
//     provided_boundary_shift_right: function () {
//         if (this.subnet_bit_number > 0) {
//             this.class_bit_number++
//             this.subnet_bit_number--
//             this.set_provided_mask()
//         }
//     },
//     to_the_most_left_subnet_boundary: function () {
//         while (this.subnet_bit_number > 0) {
//             this.subnet_boundary_shift_left()
//         }
//     },
//     to_the_most_right_subnet_boundary: function () {
//         while (this.host_bit_number > LEAST_SUBNET_BITS) {
//             this.subnet_boundary_shift_right()
//         }
//     },
//     to_the_most_left_provided_boundary: function () {
//         while (this.class_bit_number > 1) {
//             this.provided_boundary_shift_left()
//         }
//     },
//     to_the_most_right_provided_boundary: function () {
//         while (this.subnet_bit_number > 0) {
//             this.provided_boundary_shift_right()
//         }
//     },
//     get_subnet_address: function () {
//         return this.subnet_mask & this.bin
//     },
//     get_subnet_mask: function () {
//         // Get subnet mask with host bits, set unsigned
//         return BIN32MAX << this.host_bit_number >>> 0
//     },
//     set_subnet_mask: function () {
//         // Apply subnet mask
//         this.subnet_mask = this.get_subnet_mask()
//     },
//     get_provided_mask: function () {
//         return BIN32MAX << (IP_MAX_BITS - this.class_bit_number) >>> 0
//     },
//     set_provided_mask: function () {
//         this.provided_mask = this.get_provided_mask()
//     },
//     bin32: function () {
//         return to_bin32(this.bin)
//     },
// }
//
// ip.__initialise__()
// draw(ip)
//
// document.addEventListener('keydown',
//     (event) => {
//         let keyname = event.key,
//             keycode = event.code
//         event.preventDefault()
//         // Ctrl + ArrLeft
//         if ((event.ctrlKey || event.metaKey) && event.key === 'ArrowLeft') {
//             ip.to_the_most_left_subnet_boundary()
//         } else
//             // Ctrl + ArrRight
//         if ((event.ctrlKey || event.metaKey) && event.key === 'ArrowRight') {
//             ip.to_the_most_right_subnet_boundary()
//         } else
//             // Ctrl + A
//         if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
//             ip.to_the_most_left_provided_boundary()
//         } else
//             // Ctrl + D
//         if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
//             ip.to_the_most_right_provided_boundary()
//         } else
//             // Single key
//         if (keyname == 'ArrowLeft') {
//             // subnet_boundary_shift_left()
//             ip.subnet_boundary_shift_left()
//         } else if (keyname == 'ArrowRight') {
//             // subnet_boundary_shift_right()
//             ip.subnet_boundary_shift_right()
//         } else if (keyname == 'a') {
//             ip.provided_boundary_shift_left()
//         } else if (keyname == 'd') {
//             ip.provided_boundary_shift_right()
//         }
//         draw(ip)
//     }
// )
//
// function determine_subnet_address(ip, subnetmask) {
//
// }
//
// function to_bin32(ip) {
//     /* Receive an integer, return a string showing a 32-bit value. */
//     return ip.toString(2).padStart(IP_MAX_BITS, "0")
// }
//
// function bin_to_256nary(bin) {
//     /* Return a list of 4 octuples. */
//     let octuple = []
//     let value = bin
//     while (value) {
//         octuple.unshift(value % 256)
//         value = Math.floor(value / 256)
//     }
//     return octuple
// }
//
// function slice_formatted_bin(formatted_full_bin) {
//     let mask_class_bits = formatted_full_bin.slice(
//         IP_BEGIN_INDEX,
//         index_offset_with_formatted_ip(ip.class_bit_number)
//     )
//     let mask_subnet_bits = formatted_full_bin.slice(
//         index_offset_with_formatted_ip(ip.class_bit_number),
//         index_offset_with_formatted_ip(ip.class_bit_number + ip.subnet_bit_number)
//     )
//     let mask_host_bits = formatted_full_bin.slice(index_offset_with_formatted_ip(IP_MAX_BITS - ip.host_bit_number))
//     return [mask_class_bits, mask_subnet_bits, mask_host_bits]
// }
//


function slice_32bin_to_octets(bin_ip) {
    /*
    Divide 32 bits into 4 octets.
    */
    result = []
    bin_to_string = to_bin32(bin_ip)
    for (let i = 0; i < IP_MAX_BITS / OCTET_BITS; i++) {
        result.push(bin_to_string.slice(i * OCTET_BITS, (i + 1) * OCTET_BITS))
    }
    return result
}

function convert_to_8bits_bin(ip_blocks) {
    /*
    Return a list with 4 octets
    */
    let _ip_binary_octets = []
    for (let each_octet of ip_blocks) {
        _ip_binary_octets.push(each_octet.toString(2).padStart(OCTET_BITS, "0"))
    }
    return _ip_binary_octets.join("")
}

function insert_at_index(text, insertion, index) {
    /* Insert after index. */
    let _text = text
    let _index_offset = 1
    let _index = index + _index_offset
    return text.slice(0, _index) + insertion + text.slice(_index)
}

function index_offset_with_formatted_ip(formatted_bin_ip_index) {
    /*
    Make sure the boundary are created within these indeces:
    0~7, 9~16, 18~25, 27~34
    */
    return formatted_bin_ip_index + Math.floor(formatted_bin_ip_index / OCTET_BITS)
}