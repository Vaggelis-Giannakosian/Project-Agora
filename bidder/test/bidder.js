const chai = require("chai");
const chaiHttp = require('chai-http');
const nock = require('nock')
const server = require('../src/index');
const fs = require("fs");
const campaigns = JSON.parse(fs.readFileSync(__dirname + '/../../campaigns/campaigns.json'));
const bidGreece = JSON.parse(fs.readFileSync(__dirname + '/../../bid_greece.json'));
const bidUsa = JSON.parse(fs.readFileSync(__dirname + '/../../bid_usa.json'));

chai.use(chaiHttp);

// mock campaigns http request
const scope = nock(process.env.CAMPAIGNS_HOST)
    .persist()
    .get(process.env.CAMPAIGNS_ENDPOINT)
    .reply(200, {
        campaigns: campaigns
    })

describe("Test Bidder accepts only valid requests", function () {

    it("When not providing body", function (done) {
        chai.request(server)
            .post('/')
            .end((err, res) => {
                chai.expect(res).not.to.have.status(200);
                done();
            });
    });

    it("Given body but no content type header", function (done) {
        chai.request(server)
            .post('/')
            .send(Buffer.from(JSON.stringify(bidGreece)))
            .end((err, res) => {
                chai.expect(res).to.have.status(400);
                done();
            });
    });

    it("When not given bid id", function (done) {
        chai.request(server)
            .post('/')
            .set('Content-Type', 'application/octet-stream')
            .send(Buffer.from(JSON.stringify({
                "app": {},
                "device": {
                    "geo": {}
                }
            })))
            .end((err, res) => {
                chai.expect(res).to.have.status(400);
                done();
            });
    });

    it("When not given app info", function (done) {
        chai.request(server)
            .post('/')
            .set('Content-Type', 'application/octet-stream')
            .send(Buffer.from(JSON.stringify({
                "id":"0123456789ABCDEF0123456789ABCDEF",
                "device": {
                    "geo": {}
                }
            })))
            .end((err, res) => {
                chai.expect(res).to.have.status(400);
                done();
            });
    });

    it("When not given device info", function (done) {
        chai.request(server)
            .post('/')
            .set('Content-Type', 'application/octet-stream')
            .send(Buffer.from(JSON.stringify({
                "id":"0123456789ABCDEF0123456789ABCDEF",
                "app": {},
            })))
            .end((err, res) => {
                chai.expect(res).to.have.status(400);
                done();
            });
    });
});


describe("Test Bidder on valid requests", function () {

    describe("Test with bidGreece example", function () {
        it("is returning 200 status code", function (done) {
            chai.request(server)
                .post('/')
                .set('Content-Type', 'application/octet-stream')
                .send(Buffer.from(JSON.stringify(bidGreece)))
                .end((err, res) => {
                    chai.expect(res).to.have.status(200);
                    done();
                });
        });

        it("is returning 200 status code", function (done) {
            chai.request(server)
                .post('/')
                .set('Content-Type', 'application/octet-stream')
                .send(Buffer.from(JSON.stringify(bidGreece)))
                .end((err, res) => {
                    chai.expect(res).to.have.status(200);
                    chai.expect(res.body).to.eql({
                        id: bidGreece.id,
                        campaign_id: '1',
                        price: 10,
                        ad_creative: '<script>...</script>'
                    });
                    done();
                });
        });
    });


    describe("Test with bidUsa example", function () {
        it("is returning 200 status code", function (done) {
            chai.request(server)
                .post('/')
                .set('Content-Type', 'application/octet-stream')
                .send(Buffer.from(JSON.stringify(bidUsa)))
                .end((err, res) => {
                    chai.expect(res).to.have.status(200);
                    chai.expect(res.body).to.eql({
                        id: bidUsa.id,
                        campaign_id: '2',
                        price: 8,
                        ad_creative: '<script>...</script>'
                    });
                    done();
                });
        });
    });
});
