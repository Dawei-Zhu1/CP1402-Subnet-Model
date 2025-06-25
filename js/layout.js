import * as CONSTANTS from "./constants.js";

export class Layout {
    constructor(ip) {
        this.ip = ip
    }

    // insert decimal ip into html
    displayDecimalIP() {
        for (let [index, octet] of this.ip.decimals.entries()) {
            document.getElementById("ip_dec").getElementsByClassName("octet")[index].innerText = octet.toString()
        }
    }

    // insert binary ip into html
    displayBinaryIP() {
        for (let [index, each_part] of this.ip.getIPSegmentRanges().entries()) {
            document.getElementById("ip_bin").getElementsByClassName("segment")[index].innerText = each_part
        }
    }

    // This is for slash format.
    displaySlashMask() {
        for (let i = 0; i < document.getElementsByClassName("slashed_mask").length; i++) {
            document.getElementsByClassName("slashed_mask")[i].innerText = '/' + this.ip.getSubnetBoundaryNotation().toString()
        }
    }


    /* Mask */
    displayDecimalMask() {
        document.getElementById("mask_dec").getElementsByTagName('span')[1].innerText = this.ip.getSubnetMask().join('.')
    }

    // Insert binary mask
    displayBinaryMask() {
        for (let [index, eachPart] of this.ip._getIPSegmentsRaw().entries()) {
            document.getElementById("mask_bin").getElementsByClassName("segment")[index].innerText = eachPart
        }
    }

    // // First Subnet address
    // var first_subnet_bin = ip.provided_mask & ip.bin
    // document.getElementById("first_subnet").innerText = bin_to_256nary(first_subnet_bin).join(".")
    // // Last Subnet Addr
    // let last_subnet_bin = first_subnet_bin + (2 ** ip.subnet_bits) << ip.host_bits >>> 0
    // document.getElementById("last_subnet").innerText = bin_to_256nary(last_subnet_bin).join(".")

    // Update data
    update_data() {
        document.getElementById("subnet_capacity").innerHTML = `2 ^ (${this.ip.getSubnetBitLength()}) = ${2 ** this.ip.getSubnetBitLength()}`
        document.getElementById("host_capacity").innerHTML = `2 ^ (${this.ip.getHostBitLength()}) - 2 = ${2 ** this.ip.getHostBitLength() - 2}`
    }

    /*
    Move the class boundary
    * If predicted move position is out of the range, then move to leftmost or rightmost.
    */
    class_boundary_shift(move = 1) {
        let predictedPosition = this.ip.getClassBoundaryPosEnd() + move
        if (predictedPosition >= 0 && predictedPosition < this.ip.getSubnetBoundaryPosStart()) {
            this.ip.setClassBoundary(move)
        } else if (predictedPosition < 0) {
            this.ip.setClassBoundary(-this.ip.getClassBoundaryPosEnd())
        } else {
            let delta = this.ip.getSubnetBoundaryPosEnd() - this.ip.getClassBoundaryPosEnd()
            this.ip.setClassBoundary(delta)
        }
        this.displayBinaryIP()
        this.displayBinaryMask()
    }

    moveSubnetBoundary(move = 1) {
        let predictedPosition = this.ip.getSubnetBoundaryPosEnd() + move
        if (this.ip.getSubnetBoundaryPosEnd() <= predictedPosition && predictedPosition <= CONSTANTS.IP_MAX_LEN - 3) {
            this.ip.setSubnetBoundary(move)

            this.displayBinaryIP()
            this.displayBinaryMask()
            this.displayDecimalMask()
        }

    }

    refresh() {
        this.displaySlashMask()
        this.displayDecimalIP()
        this.displayBinaryIP()
        this.displayDecimalMask()
        this.displayBinaryMask()
    }

}