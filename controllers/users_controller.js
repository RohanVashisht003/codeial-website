module.exports.profile = function(req, res){
    return res.end('<h1>User profile</h1>');
}

module.exports.msg = function(req, res){
    return res.end('<p>Hello From Rohan</p>');
}