// IP.js
import * as CONST from './constants.js';

export class IP {
    constructor(fourOctets) {
        this._boundaries = [
            CONST.DEFAULT_CLASS_LENGTH - 1, // Boundary between class and subnet range
            CONST.IP_MAX_LEN - CONST.DEFAULT_HOST_LENGTH - 1 // Boundary between subnet and host range
        ]
        this.decimals = fourOctets ?? this.generateIP();
    }

    valueOf() {
        return this.ip
    }

    _generateRandom(min, max) {
        /* Generate a random number, exclusive of max*/
        let randomNumber = Math.random() * (max - min) + min;
        return Math.floor(randomNumber)
    }

    _generateOctet() {
        /* Generate from 0~255 unsigned. */
        return this._generateRandom(0, 2 ** CONST.OCTET_LEN)
    }

    generateIP() {
        /* Generate the octet four times */
        let _ = []
        for (let i = 0; i < 4; i++) {
            _.push(this._generateOctet())
        }
        return _
    }

    _transDec2Bin8(octet) {
        /* Receive an integer, return a string showing an 8-bit value. */
        return octet.toString(2).padStart(CONST.OCTET_LEN, "0")
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
        return [this.getSubnetBoundaryPosStart(), this.getSubnetBoundaryPosEnd() + 1]
    }

    _getHostBitRange() {
        return [this.getHostBoundaryPosStart(), CONST.IP_MAX_LEN]
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
        return [...this.decimals]
    }

    _getIPSegmentsRaw(ip = this.getIP()) {
        let ip32 = this.toBin32(ip).join('')
        let ranges = this.getIPSegmentRanges()
        let result = []
        for (let r of ranges) {
            let [start, end] = r
            result.push(ip32.slice(start, end))
        }
        return result
    }


    // Add point separator to ip
    getFormattedIPSegments(ip = this.getIP()) {
        let rawIPSegments = this._getIPSegmentsRaw(ip)
        let formattedIP = []
        // Start looping
        let bitCounter = 0;
        for (let segment of rawIPSegments) {
            let formattedSeg = ''
            for (let bit of segment) {
                formattedSeg += bit
                if (bitCounter % CONST.OCTET_LEN === 7 && bitCounter < CONST.IP_END_POS) {
                    formattedSeg += '.'
                }
                bitCounter++
            }
            formattedIP.push(formattedSeg)
        }
        return formattedIP
    }

    getClassBitLength() {
        return this.getClassBoundaryPosEnd() + 1
    }

    getSubnetBitLength() {
        return this.getSubnetBoundaryPosEnd() - this.getSubnetBoundaryPosStart() + 1
    }

    getHostBitLength() {
        return CONST.IP_END_POS - this.getSubnetBoundaryPosEnd() + 1
    }

    /* Class bits */
    getClassBoundaryPosStart() {
        return 0
    }

    getClassBoundaryPosEnd() {
        return this._boundaries[0]
    }

    getClassBoundaryNotation() {
        return this.getClassBoundaryPosEnd() + 1
    }

    /* Subnet bits */
    getSubnetBoundaryPosStart() {
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
        return CONST.IP_MAX_LEN - 1
    }

    /*Subnet mask*/

    getSubnetMask() {
        let mask = [0, 0, 0, 0]
        let fullMaskSets = Math.floor(this.getSubnetBoundaryNotation() / CONST.OCTET_LEN)
        let partialMask = this.getSubnetBoundaryNotation() % CONST.OCTET_LEN
        let octetPos = 0
        for (; octetPos < fullMaskSets; octetPos++) {
            mask[octetPos] = CONST.OCTET_MAX_VALUE
        }
        if (partialMask) {
            let offset = CONST.OCTET_LEN - partialMask
            mask[octetPos] = (2 ** partialMask - 1) << offset
        }
        return mask
    }

    getSubnetMaskBin32() {
        let subnetMask = this.getSubnetMask()
        return this.toBin32(subnetMask)
    }

    getFormattedMaskSegments() {
        return this.getFormattedIPSegments(this.getSubnetMaskBin32())
    }


    setClassBoundary(pos) {
        if (pos > this.getSubnetBoundaryPosEnd()) {
            this._boundaries[0] = this.getSubnetBoundaryPosEnd()
        } else if (pos < -1) {
            this._boundaries[0] = -1
        } else {
            this._boundaries[0] = pos
        }
    }

    setSubnetBoundary(pos) {
        if (pos > CONST.SUBNET_RIGHTMOST_BOUNDARY_POS) {
            this._boundaries[1] = CONST.SUBNET_RIGHTMOST_BOUNDARY_POS
        } else if (pos < this.getClassBoundaryPosEnd()) {
            this._boundaries[1] = this.getClassBoundaryPosEnd()
        } else {
            this._boundaries[1] = pos
        }
    }

    // IP Calculation
    add(IP) {
        let _ipA = IP.reverse()
        let _ipB = [0, 0, 0, 1].reverse()
        let result = []
        let _overflow = 0
        _ipB.reverse()
        for (let [index, octet] of _ipA.entries()) {
            // Addition
            let sum = octet + _ipB[index] + _overflow
            // Check overflow for current octet
            _overflow = sum > 0xff ? sum - 0xff : 0
            result.push(_overflow ? sum - 0x0100 : sum)
        }
        console.log(result.reverse())
        return result
    }
}