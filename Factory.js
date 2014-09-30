function Factory() {

}

Factory.prototype.create = function() {
    throw new Error('create has to be implemented');
};

module.exports = Factory;