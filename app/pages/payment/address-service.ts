const ADDRESS_LIST = {
    CITY: ["Hồ Chí Minh", "Cần Thơ"],
    CITY_DETAILS: {
        "Hồ Chí Minh": {
            ALL: ["Quận 1", "Quận 2", "Quận 3", "Quận 4", "Quận 5", "Quận 6", "Quận 7", "Quận 8", "Quận 9", "Quận 10", "Quận 11", "Quận 12", "Quận Bình Tân", "Quận Gò Vấp", "Quận Phú Nhuận",
                "Quận Tân Bình", "Quận Tân Phú", "Huyện Bình Chánh", "Huyện Cần Giờ", "Huyện Củ Chi", "Huyện Hóc Môn", "Huyện Nhà Bè"],
            "Quận 1": ["Phường Bến Nghé", "Phường Bến Thành", "Phường Cầu Kho", "Phường Cầu Ông Lãnh", "Phường Cô Giang", "Phường Đa Kao", "Phường Cư Trinh", "Phường Phạm Ngũ Lão", "Phường Thái Bình", "Phường Tân Định"],
            "Quận 2": ["Phường Thảo Điền", "Phường An Phú", "Phường Bình An", "Phường Bình Trưng Đông", "Phường Bình Trưng Tây", "Phường An Khánh", "Phường An Lợi Đông"],
            "Quận 3": ["Phường 01", "Phường 02", "Phường 03", "Phường 04", "Phường 05", "Phường 06", "Phường 07", "Phường 08", "Phường 09"],
            "Quận 4": ["Phường 01", "Phường 02", "Phường 03", "Phường 04", "Phường 05", "Phường 06", "Phường 07", "Phường 08", "Phường 09"],
            "Quận 5": ["Phường 01", "Phường 02", "Phường 03", "Phường 04", "Phường 05", "Phường 06", "Phường 07", "Phường 08", "Phường 09"],
            "Quận 6": ["Phường 01", "Phường 02", "Phường 03", "Phường 04", "Phường 05", "Phường 06", "Phường 07", "Phường 08", "Phường 09"],
            "Quận 7": ["Phường Tân Thuận Đông", "Phường Tân Thuận Tây", "Phường Tân Kiểng", "Phường Tân Hưng", "Phường Bình Thuận"],
            "Quận 8": ["Phường 01", "Phường 02", "Phường 03", "Phường 04", "Phường 05", "Phường 06", "Phường 07", "Phường 08", "Phường 09"],
            "Quận 9": ["Phường Long Bình", "Phường Long Thạnh Mỹ", "Phường Tân Phú", "Phường Hiệp Phú"],
            "Quận 10": ["Phường 01", "Phường 02", "Phường 03", "Phường 04", "Phường 05", "Phường 06", "Phường 07", "Phường 08", "Phường 09"],
            "Quận 11": ["Phường 01", "Phường 02", "Phường 03", "Phường 04", "Phường 05", "Phường 06", "Phường 07", "Phường 08", "Phường 09"],
            "Quận 12": ["Phường Thạnh Xuân", "Phường Thạnh Lộc", "Phường Hiệp Thành", "Phường Tân Thới Hiệp", "Phường An Phú Đông"],
            "Quận Bình Tân": ["Phường Bình Hưng Hòa", "Phường Bình Hưng Hoà A", "Phường Bình Hưng Hoà B", "Phường Bình Trị Đông", "Phường Bình Trị Đông A", "Phường Bình Trị Đông B"],
            "Huyện Bình Chánh": ["Xã Vĩnh Lộc A", "Xã Vĩnh Lộc B", "Xã Bình Lợi", "Xã Lê Minh Xuân", "Xã Tân Nhựt", "Xã Tân Kiên"],
        },
        "Cần Thơ": {
            ALL: ["Quận Bình Thủy", "Quận Cái Răng", "Quận Ninh Kiều", "Quận Ô Môn", "Quận Thốt Nốt", "Huyện Cờ Đỏ", "Huyện Phong Điền", "Huyện Thới Lai", "Huyện Vĩnh Thạnh"],
            "Quận Bình Thủy": [ "Phường An Thới", "Phường Bình Thủy", "Phường Bùi Hữu Nghĩa", "Phường Long Hòa", "Phường Long Tuyền", "Phường Thới An Đông", "Phường Trà An", "Phường Trà Nóc"],
            "Quận Cái Răng": [ "Phường Ba Láng", "Phường Hưng Phú", "Phường Hưng Thạnh", "Phường Lê Bình", "Phường Phú Thứ", "Phường Tân Phú", "Phường Thường Thạnh"],
            "Quận Ninh Kiều": [ "Phường An Bình", "Phường An Cư", "Phường An Hòa", "Phường An Hội", "Phường An Khánh", "Phường An Lạc", "Phường An Nghiệp",
                "Phường An Phú", "Phường Cái Khế", "Phường Hưng Lợi", "Phường Tân An", "Phường Thới Bình", "Phường Xuân Khánh"],
            "Quận Ô Môn": ["Phường Châu Văn Liêm", "Phường Long Hưng", "Phường Phước Thới", "Phường Thới An", "Phường Thới Hòa", "Phường Thới Long", "Phường Trường Lạc"],
            "Quận Thốt Nốt": ["Phường Tân Hưng", "Phường Tân Lộc", "Phường Thạnh Hòa", "Phường Thới Thuận", "Phường Thốt Nốt", "Phường Thuận An", "Phường Thuận Hưng",
                "Phường Trung Kiên", "Phường Trung Nhứt"],
            "Huyện Cờ Đỏ": ["Thị trấn Cờ Đỏ", "Xã Đông Hiệp", "Xã Đông Thắng", "Xã Thạnh Phú", "Xã Thới Đông", "Xã Thới Hưng", "Xã Thới Xuân", "Xã Trung An", "Xã Trung Hưng", "Xã Trung Thạnh"],
            "Huyện Phong Điền": ["Thị trấn Phong Điền", "Xã Giai Xuân", "Xã Mỹ Khánh", "Xã Nhơn Ái", "Xã Nhơn Nghĩa", "Xã Tân Thới", "Xã Trường Long"],
            "Huyện Thới Lai": ["Thị trấn Thới Lai", "Xã Định Môn", "Xã Đông Bình", "Xã Đông Thuận", "Xã Tân Thạnh", "Xã Thới Tân", "Xã Thới Thạnh", "Xã Trường Thắng", "Xã Trường Thành",
                "Xã Trường Xuân", "Xã Trường Xuân A", "Xã Trường Xuân B", "Xã Xuân Thắng"],
            "Huyện Vĩnh Thạnh": ["Thị trấn Vĩnh Thạnh", "Thị trấn Thạnh An", "Xã Thạnh An", "Xã Thạnh Lộc", "Xã Thạnh Lợi", "Xã Thạnh Mỹ", "Xã Thạnh Quới", "Xã Thạnh Thắng",
                "Xã Thạnh Tiến", "Xã Vĩnh Bình", "Xã Vĩnh Trinh"]
        }
    }
}

export class AddressService {
    public static getCityList() {
        return ADDRESS_LIST.CITY;
    }

    public static getDistrictList(city: string) {
        return ADDRESS_LIST.CITY_DETAILS[city] ? ADDRESS_LIST.CITY_DETAILS[city].ALL : [];
    }

    public static getCommuneList(city: string, district: string) {
        if (!ADDRESS_LIST.CITY_DETAILS[city]) {
            return [];
        }
        else if (!ADDRESS_LIST.CITY_DETAILS[city][district]) {
            return [];
        }
        else {
            return ADDRESS_LIST.CITY_DETAILS[city][district];
        }
    }
}
