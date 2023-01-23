async function checkCurrentSession(req, res, next) {
    const userQuerySession = req.query.session_id;
    if (userQuerySession == _sessionID){
        return next();
    }
    return res.status(400).json({
        status : 'Unsuccess',
        message : 'Bad request'
    })
}
module.exports = {
    checkCurrentSession
}