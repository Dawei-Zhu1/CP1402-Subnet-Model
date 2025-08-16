import * as CONST from "./constants.js";
import {DIRECTION} from "./constants.js";


export class Layout {
    constructor(ip) {
        this.ip = ip
    }

    /*IP*/

    // insert decimal IP into html
    displayDecimalIP() {
        for (let [index, octet] of this.ip.decimals.entries()) {
            document
                .getElementById("dec-ip")
                .getElementsByClassName("octet")[index].value = octet.toString()
        }
    }

    // insert binary ip into html
    displayBinaryIP() {
        /*Locate*/
        let targetElement = document.querySelectorAll("#bin-ip .octet");
        clearContentWithinClass(targetElement);
        /*Initialise*/
        let currentBitIndex = 0

        for (let [index, eachPart] of this.ip.getFormattedIPSegments().entries()) {
            let currentBitClass = CONST.CLASS_LIST[index]
            for (let i of eachPart) {
                let newElement = document.createElement("span")
                let octetGroup = Math.floor(currentBitIndex / 8)
                newElement.innerHTML = i
                newElement.classList.add(currentBitClass, "bit")
                targetElement[octetGroup].appendChild(newElement)
                currentBitIndex++
            }
        }
    }

    // This is for slash format.
    displaySlashMask() {
        for (let i = 0; i < document.getElementsByClassName("slashed_mask").length; i++) {
            document
                .getElementsByClassName("slashed_mask")[i].innerText = '/' + this.ip.getSubnetBoundaryNotation().toString()
        }
    }

    /* Mask */
    displayDecimalMask() {
        /*Write to input*/
        for (let [index, octet] of this.ip.getSubnetMask().entries()) {
            document
                .getElementById("dec-mask")
                .getElementsByClassName("octet")[index].innerText = octet.toString()
        }
    }

    // Insert binary mask
    displayBinaryMask() {
        let targetElements = document.querySelectorAll("#bin-mask .octet");
        clearContentWithinClass(targetElements)
        /*Initialise*/
        let currentBitIndex = 0
        for (let [index, eachPart] of this.ip.getFormattedMaskSegments().entries()) {
            let currentBitClass = CONST.CLASS_LIST[index]
            for (let i of eachPart) {
                let newElement = document.createElement("span")
                let octetGroup = Math.floor(currentBitIndex / 8)
                newElement.innerHTML = i
                newElement.classList.add(currentBitClass, "bit")
                targetElements[octetGroup].appendChild(newElement)
                currentBitIndex++
            }
        }
    }

    /*Subnet*/
    displayFirstSubnet() {
        document.getElementById('dec-subnet').innerText = this.ip.getFirstSubnetIP().join('.')
    }

    displayFirstBinarySubnet() {
        for (let [index, segment] of this.ip.getFirstBinIpOfSubnet().entries()) {
            document.getElementById('dec-subnet').innerText = this.ip.getSubnetMask().join('.')
                .getElementsByClassName("octet")[index].innerText = segment
        }
    }

    // Update data
    updateSubnetCapacity() {
        document.getElementById("subnet_capacity").innerHTML = `2<sup>${this.ip.getSubnetBitLength()}</sup> = ${2 ** this.ip.getSubnetBitLength()}`
    }

    updateHostCapacity() {
        document.getElementById("host_capacity").innerHTML = `2<sup>${this.ip.getHostBitLength()}</sup> - 2 = ${2 ** this.ip.getHostBitLength() - 2}`
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
        // this.displayFirstBinarySubnet()
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
        if (increment === 1) {
            _incrementSet[octetIndex] = increment << (bitPosInOctet - 1)
        } else {
            for (let i = 0; i < octetIndex; i++) {
                _incrementSet[i] = -1
            }
            _incrementSet[octetIndex] = (increment << (bitPosInOctet - 1))
        }
        this.adjustIPValue(_incrementSet)
        this.refreshSubnetBoundary()
    }

    fetchIP() {
        /*Read input IP*/
        let ip = document.querySelectorAll("input.octet")
        let values = new Uint8Array(4)
        for (let [index, content] of ip.entries()){
            values[index] = Number(content.value)
        }
        return values
    }

    setIP() {
        let newIP = this.fetchIP()
        this.ip.modifyIP(newIP)
    }
}

function clearContentWithinClass(elements) {
    elements.forEach(element => {
        element.innerHTML = ""
    })
}

function mod(n, m) {
    return ((n % m) + m) % m
}

function createElement(tagName, id, classList, content) {
    let newElement = document.createElement(tagName)
    newElement.innerHTML = content
    classList && newElement.classList.add(classList)
    id && (newElement.id = id)
    return newElement
}
