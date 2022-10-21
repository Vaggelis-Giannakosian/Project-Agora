// you can write your own mock logic here
module.exports = {
    'POST /api/campaigns': (req, res) => {
        //TODO not implemented
        const { userName, password } = req.body;
        if (userName === 'bob' && password === 'password') {
            res.send({
                success: true,
            });
        } else {
            res.send({
                success: false,
            });
        }
    },
};
