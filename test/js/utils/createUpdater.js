/*global expect*/
var binder = require('../../../src/binder');

function createUpdater() {
    function updater(newRootBinder, newBinder, oldBinder) {
        updater.binder = newRootBinder;
        
        if (updater.updated) {
            throw new Error('Update function has been called multiple times');
        }
        
        updater.updated = true;
        
        if (!newRootBinder.getExtras()) {
            throw new Error('Upate function received unfinized binder');
        }
        
        if (!newRootBinder.getExtras()._$postInit) {
            throw new Error('Update function received an internal binder instedad of a root binder');
        }
        
        expect(newRootBinder).toBeInstanceOf(binder);
        expect(newRootBinder.isValidBinder()).toBe(true);
        
        expect(newBinder).toBeInstanceOf(binder);
        expect(newBinder.isValidBinder()).toBe(true);
        
        expect(oldBinder).toBeInstanceOf(binder);
        expect(oldBinder.isValidBinder()).toBe(false);
    }
    
    updater.initializer = function(newValue, oldBinder) {
        if (!oldBinder.isValidBinder()) {
            return newValue;
        }
        updater.initializerNewValue = newValue;
        updater.initialierOldBinder = oldBinder;
        return newValue;
    }
    return updater;
}
module.exports = createUpdater;