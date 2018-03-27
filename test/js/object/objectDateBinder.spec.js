var binder = require('../../../src/binder');
var createUpdater = require('../utils/createUpdater');
var createValueBinderTests = require('../utils/createValueBinderTests');

var updater = createUpdater();
updater.initialValue = new Date(2010, 1, 2);
updater.alternativeValue = new Date(2011, 5, 6);
updater.isValueBinder = true;
updater.hasValue = true;
updater.hasParent = true;
updater.key = 'content';
updater.binder = binder({initial: 'initial_value', content: updater.initialValue, final: 'final_value'}, updater, updater.initializer);
updater.getBinder = function() {
    return this.binder.content;
};

createValueBinderTests(updater);
