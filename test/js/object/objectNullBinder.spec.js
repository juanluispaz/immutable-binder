var binder = require('../../../src/binder');
var createUpdater = require('../utils/createUpdater');
var createValueBinderTests = require('../utils/createValueBinderTests');

var updater = createUpdater();
updater.initialValue = null;
updater.alternativeValue = 'null';
updater.isValueBinder = true;
updater.hasValue = false;
updater.hasParent = true;
updater.key = 'content';
updater.binder = binder({initial: 'initial_value', content: updater.initialValue, final: 'final_value'}, updater, updater.initializer);
updater.getBinder = function() {
    return this.binder.content;
};

createValueBinderTests(updater);
