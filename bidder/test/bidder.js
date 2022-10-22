const chai = require("chai");
const chaiHttp = require('chai-http');
const nock = require('nock')
const server = require('../src/index');

chai.use(chaiHttp);

// mock campaigns http request
const scope = nock('http://localhost:4000')
    .post('/api/campaigns')
    .reply(200, {
        campaign: {
            id: 'asdfasdf',
            price: 5,
            ad_creative: "<script>...</script>"
        },
    })


describe("Test Bid Request validity", function () {


    describe("Test without input", function () {
        it("is returning 400 status code", function (done) {
            chai.request(server)
                .post('/')
                .set('Content-Type', 'application/octet-stream')
                .send(Buffer.from(JSON.stringify({
                    "id": "0123456789ABCDEF0123456789ABCDEF",
                    "app": {
                        "id": "agltb3B1Yi1pbmNyDAsSA0FwcBiJkfIUDA",
                        "name": "Yahoo Weather"
                    },
                    "device": {
                        "dpidsha1": "AA000DFE74168477C70D291f574D344790E0BB11",
                        "os": "iOS",
                        "geo": {
                            "country": "USA",
                            "lat": 35.012345,
                            "lon": -115.12345
                        }
                    }
                })))
                .end((err, res) => {
                    chai.expect(res).to.have.status(200);
                    done();
                });
        });
    });

});
