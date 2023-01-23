const uid2 = require("uid2/promises")
const { TaixiuModel } = require("../models/taixiu.model")
const User = require("../models/users.model")
const jwtHelper = require('../helpers/jwt.helper')
const _ = require('underscore')

const WIN_TAX = 3/100
const WIN_RATE = 2.0 - WIN_TAX

var xx1;
var xx2;
var xx3;
var taiBet = 0;
var xiuBet = 0;


var betsList = {};
var historyBet=[];
global._historyBet = historyBet
global._betsList = betsList
global._taiBet = taiBet
global._xiuBet = xiuBet

global._xx1 = xx1;
global._xx2 = xx2;
global._xx3 = xx3;

function calcWinBet(bmoney){
    if (bmoney >= 50000){
        return Math.round(bmoney*WIN_RATE);
    }
    return (bmoney*2) - 2000;
}
const updateUser = user => {
    return new Promise((resolve, reject)=>{
        const result = _xx1+_xx2+_xx3 > 10 ? 1 : 0
        // check session_id match
        if (_sessionID == user.bet_info.session_id){
            //check win or lose
            if (result == user.site){
                // set already pay for user 
                user.is_already_pay = true;
                return resolve(TaixiuModel.findOneAndUpdate({id : user.user_id},
                {
                    $inc: {"play_count" : 1, "win_count" : 1, "money" : calcWinBet(user.money)},
                    $push : {"bets_history" : user}
                }))
            }else{
                return resolve(TaixiuModel.findOneAndUpdate({id : user.user_id},
                {
                    $inc: { "play_count" : 1 },
                    $push : { "bets_history" : user }
                }))
            }
        }
    })
}
const updateAllUser = async () =>{
    if (!_.isEmpty(_betsList)){
        for (const betID in _betsList) {
            for (const bet of _betsList[betID]) {
                await updateUser(bet);
            }
        }
    }
}
function addToHistory(xx1,xx2,xx3){
    if (xx1+xx2+xx3>10){
        _historyBet.length < 24 ? _historyBet.push(1)
         : (_historyBet.slice(1,_historyBet.length+1)).push(1)
        return -1;
    }
    _historyBet.length < 24 ? _historyBet.push(0)
     : (_historyBet.slice(1,_historyBet.length+1)).push(0)
}
function randomXX(){
    let randomInt, max = 6, min = 1;
    randomInt = Math.floor(((Math.random()*1000000)%max + min))
    return randomInt;
}
function randomMoneyAdd(){
    let randomMoney, max = 99999999, min= 10000;
    randomMoney = Math.floor((Math.random()*1000000000000 %max +min))
    return randomMoney;
}
let startCounter = async (timer)=>{
    let sessionID = await uid2(10);
    let betTimeOver = true;
    let waitResultTimeOver = false;
    let betTime = timer - 15;
    let waitResultTime = 15;
    timer = betTime;

    global._sessionID = sessionID
    global._betTimeOver = betTimeOver
    global._waitResultTimeOver = waitResultTimeOver
    global._betTime = betTime
    global._waitResultTime = waitResultTime
    global._timer = timer
    let x = setInterval(async function (){
        if (_betTimeOver && !_timer){ 
            _xx1 = randomXX(); 
            _xx2 = randomXX();
            _xx3 = randomXX();
            addToHistory(_xx1,_xx2,_xx3);
            console.log(_xx1, _xx2, _xx3);
            _timer = _waitResultTime;
            _betTimeOver = false;
            _waitResultTimeOver = true;
            // give money to all bets win
            await updateAllUser()
        }else if (_waitResultTimeOver && !_timer){
            _betsList = {}
            _sessionID = await uid2(10);
            // reset to empty
            _xiuBet =0;
            _taiBet =0;
            _timer = _betTime;
            _waitResultTimeOver = false;
            _betTimeOver = true;
        }
        else if (_betTimeOver){
            _xiuBet += randomMoneyAdd()
            _taiBet += randomMoneyAdd()
        }
        //console.log(_betsList);
        _timer--;
    }, 1000);
}
module.exports = {
    startCounter
}