var util = require('util');

var expect = require('chai').use(require('sinon-chai')).expect;
var sinon = require('sinon');

var Injector = require('../furg');

function Problematic (problematic) {
}
function Problematic2 (notFound) {
}

function Foo (bar) {
    this._bar = bar;
}

Foo.prototype.get = function () {
    return this._bar;
};


function Bar (a) {
    this._a = a;
}

Bar.prototype.get = function () {
    return this._a;
};

function IHavNoDeps() {}

function MyFactory(foo, bar) {
    Injector.Factory.call(this);

    this._foo = foo;
    this._bar = bar;
}

util.inherits(MyFactory, Injector.Factory);

MyFactory.prototype.create = function() {
    return {
        asdfasdf: this._foo,
        jkloejkloe: this._bar
    };
};

function FailFactory() {
    Injector.Factory.call(this);
}

util.inherits(FailFactory, Injector.Factory);

describe('di', function () {
    describe('injector simple', function () {
        var i, created;

        before(function () {
            i = new Injector();
            i.register('a', {foo: 'bar'});
            i.register('bar', Bar);

            created = i.create('bar');
        });

        it('should return a instance of Bar', function () {
            expect(created).to.be.an.instanceof(Bar);
        });

        it('should inject correctly', function () {
            expect(created.get()).to.deep.equal({foo: 'bar'});
        });
    });

    describe('injector no deps', function () {
        var i, created;

        before(function () {
            i = new Injector();

            created = i.equip(IHavNoDeps);
        });

        it('should return a instance of Bar', function () {
            expect(created).to.be.an.instanceof(IHavNoDeps);
        });
    });

    describe('injector nested', function () {
        var i, created;

        before(function () {
            i = new Injector();
            i.register('foo', Foo);
            i.register('bar', Bar);
            i.register('a', {foo: 'bar'});

            created = i.create('foo');
        });

        it('should return a instance of Foo', function () {
            expect(created).to.be.an.instanceof(Foo);
        });

        it('should inject correctly (firstStep)', function () {
            expect(created.get()).to.be.an.instanceof(Bar);
        });

        it('should inject correctly', function () {
            expect(created.get().get()).to.deep.equal({foo: 'bar'});
        });
    });

    describe('injector cache', function () {
        var i, created;

        before(function () {
            i = new Injector();
            i.register('bar', Bar);
            i.register('a', {foo: 'bar'});

            sinon.spy(i, '_createEntity');

            created = i.create('bar');
            created = i.create('bar');
            created = i.create('bar');
        });

        it('should only create once', function () {
            expect(i._createEntity).to.be.calledOnce;
        });
    });

    describe('circular', function () {
        var i, created;

        before(function () {
            i = new Injector();
            i.register('problematic', Problematic);
        });

        it('should only create once', function () {
            expect(function () {
                created = i.create('problematic');
            }).to.throw('circular dependency detected');
        });
    });

    describe('unmet dependency', function () {
        var i, created;

        before(function () {
            i = new Injector();
            i.register('problematic2', Problematic2);
        });

        it('should only create once', function () {
            expect(function () {
                created = i.create('problematic');
            }).to.throw('unmet dependency: problematic');
        });
    });

    describe('equip', function () {
        var i, created;

        before(function () {
            i = new Injector();
            i.register('a', {foo: 'bar'});

            created = i.equip(Bar);
        });

        it('should be instance of Bar', function () {
            expect(created).to.be.instanceof(Bar);
        });

        it('should be equipped', function () {
            expect(created.get()).to.deep.equal({foo: 'bar'});
        });
    });

    describe('equip of anonymous function', function () {
        var i, created;

        before(function () {
            i = new Injector();
            i.register('foo', Foo);
            i.register('bar', Bar);
            i.register('a', {foo: 'bar'});

            created = i.equip(function(foo, bar, a) {
                this._foo = foo;
                this._bar = bar;
                this._a = a;
            });
        });

        it('should be equipped', function () {
            expect(created._foo).to.be.instanceOf(Foo);
            expect(created._bar).to.be.instanceOf(Bar);
            expect(created._a).to.deep.equal({foo: 'bar'});
        });
    });

    describe('Factory', function() {
        var i, created;

        before(function () {
            i = new Injector();
            i.register('foo', Foo);
            i.register('bar', Bar);
            i.register('a', 'asdf');
            i.register('factory', MyFactory);

            created = i.create('factory');
        });

        it('should create a instance via a factory', function() {
            expect(created.asdfasdf).to.be.instanceOf(Foo);
            expect(created.jkloejkloe).to.be.instanceOf(Bar);
            expect(created.jkloejkloe._a).to.equal('asdf');
        });
    });

    describe('nonInstance', function() {
        var i, created;

        before(function () {
            i = new Injector();
            i.register('failFactory', FailFactory);
        });

        it('should create a instance via a factory', function() {
            expect(function() {
                i.create('failFactory');
            }).to.throw(/create has to be implemented/);
        });
    });
});