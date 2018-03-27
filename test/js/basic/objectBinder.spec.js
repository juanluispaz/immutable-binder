var binder = require('../../../src/binder');
var createUpdater = require('../utils/createUpdater');
var createMapBinderTests = require('../utils/createMapBinderTests');

var updater = createUpdater();
updater.initialValue = {a: 1, b: 2};
updater.alternativeValue = {c: 3, d: 4};
updater.isMapBinder = true;
updater.isObjectBinder = true;
updater.hasValue = true;
updater.hasParent = false;
updater.key = null;
updater.binder = binder(updater.initialValue, updater, updater.initializer);
updater.getBinder = function() {
    return this.binder;
};

createMapBinderTests(updater);
