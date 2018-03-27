/*global expect*/
var binder = require('../../../src/binder');
var testUpdateBinder = require('./testUpdateBinder');

function sameProps(obj1, obj2) {
    for (var key in obj1) {
        expect(obj2[key]).toBe(obj1[key]);
    }
    for (var key in obj2) {
        expect(obj1[key]).toBe(obj2[key]);
    }
}

function differentProps(obj1, obj2) {
    for (var key in obj1) {
        expect(obj2[key]).not.toBe(obj1[key]);
    }
    for (var key in obj2) {
        expect(obj1[key]).not.toBe(obj2[key]);
    }
}

function createAbstractBinderTests(updater) {

    test('is binder', function() {
        expect(updater.getBinder()).toBeInstanceOf(binder);
    });
    test('getValue method', function() {
        expect(updater.getBinder().getValue()).toBe(updater.initialValue);
    });
    test('toString method', function() {
        var initialValue = updater.initialValue;
        var str;
        if (initialValue === null || initialValue === undefined) {
            str = initialValue + '';
        } else {
            str = initialValue.toString();
        }
        expect(updater.getBinder().toString()).toBe(str);
    });
    test('toLocaleString method', function() {
        var initialValue = updater.initialValue;
        var str;
        if (initialValue === null || initialValue === undefined) {
            str = initialValue + '';
        } else {
            str = initialValue.toLocaleString('ar');
        }
        expect(updater.getBinder().toLocaleString('ar')).toBe(str);
    });
    test('hasValue method', function() {
        expect(updater.getBinder().hasValue()).toBe(!!updater.hasValue);
    });
    test('_ method', function() {
        expect(updater.getBinder()._()).toBe(updater.getBinder());
    });
    test('getExtras method', function() {
        expect(updater.getBinder().getExtras()).toBeInstanceOf(Object);
    });
    test('getParent method', function() {
        if (updater.hasParent) {
            expect(updater.getBinder().getParent()).toBeInstanceOf(binder);
        } else {
            expect(updater.getBinder().getParent()).toBe(null);
        }
    });
    test('getKey method', function() {
        expect(updater.getBinder().getKey()).toBe(updater.key);
    });
    test('isValidBinder method', function() {
        expect(updater.getBinder().isValidBinder()).toBe(true);
    });
    test('isValueBinder method', function() {
        expect(updater.getBinder().isValueBinder()).toBe(!!updater.isValueBinder);
    });
    test('isMapBinder method', function() {
        expect(updater.getBinder().isMapBinder()).toBe(!!updater.isMapBinder);
    });
    test('isObjectBinder method', function() {
        expect(updater.getBinder().isObjectBinder()).toBe(!!updater.isObjectBinder);
    });
    test('isArrayBinder method', function() {
        expect(updater.getBinder().isArrayBinder()).toBe(!!updater.isArrayBinder);
    });
    test('setValue method same value', function() {
        updater.updated = false;
        var oldBinder = updater.getBinder();
        var extras = oldBinder.getExtras();
        
        var b = oldBinder.setValue(updater.initialValue);
        
        expect(b).toBeInstanceOf(binder);
        expect(b).toBe(oldBinder);
        expect(b).toBe(updater.getBinder());
        expect(updater.updated).toBe(false);
        expect(b.isValidBinder()).toBe(true);
        expect(oldBinder.isValidBinder()).toBe(true);
        
        expect(b.getExtras()).toBe(extras);
        expect(oldBinder.getExtras()).toBe(extras);
        
        expect(b.getValue()).toBe(updater.initialValue);
        sameProps(oldBinder, b);
    });
    test('setValue method different value', function() {
        var oldBinder = updater.getBinder();
        var b = testUpdateBinder(updater, function() {
            return oldBinder.setValue(updater.alternativeValue);
        });
        
        expect(b.getValue()).toBe(updater.alternativeValue);
        differentProps(oldBinder, b);
    });
    test('setValue method same value forced', function() {
        updater.updated = false;
        var oldBinder = updater.getBinder().setValue(updater.initialValue);
        
        var b = testUpdateBinder(updater, function() {
            return oldBinder.setValue(updater.initialValue, true);
        });
        
        expect(b.getValue()).toBe(updater.initialValue);
        sameProps(oldBinder, b);
    });
    test('updateExtrasInCurrentBinder', function() {
        var b = updater.getBinder();
        b.updateExtrasInCurrentBinder({temporal: 1}, {permanent: 11});
        var extras = b.getExtras();
        expect(extras.temporal).toBe(1);
        expect(extras.permanent).toBe(11);
        
        updater.updated = false;
        b = b.setValue('other');
        extras = b.getExtras();
        expect(extras.temporal).toBeUndefined();
        expect(extras.permanent).toBe(11);
    });
    test('updateExtras with no changes', function() {
        updater.updated = false;
        var oldBinder = updater.getBinder();
        var value = oldBinder.getValue();
        oldBinder.updateExtrasInCurrentBinder({temporalExtra: 3}, {permanentExtra: 33});
        var extras = oldBinder.getExtras();
        
        var b = oldBinder.updateExtras({temporalExtra: 3}, {permanentExtra: 33});
        
        expect(b).toBeInstanceOf(binder);
        expect(b).toBe(oldBinder);
        expect(b).toBe(updater.getBinder());
        expect(updater.updated).toBe(false);
        expect(b.isValidBinder()).toBe(true);
        expect(oldBinder.isValidBinder()).toBe(true);
        
        expect(b.getExtras()).toBe(extras);
        expect(oldBinder.getExtras()).toBe(extras);
        
        expect(b.getValue()).toBe(value);
        expect(b.getExtras().temporalExtra).toBe(3);
        expect(b.getExtras().permanentExtra).toBe(33);
        sameProps(oldBinder, b);
    });
    test('updateExtras with changes', function() {
        var value = updater.getBinder().getValue();
        var oldBinder = updater.getBinder();
        oldBinder.updateExtrasInCurrentBinder({temporalExtra: 2}, {permanentExtra: 22});
        
        var b = testUpdateBinder(updater, function() {
            return oldBinder.updateExtras({temporalExtra: 4}, {permanentExtra: 44});
        });
        
        expect(b.getValue()).toBe(value);
        expect(b.getExtras().temporalExtra).toBe(4);
        expect(b.getExtras().permanentExtra).toBe(44);
        expect(oldBinder.getExtras().temporalExtra).toBe(2);
        expect(oldBinder.getExtras().permanentExtra).toBe(22);
        sameProps(oldBinder, b);
    });
    test('updateExtras method with no changes forced', function() {
        updater.updated = false;
        var oldBinder = updater.getBinder().setValue(updater.initialValue);
        oldBinder.updateExtrasInCurrentBinder({temporalExtra: 2}, {permanentExtra: 22});
        
        var b = testUpdateBinder(updater, function() {
            return oldBinder.updateExtras({temporalExtra: 2}, {permanentExtra: 22}, true);
        });
        
        expect(b.getValue()).toBe(updater.initialValue);
        expect(b.getExtras().temporalExtra).toBe(2);
        expect(b.getExtras().permanentExtra).toBe(22);
        sameProps(oldBinder, b);
    });
    test('setValueAndUpdateExtras method same value no extras changes', function() {
        updater.updated = false;
        var oldBinder = updater.getBinder();
        var extras = oldBinder.getExtras();
        oldBinder.updateExtrasInCurrentBinder({temporalExtra: 2}, {permanentExtra: 22});
        
        var b = oldBinder.setValueAndUpdateExtras(updater.initialValue);
        
        expect(b).toBeInstanceOf(binder);
        expect(b).toBe(oldBinder);
        expect(b).toBe(updater.getBinder());
        expect(updater.updated).toBe(false);
        expect(b.isValidBinder()).toBe(true);
        expect(oldBinder.isValidBinder()).toBe(true);
        
        expect(b.getExtras()).toBe(extras);
        expect(oldBinder.getExtras()).toBe(extras);
        
        expect(b.getValue()).toBe(updater.initialValue);
        expect(b.getExtras().temporalExtra).toBe(2);
        expect(b.getExtras().permanentExtra).toBe(22);
        sameProps(oldBinder, b);
    });
    test('setValueAndUpdateExtras method different value no extras changes', function() {
        updater.updated = false;
        var oldBinder = updater.getBinder().setValue(updater.initialValue);
        oldBinder.updateExtrasInCurrentBinder(undefined, {permanentExtra: 14});
        
        var b = testUpdateBinder(updater, function() {
            return oldBinder.setValueAndUpdateExtras(updater.alternativeValue, undefined, {permanentExtra: 14});
        });
        
        expect(b.getValue()).toBe(updater.alternativeValue);
        expect(b.getExtras().permanentExtra).toBe(14);
        differentProps(oldBinder, b);
    });
    test('setValueAndUpdateExtras same value with extra changes (temporal)', function() {
        var value = updater.getBinder().getValue();
        var oldBinder = updater.getBinder();
        oldBinder.updateExtrasInCurrentBinder({temporalExtra: 15});
        
        var b = testUpdateBinder(updater, function() {
            return oldBinder.setValueAndUpdateExtras(value, {temporalExtra: 16});
        });
        
        expect(b.getValue()).toBe(value);
        expect(b.getExtras().temporalExtra).toBe(16);
        expect(oldBinder.getExtras().temporalExtra).toBe(15);
        sameProps(oldBinder, b);
    });
    test('setValueAndUpdateExtras same value with extra changes (permanent)', function() {
        var value = updater.getBinder().getValue();
        var oldBinder = updater.getBinder();
        oldBinder.updateExtrasInCurrentBinder(undefined, {permanentExtra: 151});
        
        var b = testUpdateBinder(updater, function() {
            return oldBinder.setValueAndUpdateExtras(value, undefined, {permanentExtra: 161});
        });
        
        expect(b.getValue()).toBe(value);
        expect(b.getExtras().permanentExtra).toBe(161);
        expect(oldBinder.getExtras().permanentExtra).toBe(151);
        sameProps(oldBinder, b);
    });
    test('setValueAndUpdateExtras method different value with extras changes', function() {
        updater.updated = false;
        var oldBinder = updater.getBinder().setValue(updater.initialValue);
        oldBinder.updateExtrasInCurrentBinder({temporalExtra: 17}, {permanentExtra: 171});
        
        var b = testUpdateBinder(updater, function() {
            return oldBinder.setValueAndUpdateExtras(updater.alternativeValue, {temporalExtra: 18}, {permanentExtra: 181});
        });
        
        expect(b.getValue()).toBe(updater.alternativeValue);
        expect(b.getExtras().temporalExtra).toBe(18);
        expect(b.getExtras().permanentExtra).toBe(181);
        expect(oldBinder.getExtras().temporalExtra).toBe(17);
        expect(oldBinder.getExtras().permanentExtra).toBe(171);
        differentProps(oldBinder, b);
    });
    test('setValueAndUpdateExtras method same values with no extras changes forced', function() {
        updater.updated = false;
        var oldBinder = updater.getBinder().setValue(updater.initialValue);
        oldBinder.updateExtrasInCurrentBinder({temporalExtra: 19}, {permanentExtra: 191});
        
        var b = testUpdateBinder(updater, function() {
            return oldBinder.setValueAndUpdateExtras(updater.initialValue, {temporalExtra: 19}, {permanentExtra: 191}, true);
        });
        
        expect(b.getValue()).toBe(updater.initialValue);
        expect(b.getExtras().temporalExtra).toBe(19);
        expect(b.getExtras().permanentExtra).toBe(191);
        sameProps(oldBinder, b);
    });
    test('getDerivedFrom method returns null', function() {
        updater.updated = false;
        var b = updater.getBinder().setValue(updater.initialValue);
        expect(b.getDerivedFrom()).toBe(null);
    });
}
module.exports = createAbstractBinderTests;