function draw_circle() {

}

function deg_to_rad(deg) {
    return deg * (Math.PI / 180);
}

function rad_to_deg(rad) {
    return (180 * rad) / Math.PI
}

function get_distance(x1, y1, x2, y2){
    return Math.sqrt( Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
}

function is_intersect(coords_obj_1, coords_obj_2, obj_1_r, obj_2_r) {
    let l = get_distance(coords_obj_1.x, coords_obj_1.y, coords_obj_2.x, coords_obj_2.y)
    return l < obj_1_r + obj_2_r;
}

function remove_from_list(list, obj){
    let idx = list.indexOf(obj)
    if (idx !== -1){
        return list.splice(idx, 1)
    }
}

function get_rand_int(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}