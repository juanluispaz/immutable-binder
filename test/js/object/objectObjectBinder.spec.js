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
updater.key = 'content';
updater.binder = binder({initial: 'initial_value', content: updater.initialValue, final: 'final_value'}, updater, updater.initializer);
updater.getBinder = function() {
    return this.binder.content;
};

createMapBinderTests(updater);
