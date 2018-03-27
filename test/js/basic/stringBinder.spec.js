var binder = require('../../../src/binder');
var createUpdater = require('../utils/createUpdater');
var createValueBinderTests = require('../utils/createValueBinderTests');

var updater = createUpdater();
updater.initialValue = 'old';
updater.alternativeValue = 'new';
updater.isValueBinder = true;
updater.hasValue = true;
updater.hasParent = false;
updater.key = null;
updater.binder = binder(updater.initialValue, updater, updater.initializer);
updater.getBinder = function() {
    return this.binder;
};

createValueBinderTests(updater);
