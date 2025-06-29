import * as CONST from "./constants.js";
import {DIRECTION} from "./constants.js";


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
        for (let [index, each_part] of this.ip.getFormattedIPSegments().entries()) {
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
        for (let [index, eachPart] of this.ip.getFormattedMaskSegments().entries()) {
            document.getElementById("mask_bin").getElementsByClassName("segment")[index].innerText = eachPart
        }
    }

    displayFirstSubnet() {
        document.getElementById('subnet_of_this_ip_dec').innerText = this.ip.getFirstSubnetIP().join('.')
    }

    // // Display First Subnet address
    // var first_subnet_bin = ip.provided_mask & ip.bin
    // document.getElementById("first_subnet").innerText = bin_to_256nary(first_subnet_bin).join(".")
    // // Last Subnet Addr
    // let last_subnet_bin = first_subnet_bin + (2 ** ip.subnet_bits) << ip.host_bits >>> 0
    // document.getElementById("last_subnet").innerText = bin_to_256nary(last_subnet_bin).join(".")

    // Update data
    updateSubnetCapacity() {
        document.getElementById("subnet_capacity").innerHTML = `2 ^ (${this.ip.getSubnetBitLength()}) = ${2 ** this.ip.getSubnetBitLength()}`
    }

    updateHostCapacity() {
        document.getElementById("host_capacity").innerHTML = `2 ^ (${this.ip.getHostBitLength()}) - 2 = ${2 ** this.ip.getHostBitLength() - 2}`
    }

    updateData() {
        this.updateSubnetCapacity()
        this.updateHostCapacity()
    }

    /* Move the class boundary
    * If predicted move position is out of the range, then move to leftmost or rightmost.
    */
    moveClassBoundary(move = 1) {
        let newPos = this.ip.getClassBoundaryPosEnd() + move
        this.ip.setClassBoundary(newPos)
        this.refreshClassBoundary()
    }

    moveClassBoundaryFurthermost(direction = DIRECTION.RIGHT) {
        switch (direction) {
            case DIRECTION.LEFT:
                this.ip.setClassBoundary(-1)
                break;
            case DIRECTION.RIGHT:
                this.ip.setClassBoundary(this.ip.getSubnetBoundaryPosEnd())
                break
        }
        this.refreshClassBoundary()
    }

    _moveBlockly(direction = DIRECTION.RIGHT, curPos, fun) {
        let _direction = direction;
        let _curPos = curPos
        if (!((_curPos + 1) % CONST.OCTET_LEN)) {
            let predictedMove = _curPos + _direction * CONST.OCTET_LEN
            fun(predictedMove)
        } else {
            let modValue = mod((-_direction * _curPos), CONST.OCTET_LEN)
            fun(_curPos + _direction * (modValue) - 1)
        }
    }

    moveClassBoundaryBlockly(direction = DIRECTION.RIGHT) {
        let _direction = direction;
        let curPos = this.ip.getClassBoundaryPosEnd()
        if (!((curPos + 1) % CONST.OCTET_LEN)) {
            let predictedMove = curPos + _direction * CONST.OCTET_LEN
            this.ip.setClassBoundary(predictedMove)
        } else {
            let modValue = mod((-_direction * curPos), CONST.OCTET_LEN)
            this.ip.setClassBoundary(curPos + _direction * (modValue) - 1)
        }
        this.refreshSubnetBoundary()
        this.refreshClassBoundary()
    }

    moveSubnetBoundaryBlockly(direction = DIRECTION.RIGHT) {
        let _direction = direction;
        let _curPos = this.ip.getSubnetBoundaryPosEnd()
        if (!((_curPos + 1) % CONST.OCTET_LEN)) {
            let predictedMove = _curPos + _direction * CONST.OCTET_LEN
            this._setSubnetBoundary(predictedMove)
        } else {
            let modValue = mod((-_direction * _curPos), CONST.OCTET_LEN)
            this._setSubnetBoundary(_curPos + _direction * (modValue) - 1)
        }
        this.refreshSubnetBoundary()
    }

    moveSubnetBoundary(move = 1) {
        let newPos = this.ip.getSubnetBoundaryPosEnd() + move
        if (this.ip.getClassBoundaryPosEnd() <= newPos && newPos <= CONST.SUBNET_RIGHTMOST_BOUNDARY_POS) {
            this.ip.setSubnetBoundary(newPos)
            this.refreshSubnetBoundary()
        }
    }

    moveSubnetBoundaryFurthermost(direction = DIRECTION.RIGHT) {
        switch (direction) {
            case DIRECTION.LEFT:
                this.ip.setSubnetBoundary(this.ip.getClassBoundaryPosEnd())
                break;
            case DIRECTION.RIGHT:
                this.ip.setSubnetBoundary(CONST.SUBNET_RIGHTMOST_BOUNDARY_POS)
                break
        }
        this.refreshSubnetBoundary()
    }


    refreshAll() {
        // IP
        this.displaySlashMask()
        this.displayDecimalIP()
        this.displayBinaryIP()
        // Mask
        this.displayDecimalMask()
        this.displayBinaryMask()
        // Subnet
        this.displayFirstSubnet()
        // Data
        this.updateData()
    }

    refreshClassBoundary() {
        this.displayBinaryIP()
        this.displayBinaryMask()
        this.updateSubnetCapacity()
    }

    refreshSubnetBoundary() {
        this.displayBinaryIP()
        this.displayBinaryMask()
        this.displayDecimalMask()
        this.displaySlashMask()
        this.updateData()
        this.displayFirstSubnet()

    }

    _setClassBoundary(value) {
        this.ip.setClassBoundary(value)
    }

    _setSubnetBoundary(value) {
        this.ip.setSubnetBoundary(value)
    }

    adjustIPValue(increment = [0, 0, 0, 1]) {
        this.ip.add(increment)
        this.displayBinaryIP()
        this.displayDecimalIP()
    }

    adjustSubnetValue(increment = 1) {
        let _incrementSet = new Uint8Array(4)
        let position = this.ip.getSubnetBoundaryPosEnd()
        let octetIndex = Math.floor(position / 8)
        let bitPosInOctet = CONST.OCTET_LEN - position % CONST.OCTET_LEN
        _incrementSet[octetIndex] = increment << (bitPosInOctet - 1)
        this.adjustIPValue(_incrementSet)
        this.refreshSubnetBoundary()
    }

}

function mod(n, m) {
    return ((n % m) + m) % m
}