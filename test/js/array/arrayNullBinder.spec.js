var binder = require('../../../src/binder');
var createUpdater = require('../utils/createUpdater');
var createValueBinderTests = require('../utils/createValueBinderTests');

var updater = createUpdater();
updater.initialValue = null;
updater.alternativeValue = 'null';
updater.isValueBinder = true;
updater.hasValue = false;
updater.hasParent = true;
updater.key = 1;
updater.binder = binder(['initial', updater.initialValue, 'final'], updater, updater.initializer);
updater.getBinder = function() {
    return this.binder[1];
};

createValueBinderTests(updater);
