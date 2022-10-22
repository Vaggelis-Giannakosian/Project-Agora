const fs = require('fs');
const campaigns = JSON.parse(fs.readFileSync(__dirname + '../../../../campaigns.json'));


module.exports = {
    'GET /api/campaigns': (req, res) => {
        return res.json({
            campaigns: campaigns,
        });
    },
};
