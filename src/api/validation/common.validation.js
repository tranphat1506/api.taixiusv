/**
 * @description check object length
 * @param {String} object 
 * @param {Number} max 
 * @param {Number} min 
 * @returns True/False
 */
function checkLength(object, max, min = 1) {
    if (max){
        return (object.length > max) ? false : max >= min;
    }
    return false;
}

module.exports = {
    checkLength
}