/**
 * Created by lenovo on 2017/8/25.
 */
const crypto = require("crypto");

const base = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
];

module.exports = (uid) => {
    let md5 = crypto.createHash("md5");
    let md5Id = md5.update(uid).digest("hex");

    let i = 0, out = '';

    let subId = parseInt(md5Id.substring(8 * i, 8 * (i + 1)), 16);
    int = subId & 0x3fffffff;

    while (i < 10){
        let val = 0x0000003d & int;
        out = out + base[val];
        int = int >> 2;
        i++;
    }

    return out;
};