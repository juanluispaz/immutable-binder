var binder = require('../../../src/binder');
var createUpdater = require('../utils/createUpdater');
var createValueBinderTests = require('../utils/createValueBinderTests');

var updater = createUpdater();
updater.initialValue = 10;
updater.alternativeValue = 11;
updater.isValueBinder = true;
updater.hasValue = true;
updater.hasParent = true;
updater.key = 1;
updater.binder = binder(['initial', updater.initialValue, 'final'], updater, updater.initializer);
updater.getBinder = function() {
    return this.binder[1];
};

createValueBinderTests(updater);
