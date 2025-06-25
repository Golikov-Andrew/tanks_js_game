class StageRandomizer {
    constructor() {
        this.result_list = []
    }

    collect_random_points( min_x, max_x, min_y, max_y, count, radiuses_external) {
        let special_list = []
        for (let i = 0, x, y, success; i < count; i++) {
            success = false
            for (let j = 0, is_intersect_val; j < 100; j++) { // 100 attempts
                is_intersect_val = false
                x = get_rand_int(min_x, max_x)
                y = get_rand_int(min_y, max_y)
                for (let k = 0; k < this.result_list.length; k++) {
                    if(is_intersect({x: x, y: y}, this.result_list[k], radiuses_external, this.result_list[k].radius)){
                        is_intersect_val = true
                        break
                    }
                }
                if(is_intersect_val){
                    continue
                }
                this.result_list.push({x: x, y: y, radius: radiuses_external});
                special_list.push({x: x, y: y, radius: radiuses_external, a: get_rand_int(0, 360)});
                success = true
                break;
            }
            if(!success){
                throw Error('Ошибка! Не удалось сгенерировать рандомные координаты!')
            }
        }
        return special_list
    }
}