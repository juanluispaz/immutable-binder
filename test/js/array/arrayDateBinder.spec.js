var binder = require('../../../src/binder');
var createUpdater = require('../utils/createUpdater');
var createValueBinderTests = require('../utils/createValueBinderTests');

var updater = createUpdater();
updater.initialValue = new Date(2010, 1, 2);
updater.alternativeValue = new Date(2011, 5, 6);
updater.isValueBinder = true;
updater.hasValue = true;
updater.hasParent = true;
updater.key = 1;
updater.binder = binder(['initial', updater.initialValue, 'final'], updater, updater.initializer);
updater.getBinder = function() {
    return this.binder[1];
};

createValueBinderTests(updater);
