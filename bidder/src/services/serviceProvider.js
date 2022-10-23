const bidderService = require('./bidder/bidderService');

const BIDDER_SERVICE = 'bidderService';

const initialBindings = {
    [BIDDER_SERVICE]: bidderService
};

const serviceProvider = {
    bindings: initialBindings,
    get(key) {
        return this.bindings[key]
    },
    set(key, value) {
        this.bindings[key] = value
    },
};

module.exports = {
    serviceProvider,
    BIDDER_SERVICE
}
