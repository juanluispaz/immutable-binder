/*global expect*/
var createAbstractBinderTests = require('./createAbstractBinderTests');

function createValueBinderTests(updater) {
    createAbstractBinderTests(updater);

    test('has no properties', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue);
        
        var hasProperties = false;
        for (var key in updater.getBinder()) {
            hasProperties = true;
        }
        expect(hasProperties).toBe(false);
    });
}
module.exports = createValueBinderTests;