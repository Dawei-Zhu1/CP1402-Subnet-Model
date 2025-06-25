// IP.js
import * as CONSTANTS from './constants.js';

export class IP {
    constructor() {
        this._boundaries = [
            CONSTANTS.DEFAULT_CLASS_LENGTH - 1, // Boundary between class and subnet range
            CONSTANTS.IP_MAX_LEN - CONSTANTS.DEFAULT_HOST_LENGTH - 1 // Boundary between subnet and host range
        ]
        this.decimals = [];
        //
        this.generateIP()
    }

    _generateRandom(min, max) {
        /* Generate a random number, exclusive of max*/
        let random_number = Math.random() * (max - min) + min;
        return Math.floor(random_number)
    }

    _generateOctet() {
        /* Generate from 0~255 unsigned. */
        return this._generateRandom(0, 2 ** CONSTANTS.OCTET_LEN)
    }

    generateIP() {
        /* Generate the octet four times */
        for (let i = 0; i < 4; i++) {
            this.decimals.push(this._generateOctet())
        }
    }

    _transDec2Bin8(octet) {
        /* Receive an integer, return a string showing an 8-bit value. */
        return octet.toString(2).padStart(CONSTANTS.OCTET_LEN, "0")
    }

    toBin32(ip = this.decimals) {
        /* Transform to 4 ip octets in binary form */
        let raw_ip = ip
        let bin32ip = []
        for (const octet of raw_ip) {
            bin32ip.push(this._transDec2Bin8(octet))
        }
        return bin32ip
    }

    _getClassBitRange() {
        return [0, this.getClassBoundaryPosEnd() + 1]
    }

    _getSubnetBitRange() {
        return [this.get_subnet_boundary_pos_begin(), this.getSubnetBoundaryPosEnd() + 1]
    }

    _getHostBitRange() {
        return [this.getHostBoundaryPosStart(), CONSTANTS.IP_MAX_LEN]
    }

    getIPSegmentRanges() {
        let boundaries = [
            this._getClassBitRange(),
            this._getSubnetBitRange(),
            this._getHostBitRange()
        ]
        let ipSegments = []
        for (let segment of boundaries) {
            ipSegments.push(segment)
        }

        return ipSegments
    }

    getIP() {
        return this.decimals
    }

    _getIPSegmentsRaw(ip = this.getIP()) {
        let ip32 = this.toBin32(ip).join('')
        let ranges = this.getIPSegmentRanges()
        let result = []
        for (let r of ranges) {
            let [start, end] = r
            result.push(ip32.slice(start, end))
        }
        console.log(ip32, result)
        return result
    }

    // Add point separator to ip
    getIPSegmentFormatted(ip = this.getIP()) {
        let rawIPSegments = this._getIPSegmentsRaw(ip)
        let formattedIP = ''
        // Start looping
        let bitCounter = 0;
        for (let segment of rawIPSegments) {
            let formattedSeg = ''
            for (let bit of segment) {
                bitCounter++
                if (bitCounter % CONSTANTS.OCTET_LEN === 7 && bitCounter < CONSTANTS.IP_END_POS) {
                    bit += '.'
                }
            }
        }
        console.log(formattedIP)
        return formattedIP
    }

    getSubnetBitLength() {
        return this.getSubnetBoundaryPosEnd() - this.getClassBoundaryPosEnd()
    }

    getHostBitLength() {
        return CONSTANTS.IP_MAX_LEN - this.getSubnetBoundaryNotation()
    }

    /* Class bits */
    get_class_boundary_start_pos() {
        return 0
    }

    getClassBoundaryPosEnd() {
        return this._boundaries[0]
    }

    get_class_boundary_notation() {
        return this.getClassBoundaryPosEnd() + 1
    }

    /* Subnet bits */
    get_subnet_boundary_pos_begin() {
        return this.getClassBoundaryPosEnd() + 1
    }

    // Return the position of subnet boundary
    getSubnetBoundaryPosEnd() {
        return this._boundaries[1]
    }

    // Literal position of subnet boundary
    getSubnetBoundaryNotation() {
        /* Get the number after the slash notation */
        return this.getSubnetBoundaryPosEnd() + 1
    }

    /* Host bits */
    getHostBoundaryPosStart() {
        return this.getSubnetBoundaryPosEnd() + 1
    }

    getIPEndPos() {
        return CONSTANTS.IP_MAX_LEN - 1
    }

    /*Subnet mask*/

    getSubnetMask() {
        let mask = [0, 0, 0, 0]
        let fullMaskSets = Math.floor(this.getSubnetBoundaryNotation() / CONSTANTS.OCTET_LEN)
        let partialMask = this.getSubnetBoundaryNotation() % CONSTANTS.OCTET_LEN
        let octetPos = 0
        for (; octetPos < fullMaskSets; octetPos++) {
            mask[octetPos] = CONSTANTS.OCTET_MAX_VALUE
        }
        if (partialMask) {
            let offset = CONSTANTS.OCTET_LEN - partialMask
            mask[octetPos] = (2 ** partialMask - 1) << offset
        }
        return mask
    }

    getSubnetMaskBin32() {
        let subnetMask = this.getSubnetMask()
        return this.toBin32(subnetMask)
    }

    getMaskSegments() {
        return this.getIPSegmentFormatted(this.getSubnetMaskBin32())
    }

    setClassBoundary(move) {
        this._boundaries[0] += move
    }

    setSubnetBoundary(move) {
        this._boundaries[1] += move
    }


}