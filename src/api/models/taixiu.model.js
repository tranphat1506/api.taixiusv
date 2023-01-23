const Taixiu = require('mongoose');
const TaixiuSchema = new Taixiu.Schema({
    id : String,
    money : {
        type : Number,
        default : 0
    },
    play_count : {
        type : Number,
        default : 0
    },
    win_count : {
        type : Number,
        default : 0
    },
    bets_history : {
        type : Array,
        default : []
    }
})
const TaixiuModel = Taixiu.model('Taixiu',TaixiuSchema);
module.exports = {
    TaixiuModel
}