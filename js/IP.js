// IP.js
import * as CONSTANTS from './constants.js';

export class IP {
    constructor() {
        this.boundaries = [
            CONSTANTS.DEFAULT_CLASS_LENGTH - 1, // Boundary between class and subnet range
            CONSTANTS.IP_MAX_LEN - CONSTANTS.DEFAULT_HOST_LENGTH - 1 // Boundary between subnet and host range
        ]
        this.decimals = [];
        //
        this.generate_ip()
    }

    _generate_random(min, max) {
        /* Generate a random number, exclusive of max*/
        let random_number = Math.random() * (max - min) + min;
        return Math.floor(random_number)
    }

    _generate_octet() {
        /* Generate from 0~255 unsigned. */
        return this._generate_random(0, 2 ** CONSTANTS.OCTET_LEN)
    }

    generate_ip() {
        /* Generate the octet four times */
        for (let i = 0; i < 4; i++) {
            this.decimals.push(this._generate_octet())
        }
    }

    _dec_to_bin8(octet) {
        /* Receive an integer, return a string showing a 8-bit value. */
        return octet.toString(2).padStart(CONSTANTS.OCTET_LEN, "0")
    }

    to_bin32(ip = this.decimals) {
        /* Transform to 4 ip octets in binary form */
        let raw_ip = ip
        let bin32ip = []
        for (const octet of raw_ip) {
            bin32ip.push(this._dec_to_bin8(octet))
        }
        return bin32ip
    }

    get_ip_segment(ip = this.to_bin32()) {
        let ip_raw = ip.join('')
        // Start looping
        let formatted_ip = []
        let segment = ''
        for (let pos = 0; pos < ip_raw.length; pos++) {
            let current_bit = ip_raw[pos]
            if (pos % CONSTANTS.OCTET_LEN === CONSTANTS.OCTET_LEN - 1 && pos !== CONSTANTS.IP_MAX_LEN - 1) {
                current_bit += '.'
            }
            segment += current_bit
            // Check whether has touched the boundaries
            if (this.boundaries.includes(pos) || pos === CONSTANTS.IP_MAX_LEN - 1) {
                formatted_ip.push(segment)
                segment = ''
            }
        }
        return formatted_ip
    }

    get_subnet_bit_length() {
        return this.boundaries[1] - this.boundaries[0]
    }

    get_host_bit_length() {
        return CONSTANTS.IP_MAX_LEN - this.boundaries[1] - 1
    }


    get_class_range() {
        return [CONSTANTS.IP_BEGINNING_POS, this.get_class_bit_length() - 1]
    }

    get_subnet_boundary_notation() {
        /* Get the number after the slash notation */
        return this.boundaries[1] + 1
    }

    get_subnet_mask() {
        let mask = [0, 0, 0, 0]
        let full_mask_sets = Math.floor(this.get_subnet_boundary_notation() / CONSTANTS.OCTET_LEN)
        let partial_mask = this.get_subnet_boundary_notation() % CONSTANTS.OCTET_LEN
        let octet_pos = 0
        for (; octet_pos < full_mask_sets; octet_pos++) {
            mask[octet_pos] = CONSTANTS.OCTET_MAX_VALUE
        }
        if (partial_mask) {
            let offset = CONSTANTS.OCTET_LEN - partial_mask
            mask[octet_pos] = (2 ** partial_mask - 1) << offset
        }
        return mask
    }

    get_subnet_mask_bin32() {
        let subnet_mask = this.get_subnet_mask()
        return this.to_bin32(subnet_mask)
    }

    get_mask_segments() {
        return this.get_ip_segment(this.get_subnet_mask_bin32())
    }
}