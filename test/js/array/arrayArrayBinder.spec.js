var binder = require('../../../src/binder');
var createUpdater = require('../utils/createUpdater');
var createArrayBinderTests = require('../utils/createArrayBinderTests');

var updater = createUpdater();
updater.initialValue = ['1v', '2v', '3v', '4v'];
updater.alternativeValue = ['5v', '6v'];
updater.isArrayBinder = true;
updater.hasValue = true;
updater.hasParent = true;
updater.key = 1;
updater.binder = binder(['initial', updater.initialValue, 'final'], updater, updater.initializer);
updater.getBinder = function() {
    return this.binder[1];
};

createArrayBinderTests(updater);
