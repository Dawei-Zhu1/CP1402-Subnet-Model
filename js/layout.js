import * as CONSTANTS from "./constants.js";

export class Layout {
    constructor(ip) {
        this.ip = ip
    }

    // insert decimal ip into html
    display_decimal_ip() {
        for (let [index, octet] of this.ip.decimals.entries()) {
            document.getElementById("ip_dec").getElementsByClassName("octet")[index].innerText = octet.toString()
        }
    }

    // insert binary ip into html
    display_binary_ip() {
        for (let [index, each_part] of this.ip.get_ip_segment().entries()) {
            document.getElementById("ip_bin").getElementsByClassName("segment")[index].innerText = each_part
        }
    }

    // This is for slash format.
    display_slash_mask() {
        for (let i = 0; i < document.getElementsByClassName("slashed_mask").length; i++) {
            document.getElementsByClassName("slashed_mask")[i].innerText = '/' + this.ip.get_subnet_boundary_notation().toString()
        }
    }


    /* Mask */
    display_decimal_mask() {
        document.getElementById("mask_dec").getElementsByTagName('span')[1].innerText = this.ip.get_subnet_mask().join('.')
    }

    // Insert binary mask
    display_binary_mask() {
        for (let [index, each_part] of this.ip.get_mask_segments().entries()) {
            document.getElementById("mask_bin").getElementsByClassName("segment")[index].innerText = each_part
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
        document.getElementById("subnet_capacity").innerHTML = `2 ^ (${this.ip.get_subnet_bit_length()}) = ${2 ** ip.get_subnet_bit_length()}`
        document.getElementById("host_capacity").innerHTML = `2 ^ (${this.ip.get_host_bit_length()}) - 2 = ${2 ** ip.get_host_bit_length() - 2}`
    }

    /*
    Move the classboundary
    * If predicted move position is out of the range, then move to leftmost or rightmost.
    */
    class_boundary_shift(move = 1) {
        let predicted_position = this.ip.get_class_boundary_pos() + move
        if (0 <= predicted_position < this.ip.get_class_boundary_pos()) {
            this.ip.set_class_boundary(move)
        } else if (predicted_position < 0) {
            this.ip.set_class_boundary(-this.ip.get_class_boundary_pos())
        } else {
            let delta = this.ip.get_subnet_boundary_pos() - this.ip.get_class_boundary_pos()
            this.ip.set_class_boundary(delta)
        }
        this.display_binary_ip()
        this.display_binary_mask()
    }

    subnet_boundary_shift(move = 1) {
        let predicted_position = this.ip.get_class_boundary_pos() + move
        if (this.ip.get_class_boundary_pos() < predicted_position < CONSTANTS.IP_MAX_LEN - 3) {
            this.ip.set_subnet_boundary(move)
        }
        this.display_binary_ip()
        this.display_binary_mask()
        this.display_decimal_mask()
    }

    refresh() {
        this.display_slash_mask()
        this.display_decimal_ip()
        this.display_binary_ip()
        this.display_decimal_mask()
        this.display_binary_mask()
    }

}