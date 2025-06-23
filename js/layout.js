export function draw(ip) {
    // var subnet_mask = subnet_class_bit_number + subnet_bit_number
    // let subnet_mask = ip.get_subnet_mask()
    // let subnet_mask_octets = slice_32bin_to_octets(subnet_mask)
    // let subnet_mask_decimal = binary_octet_to_decimal(subnet_mask_octets)
    // // Format the subnet mask
    // let formatted_full_bin_mask = subnet_mask_octets.join('.')
    // document.getElementById("mask_dec").firstChild.innerText = subnet_mask_decimal.join('.')

    // // Format the IP addr
    // let formatted_full_bin_ip = format_bin_ip(ip.bin)
    // // IP addr slices
    // var full_bin_ip = slice_formatted_bin(formatted_full_bin_ip)

    // insert decimal ip into html
    for (let [index, octet] of ip.decimals.entries()) {
        document.getElementById("ip_dec").getElementsByClassName("octet")[index].innerText = octet.toString()
    }

    // insert binary ip into html
    for (let [index, each_part] of ip.get_ip_segment().entries()) {
        document.getElementById("ip_bin").getElementsByClassName("segment")[index].innerText = each_part
    }
    // This is for slash format.
    for (let i = 0; i < document.getElementsByClassName("slashed_mask").length; i++) {
        document.getElementsByClassName("slashed_mask")[i].innerText = '/' + ip.get_subnet_boundary_notation().toString()
    }
    /* Mask */
    document.getElementById("mask_dec").getElementsByTagName('span')[1].innerText = ip.get_subnet_mask().join('.')
    // Insert binary mask
    console.log(ip.get_mask_segments())
    for (let [index, each_part] of ip.get_mask_segments().entries()) {
        document.getElementById("mask_bin").getElementsByClassName("segment")[index].innerText = each_part
    }

    /* These features occupy to much memory */
    // // First Subnet address
    // var first_subnet_bin = ip.provided_mask & ip.bin
    // document.getElementById("first_subnet").innerText = bin_to_256nary(first_subnet_bin).join(".")
    // // Last Subnet Addr
    // let last_subnet_bin = first_subnet_bin + (2 ** ip.subnet_bits) << ip.host_bits >>> 0
    // document.getElementById("last_subnet").innerText = bin_to_256nary(last_subnet_bin).join(".")

    // Update data
    document.getElementById("subnet_capacity").innerHTML = `2 ^ (${ip.get_subnet_bit_length()}) = ${2 ** ip.get_subnet_bit_length()}`
    document.getElementById("host_capacity").innerHTML = `2 ^ (${ip.get_host_bit_length()}) - 2 = ${2 ** ip.get_host_bit_length() - 2}`
    ip.get_subnet_mask()


}