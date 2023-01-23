
const uid2 = require("uid2");
const {TaixiuModel} = require("../models/taixiu.model")
const {UserModel} = require("../models/users.model")
const jwtHelper = require('../helpers/jwt.helper')
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 123
const default_avatar_url = 'https://cdn141.picsart.com/357697367045201.jpg'
async function getInfo(req, res){
    const accessToken = req.cookies.a_token;
    try{
        const {decoded} = await jwtHelper.verifyToken(accessToken, ACCESS_TOKEN_SECRET)
        const user = await TaixiuModel.findOne({id : decoded.data.id})
        const user_info = {
            id : decoded.data.id,
            user_name : decoded.data.user_name,
            display_name : decoded.data.display_name,
            avatar_url : decoded.data.avatar_url || default_avatar_url,
            money : user.money,
            play_count : user.play_count,
            win_count : user.win_count,
            isBetting : _betsList[user.id] || false
        }
        if (_waitResultTimeOver){
            return res.status(200).json({
                user_info,
                bet_info : {
                    type : 1,
                    text : 'Chờ',
                    time : _timer,
                    data : {
                        id : _sessionID,
                        xiuTotal : _xiuBet,
                        taiTotal : _taiBet,
                        result : {
                            1: _xx1,
                            2: _xx2,
                            3: _xx3
                        }
                    }
                },
            })
        }
        return res.status(200).json({
            user_info,
            bet_info : {
                type : 0,
                text : 'Đặt cược',
                time : _timer,
                data : {
                    id : _sessionID,
                    xiuTotal : _xiuBet,
                    taiTotal : _taiBet
                }
            },
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message : 'Hệ thống đang bận!'
        });
    }
}
async function getNewSession(req,res){
    return res.status(200).json({
        id : _sessionID
    })
}
async function getHistory (req,res){
    return res.status(200).json({
        history : _historyBet
    })
}
async function checkValidMoney(id, bmoney){
    const user = await TaixiuModel.findOne({ id }) || false;
    if (user && user.money >= bmoney){
        await TaixiuModel.findOneAndUpdate({ id }, {$inc : { "money" : -bmoney}});
        return true;
    }
    return false;
}
async function betEvent(req, res) {
    const userID = req.body.user_id || false
    const userBetSite = req.body.bet_site || false;
    const userBetMoney = req.body.money || false;
    if (!userID && !userBetSite && !userBetMoney > 0){
        return res.sendStatus(400);
    }
    if (_waitResultTimeOver || _betTimeOver && _timer < 4){
        return res.status(400).json({message : 'Time out!'});
    }
    if (await checkValidMoney(userID, userBetMoney) && _betTimeOver){
        const bet_info = {
            session_id : _sessionID,
            bet_time : new Date().toString(),
            time_left : _timer
        }
        const bet_id = uid2(10)
        const site = userBetSite == 'tai' ? 1 : 0;
        // register for id to bets list
        if (!_betsList[userID]){
            _betsList[userID] = []
        }
        _betsList[userID].push({
            bet_info,
            bet_id,
            user_id : userID,
            site,
            money : Number(userBetMoney),
            is_already_pay : false
        });

        // add to global money
        site ? (_taiBet += Number(userBetMoney)) : (_xiuBet += Number(userBetMoney));
        return res.status(202).json({bet_id});
    }
    return res.sendStatus(402);
}
module.exports = {
    getInfo,
    getNewSession,
    betEvent,
    getHistory
}