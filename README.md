# furg  [![Build Status](https://travis-ci.org/seriousManual/furg.png)](https://travis-ci.org/seriousManual/furg)

[![NPM](https://nodei.co/npm/furg.png)](https://nodei.co/npm/furg/)

[![NPM](https://nodei.co/npm-dl/furg.png?months=3)](https://nodei.co/npm/furg/)

basic depenency injection framework

## usage

````javascript
var assert = require('assert');

var Injector = require('furg');

function Foo (bar) {
    this._bar = bar;
}

function Bar (a) {
    this._a = a;
}

var i = new Injector();

//register constructors
i.register('foo', Foo);
i.register('bar', Bar);

//register scalar values
i.register('a', {foo: 'bar'});

//create objects
var created = i.create('foo');

assert(created instanceof Foo);
assert(created._bar instanceof Bar);
assert(created._bar._a.foo === 'bar');

//use a assigned constructor and equip with dependencies
var created2 = i.equip(function(foo, bar, a) {
    this._foo = foo;
    this._bar = bar;
    this._a = a;
});

assert(created2._foo instanceof Foo);
assert(created2._bar instanceof Bar);
assert(created2._a.foo === 'bar');

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

i.register('fff', MyFactory);

//create via factory
var created3 = i.create('fff');

assert(created3.asdfasdf instanceof Foo);
assert(created3.jkloejkloe instanceof Bar);
assert(created3.jkloejkloe._a.foo === 'bar');
````


## furg?
A furg is a hairy creature that likes to bang its head into the ground and fling its excrements about.
(I recommend to have a look at [The Legend Of Zero](https://www.goodreads.com/series/103017-the-legend-of-zero))
