var binder = require('../../../src/binder');
var createUpdater = require('../utils/createUpdater');
var createValueBinderTests = require('../utils/createValueBinderTests');

var updater = createUpdater();
updater.initialValue = new Date(2010, 1, 2);
updater.alternativeValue = new Date(2011, 5, 6);
updater.isValueBinder = true;
updater.hasValue = true;
updater.hasParent = false;
updater.key = null;
updater.binder = binder(updater.initialValue, updater, updater.initializer);
updater.getBinder = function() {
    return this.binder;
};

createValueBinderTests(updater);
