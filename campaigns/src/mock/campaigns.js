const {faker} = require('@faker-js/faker');

// you can write your own mock logic here
module.exports = {
    'POST /api/campaigns': (req, res) => {
        if (Math.random() > .6) return res.json({})

        res.json({
            campaign: {
                id: faker.datatype.uuid(),
                price: faker.datatype.number({min: 1, max: 30}),
                ad_creative: "<script>...</script>"
            },
        });
    },
};
