const url = require('url');

exports.getUserList = function (req, res) {
    const reqUrl = url.parse(req.url, true);
    

    var response = {
        "success": true,
        "users":allUsersList
    };

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response));
};