/*global expect*/
var binder = require('../../../src/binder');

function setExtras(extrasInBinders, binder) {
    var b = binder;
    var i = 0;
    while (b) {
        var extra = {};
        extra['extra_content_' + i] = 'extra_value_' + i;
        
        b.getExtras()['extras_' + i] = extra;
        extrasInBinders.push(extra);
        i++;
        b = b.getParent();
    }    
}

function checkExtras(extrasInBinders, binder) {
    var b = binder;
    var i = 0;
    while (b) {
        expect(b.getExtras()['extras_' + i]).toBe(extrasInBinders[i]);
        i++;
        b = b.getParent();
    }    
}

function testUpdateBinder(updater, update, getBinder) {
    if (!getBinder) {
        getBinder = function() {
            return updater.getBinder();
        };
    }
    
    updater.updated = false;
    var oldBinder = getBinder();

    var extrasInBinders = [];
    setExtras(extrasInBinders, oldBinder);

    var b = update(oldBinder);
    var newBinder = getBinder();
    
    expect(b).not.toBe(undefined);
    expect(b).not.toBe(null);
    expect(b).toBeInstanceOf(binder);
    expect(b).toBe(newBinder);
    expect(b.isValidBinder()).toBe(true);
    expect(b).not.toBe(oldBinder);
    expect(updater.updated).toBe(true);
    
    var newB = newBinder;
    var oldB = oldBinder;
    while (newB && oldB) {
        expect(newB.isValidBinder()).toBe(true);
        expect(oldB.isValidBinder()).toBe(false);
        
        expect(newB).not.toBe(oldB);
        
        expect(function() {
            oldB.setValue({});
        }).toThrow('You are trying to update an old binder');
        
        var oldExtras = oldB.getExtras();
        expect(oldExtras._$parent).toBe(null);
        expect(oldExtras._$key).toBe(null);
        expect(oldExtras._$validBinder).toBe(false);
        expect(oldExtras._$contentUpdater).toBe(undefined);
        expect(oldExtras._$initValue).toBe(undefined);
        expect(oldExtras._$postInit).toBe(undefined);
        
        newB = newB.getParent();
        oldB = oldB.getParent();
    }
    
    expect(updater.updated).toBe(true);
    expect(updater.binder.getParent()).toBe(null);

    checkExtras(extrasInBinders, newBinder);
    
    expect(updater.initialierOldBinder).toBe(oldBinder);
    expect(updater.initializerNewValue).toBe(newBinder.getValue());
    
    if (b.isArrayBinder() || b.isMapBinder()) {
        var value = b.getValue();
        
        for (var key in value) {
            expect(b[key]).toBeInstanceOf(binder);
            expect(b[key].getValue()).toBe(value[key]);
        }
        
        for (var key in b) {
            expect(b[key]).toBeInstanceOf(binder);
            expect(b[key].getValue()).toBe(value[key]);
            if (b.isArrayBinder() && key >= 0 && key < value.length) {
                // omit, all index positions mus exists even if it doesn't exists in the original array (spread array)
            } else {
                expect(value).toHaveProperty(key);
            }
        }
    } else {
        for (var key in b) {
            throw new Error('properties found in a value binder which must have no properties');
        }
    }
    
    return b;
}
module.exports = testUpdateBinder;