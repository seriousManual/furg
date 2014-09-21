# furg  [![Build Status](https://travis-ci.org/zaphod1984/furg.png)](https://travis-ci.org/zaphod1984/furg)

basic depenency injection framework

## usage

````javascript
var Injector = require('furg');

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

var i = new Injector();

//register constructors
i.register('foo', Foo);
i.register('bar', Bar);

//register scalar values
i.register('a', {foo: 'bar'});

//create objects
var created = i.create('foo');

//use a assigned constructor and equip with dependencies
var created2 = i.equip(function(foo, bar, a) {});
````

## furg?
A furg is a hairy creature that likes to bang its head into the ground and fling its excrements about.
(I recommend to have a look at [The Legend Of Zero](https://www.goodreads.com/series/103017-the-legend-of-zero))
