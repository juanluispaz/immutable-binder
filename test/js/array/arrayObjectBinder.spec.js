var binder = require('../../../src/binder');
var createUpdater = require('../utils/createUpdater');
var createMapBinderTests = require('../utils/createMapBinderTests');

var updater = createUpdater();
updater.initialValue = {a: 1, b: 2};
updater.alternativeValue = {c: 3, d: 4};
updater.isMapBinder = true;
updater.isObjectBinder = true;
updater.hasValue = true;
updater.hasParent = true;
updater.key = 1;
updater.binder = binder(['initial', updater.initialValue, 'final'], updater, updater.initializer);
updater.getBinder = function() {
    return this.binder[1];
};

createMapBinderTests(updater);
