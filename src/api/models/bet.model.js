const Bet = require('mongoose');
const BetSchema = new Bet.Schema({
    bet_info : {
        session_id : String,
        bet_time : {
            type : String,
            default : new Date().toString()
        },
        time_left : Number
    },
    bet_id : String,
    site : Number,
    money : Number,
    is_already_pay : {
        type : Boolean,
        default : false
    }
    
})
const BetModel = Bet.model('Taixiu',BetSchema);
BetModel.deleteMany()
module.exports = {
    BetModel
}