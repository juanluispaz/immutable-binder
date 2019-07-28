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
    test('is binder function', function() {
        expect(binder.isBinder(updater.getBinder())).toBe(true);
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
    test('setEditedValueByTheUser method same value', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: false, _$editedByTheUser: false});
        updater.updated = false;

        var oldBinder = updater.getBinder();
        var extras = oldBinder.getExtras();
        var b = oldBinder.setEditedValueByTheUser(updater.initialValue);
        
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

        expect(b.wasTouchedByTheUser()).toBe(false);
        expect(b.wasEditedByTheUser()).toBe(false);
    });
    test('setEditedValueByTheUser method different value', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: false, _$editedByTheUser: false});
        updater.updated = false;

        var oldBinder = updater.getBinder();
        var b = testUpdateBinder(updater, function() {
            return oldBinder.setEditedValueByTheUser(updater.alternativeValue);
        });
        
        expect(b.getValue()).toBe(updater.alternativeValue);
        differentProps(oldBinder, b);

        expect(b.wasTouchedByTheUser()).toBe(false);
        expect(b.wasEditedByTheUser()).toBe(true);
    });
    test('setEditedValueByTheUser method same value forced', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: false, _$editedByTheUser: false});
        updater.updated = false;

        var oldBinder = updater.getBinder();
        var b = testUpdateBinder(updater, function() {
            return oldBinder.setEditedValueByTheUser(updater.initialValue, true);
        });
        
        expect(b.getValue()).toBe(updater.initialValue);
        sameProps(oldBinder, b);

        expect(b.wasTouchedByTheUser()).toBe(false);
        expect(b.wasEditedByTheUser()).toBe(true);
    });
    test('setValue method same value', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: false, _$editedByTheUser: false});
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

        expect(b.wasTouchedByTheUser()).toBe(false);
        expect(b.wasEditedByTheUser()).toBe(false);
    });
    test('setValue method different value', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: true, _$editedByTheUser: true});
        updater.updated = false;

        var oldBinder = updater.getBinder();
        var b = testUpdateBinder(updater, function() {
            return oldBinder.setValue(updater.alternativeValue);
        });
        
        expect(b.getValue()).toBe(updater.alternativeValue);
        differentProps(oldBinder, b);

        expect(b.wasTouchedByTheUser()).toBe(true);
        expect(b.wasEditedByTheUser()).toBe(true);
    });
    test('setValue method same value forced', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: true, _$editedByTheUser: true});
        updater.updated = false;
        
        var oldBinder = updater.getBinder();
        var b = testUpdateBinder(updater, function() {
            return oldBinder.setValue(updater.initialValue, true);
        });
        
        expect(b.getValue()).toBe(updater.initialValue);
        sameProps(oldBinder, b);

        expect(b.wasTouchedByTheUser()).toBe(true);
        expect(b.wasEditedByTheUser()).toBe(true);
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
    test('setEditedValueByTheUserAndUpdateExtras method same value no extras changes', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: false, _$editedByTheUser: false});
        updater.updated = false;
        
        var oldBinder = updater.getBinder();
        var extras = oldBinder.getExtras();
        oldBinder.updateExtrasInCurrentBinder({temporalExtra: 2}, {permanentExtra: 22});
        
        var b = oldBinder.setEditedValueByTheUserAndUpdateExtras(updater.initialValue);
        
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

        expect(b.wasTouchedByTheUser()).toBe(false);
        expect(b.wasEditedByTheUser()).toBe(false);
    });
    test('setEditedValueByTheUserAndUpdateExtras method different value no extras changes', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: false, _$editedByTheUser: false});
        updater.updated = false;

        var oldBinder = updater.getBinder();
        oldBinder.updateExtrasInCurrentBinder(undefined, {permanentExtra: 14});
        
        var b = testUpdateBinder(updater, function() {
            return oldBinder.setEditedValueByTheUserAndUpdateExtras(updater.alternativeValue, undefined, {permanentExtra: 14});
        });
        
        expect(b.getValue()).toBe(updater.alternativeValue);
        expect(b.getExtras().permanentExtra).toBe(14);
        differentProps(oldBinder, b);

        expect(b.wasTouchedByTheUser()).toBe(false);
        expect(b.wasEditedByTheUser()).toBe(true);
    });
    test('setEditedValueByTheUserAndUpdateExtras same value with extra changes (temporal)', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: false, _$editedByTheUser: false});
        updater.updated = false;

        var value = updater.getBinder().getValue();
        var oldBinder = updater.getBinder();
        oldBinder.updateExtrasInCurrentBinder({temporalExtra: 15});
        
        var b = testUpdateBinder(updater, function() {
            return oldBinder.setEditedValueByTheUserAndUpdateExtras(value, {temporalExtra: 16});
        });
        
        expect(b.getValue()).toBe(value);
        expect(b.getExtras().temporalExtra).toBe(16);
        expect(oldBinder.getExtras().temporalExtra).toBe(15);
        sameProps(oldBinder, b);

        expect(b.wasTouchedByTheUser()).toBe(false);
        expect(b.wasEditedByTheUser()).toBe(true);
    });
    test('setEditedValueByTheUserAndUpdateExtras same value with extra changes (permanent)', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: false, _$editedByTheUser: false});
        updater.updated = false;

        var value = updater.getBinder().getValue();
        var oldBinder = updater.getBinder();
        oldBinder.updateExtrasInCurrentBinder(undefined, {permanentExtra: 151});
        
        var b = testUpdateBinder(updater, function() {
            return oldBinder.setEditedValueByTheUserAndUpdateExtras(value, undefined, {permanentExtra: 161});
        });
        
        expect(b.getValue()).toBe(value);
        expect(b.getExtras().permanentExtra).toBe(161);
        expect(oldBinder.getExtras().permanentExtra).toBe(151);
        sameProps(oldBinder, b);

        expect(b.wasTouchedByTheUser()).toBe(false);
        expect(b.wasEditedByTheUser()).toBe(true);
    });
    test('setEditedValueByTheUserAndUpdateExtras method different value with extras changes', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: false, _$editedByTheUser: false});
        updater.updated = false;
        
        var oldBinder = updater.getBinder();
        oldBinder.updateExtrasInCurrentBinder({temporalExtra: 17}, {permanentExtra: 171});
        
        var b = testUpdateBinder(updater, function() {
            return oldBinder.setEditedValueByTheUserAndUpdateExtras(updater.alternativeValue, {temporalExtra: 18}, {permanentExtra: 181});
        });
        
        expect(b.getValue()).toBe(updater.alternativeValue);
        expect(b.getExtras().temporalExtra).toBe(18);
        expect(b.getExtras().permanentExtra).toBe(181);
        expect(oldBinder.getExtras().temporalExtra).toBe(17);
        expect(oldBinder.getExtras().permanentExtra).toBe(171);
        differentProps(oldBinder, b);

        expect(b.wasTouchedByTheUser()).toBe(false);
        expect(b.wasEditedByTheUser()).toBe(true);
    });
    test('setEditedValueByTheUserAndUpdateExtras method same values with no extras changes forced', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: false, _$editedByTheUser: false});
        updater.updated = false;

        var oldBinder = updater.getBinder();
        oldBinder.updateExtrasInCurrentBinder({temporalExtra: 19}, {permanentExtra: 191});
        
        var b = testUpdateBinder(updater, function() {
            return oldBinder.setEditedValueByTheUserAndUpdateExtras(updater.initialValue, {temporalExtra: 19}, {permanentExtra: 191}, true);
        });
        
        expect(b.getValue()).toBe(updater.initialValue);
        expect(b.getExtras().temporalExtra).toBe(19);
        expect(b.getExtras().permanentExtra).toBe(191);
        sameProps(oldBinder, b);

        expect(b.wasTouchedByTheUser()).toBe(false);
        expect(b.wasEditedByTheUser()).toBe(true);
    });
    test('setValueAndUpdateExtras method same value no extras changes', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: false, _$editedByTheUser: false});
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

        expect(b.wasTouchedByTheUser()).toBe(false);
        expect(b.wasEditedByTheUser()).toBe(false);
    });
    test('setValueAndUpdateExtras method different value no extras changes', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: false, _$editedByTheUser: false});
        updater.updated = false;
        
        var oldBinder = updater.getBinder();
        oldBinder.updateExtrasInCurrentBinder(undefined, {permanentExtra: 14});
        
        var b = testUpdateBinder(updater, function() {
            return oldBinder.setValueAndUpdateExtras(updater.alternativeValue, undefined, {permanentExtra: 14});
        });
        
        expect(b.getValue()).toBe(updater.alternativeValue);
        expect(b.getExtras().permanentExtra).toBe(14);
        differentProps(oldBinder, b);

        expect(b.wasTouchedByTheUser()).toBe(false);
        expect(b.wasEditedByTheUser()).toBe(false);
    });
    test('setValueAndUpdateExtras same value with extra changes (temporal)', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: false, _$editedByTheUser: false});
        updater.updated = false;

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

        expect(b.wasTouchedByTheUser()).toBe(false);
        expect(b.wasEditedByTheUser()).toBe(false);
    });
    test('setValueAndUpdateExtras same value with extra changes (permanent)', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: false, _$editedByTheUser: false});
        updater.updated = false;

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

        expect(b.wasTouchedByTheUser()).toBe(false);
        expect(b.wasEditedByTheUser()).toBe(false);
    });
    test('setValueAndUpdateExtras method different value with extras changes', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: false, _$editedByTheUser: false});
        updater.updated = false;
        
        var oldBinder = updater.getBinder();
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

        expect(b.wasTouchedByTheUser()).toBe(false);
        expect(b.wasEditedByTheUser()).toBe(false);
    });
    test('setValueAndUpdateExtras method same values with no extras changes forced', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: false, _$editedByTheUser: false});
        updater.updated = false;
        
        var oldBinder = updater.getBinder();
        oldBinder.updateExtrasInCurrentBinder({temporalExtra: 19}, {permanentExtra: 191});
        
        var b = testUpdateBinder(updater, function() {
            return oldBinder.setValueAndUpdateExtras(updater.initialValue, {temporalExtra: 19}, {permanentExtra: 191}, true);
        });
        
        expect(b.getValue()).toBe(updater.initialValue);
        expect(b.getExtras().temporalExtra).toBe(19);
        expect(b.getExtras().permanentExtra).toBe(191);
        sameProps(oldBinder, b);

        expect(b.wasTouchedByTheUser()).toBe(false);
        expect(b.wasEditedByTheUser()).toBe(false);
    });
    test('getDerivedFrom method returns null', function() {
        updater.updated = false;
        var b = updater.getBinder().setValue(updater.initialValue);
        expect(b.getDerivedFrom()).toBe(null);
    });
    test('setTouchedByTheUser method same value (true)', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: true, _$editedByTheUser: false});
        updater.updated = false;

        var oldBinder = updater.getBinder();
        var extras = oldBinder.getExtras();

        expect(oldBinder.wasTouchedByTheUser()).toBe(true);
        expect(oldBinder.wasEditedByTheUser()).toBe(false);

        var b = oldBinder.setTouchedByTheUser(true);
        
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

        expect(b.wasTouchedByTheUser()).toBe(true);
        expect(b.wasEditedByTheUser()).toBe(false);
    });
    test('setTouchedByTheUser method same value (false)', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: false, _$editedByTheUser: false});
        updater.updated = false;

        var oldBinder = updater.getBinder();
        var extras = oldBinder.getExtras();
        
        expect(oldBinder.wasTouchedByTheUser()).toBe(false);
        expect(oldBinder.wasEditedByTheUser()).toBe(false);

        var b = oldBinder.setTouchedByTheUser(false);
        
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

        expect(b.wasTouchedByTheUser()).toBe(false);
        expect(b.wasEditedByTheUser()).toBe(false);
    });
    test('setTouchedByTheUser method different value (true)', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: false, _$editedByTheUser: false});
        updater.updated = false;
        
        var oldBinder = updater.getBinder();
        expect(oldBinder.wasTouchedByTheUser()).toBe(false);
        expect(oldBinder.wasEditedByTheUser()).toBe(false);

        var b = testUpdateBinder(updater, function() {
            return oldBinder.setTouchedByTheUser(true);
        });
        
        expect(b.getValue()).toBe(updater.initialValue);
        sameProps(oldBinder, b);

        expect(b.wasTouchedByTheUser()).toBe(true);
        expect(b.wasEditedByTheUser()).toBe(false);
    });
    test('setTouchedByTheUser method different value (false)', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: true, _$editedByTheUser: false});
        updater.updated = false;
        
        var oldBinder = updater.getBinder();
        expect(oldBinder.wasTouchedByTheUser()).toBe(true);
        expect(oldBinder.wasEditedByTheUser()).toBe(false);

        var b = testUpdateBinder(updater, function() {
            return oldBinder.setTouchedByTheUser(false);
        });
        
        expect(b.getValue()).toBe(updater.initialValue);
        sameProps(oldBinder, b);

        expect(b.wasTouchedByTheUser()).toBe(false);
        expect(b.wasEditedByTheUser()).toBe(false);
    });
    test('setEditedByTheUser method same value (true)', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: false, _$editedByTheUser: true});
        updater.updated = false;

        var oldBinder = updater.getBinder();
        var extras = oldBinder.getExtras();

        expect(oldBinder.wasTouchedByTheUser()).toBe(false);
        expect(oldBinder.wasEditedByTheUser()).toBe(true);

        var b = oldBinder.setEditedByTheUser(true);
        
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

        expect(b.wasTouchedByTheUser()).toBe(false);
        expect(b.wasEditedByTheUser()).toBe(true);
    });
    test('setEditedByTheUser method same value (false)', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: false, _$editedByTheUser: false});
        updater.updated = false;

        var oldBinder = updater.getBinder();
        var extras = oldBinder.getExtras();
        
        expect(oldBinder.wasTouchedByTheUser()).toBe(false);
        expect(oldBinder.wasEditedByTheUser()).toBe(false);

        var b = oldBinder.setEditedByTheUser(false);
        
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

        expect(b.wasTouchedByTheUser()).toBe(false);
        expect(b.wasEditedByTheUser()).toBe(false);
    });
    test('setEditedByTheUser method different value (true)', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: false, _$editedByTheUser: false});
        updater.updated = false;
        
        var oldBinder = updater.getBinder();
        expect(oldBinder.wasTouchedByTheUser()).toBe(false);
        expect(oldBinder.wasEditedByTheUser()).toBe(false);

        var b = testUpdateBinder(updater, function() {
            return oldBinder.setEditedByTheUser(true);
        });
        
        expect(b.getValue()).toBe(updater.initialValue);
        sameProps(oldBinder, b);

        expect(b.wasTouchedByTheUser()).toBe(false);
        expect(b.wasEditedByTheUser()).toBe(true);
    });
    test('setEditedByTheUser method different value (false)', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: false, _$editedByTheUser: true});
        updater.updated = false;
        
        var oldBinder = updater.getBinder();
        expect(oldBinder.wasTouchedByTheUser()).toBe(false);
        expect(oldBinder.wasEditedByTheUser()).toBe(true);

        var b = testUpdateBinder(updater, function() {
            return oldBinder.setEditedByTheUser(false);
        });
        
        expect(b.getValue()).toBe(updater.initialValue);
        sameProps(oldBinder, b);

        expect(b.wasTouchedByTheUser()).toBe(false);
        expect(b.wasEditedByTheUser()).toBe(false);
    });
    
    test('setTouchedAndEditedByTheUser method same value (true true)', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: true, _$editedByTheUser: true});
        updater.updated = false;

        var oldBinder = updater.getBinder();
        var extras = oldBinder.getExtras();

        expect(oldBinder.wasTouchedByTheUser()).toBe(true);
        expect(oldBinder.wasEditedByTheUser()).toBe(true);

        var b = oldBinder.setTouchedAndEditedByTheUser(true, true);
        
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

        expect(b.wasTouchedByTheUser()).toBe(true);
        expect(b.wasEditedByTheUser()).toBe(true);
    });
    test('setTouchedAndEditedByTheUser method same value (true false)', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: true, _$editedByTheUser: false});
        updater.updated = false;

        var oldBinder = updater.getBinder();
        var extras = oldBinder.getExtras();

        expect(oldBinder.wasTouchedByTheUser()).toBe(true);
        expect(oldBinder.wasEditedByTheUser()).toBe(false);

        var b = oldBinder.setTouchedAndEditedByTheUser(true, false);
        
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

        expect(b.wasTouchedByTheUser()).toBe(true);
        expect(b.wasEditedByTheUser()).toBe(false);
    });
    test('setTouchedAndEditedByTheUser method same value (false false)', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: false, _$editedByTheUser: false});
        updater.updated = false;

        var oldBinder = updater.getBinder();
        var extras = oldBinder.getExtras();
        
        expect(oldBinder.wasTouchedByTheUser()).toBe(false);
        expect(oldBinder.wasEditedByTheUser()).toBe(false);

        var b = oldBinder.setTouchedAndEditedByTheUser(false, false);
        
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

        expect(b.wasTouchedByTheUser()).toBe(false);
        expect(b.wasEditedByTheUser()).toBe(false);
    });
    test('setTouchedAndEditedByTheUser method same value (false true)', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: false, _$editedByTheUser: true});
        updater.updated = false;

        var oldBinder = updater.getBinder();
        var extras = oldBinder.getExtras();
        
        expect(oldBinder.wasTouchedByTheUser()).toBe(false);
        expect(oldBinder.wasEditedByTheUser()).toBe(true);

        var b = oldBinder.setTouchedAndEditedByTheUser(false, true);
        
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

        expect(b.wasTouchedByTheUser()).toBe(false);
        expect(b.wasEditedByTheUser()).toBe(true);
    });
    test('setTouchedAndEditedByTheUser method different value (true true)', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: false, _$editedByTheUser: false});
        updater.updated = false;
        
        var oldBinder = updater.getBinder();
        expect(oldBinder.wasTouchedByTheUser()).toBe(false);
        expect(oldBinder.wasEditedByTheUser()).toBe(false);

        var b = testUpdateBinder(updater, function() {
            return oldBinder.setTouchedAndEditedByTheUser(true, true);
        });
        
        expect(b.getValue()).toBe(updater.initialValue);
        sameProps(oldBinder, b);

        expect(b.wasTouchedByTheUser()).toBe(true);
        expect(b.wasEditedByTheUser()).toBe(true);
    });
    test('setTouchedAndEditedByTheUser method different value (true false)', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: false, _$editedByTheUser: true});
        updater.updated = false;
        
        var oldBinder = updater.getBinder();
        expect(oldBinder.wasTouchedByTheUser()).toBe(false);
        expect(oldBinder.wasEditedByTheUser()).toBe(true);

        var b = testUpdateBinder(updater, function() {
            return oldBinder.setTouchedAndEditedByTheUser(true, false);
        });
        
        expect(b.getValue()).toBe(updater.initialValue);
        sameProps(oldBinder, b);

        expect(b.wasTouchedByTheUser()).toBe(true);
        expect(b.wasEditedByTheUser()).toBe(false);
    });
    test('setTouchedAndEditedByTheUser method different value (false false)', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: true, _$editedByTheUser: true});
        updater.updated = false;
        
        var oldBinder = updater.getBinder();
        expect(oldBinder.wasTouchedByTheUser()).toBe(true);
        expect(oldBinder.wasEditedByTheUser()).toBe(true);

        var b = testUpdateBinder(updater, function() {
            return oldBinder.setTouchedAndEditedByTheUser(false, false);
        });
        
        expect(b.getValue()).toBe(updater.initialValue);
        sameProps(oldBinder, b);

        expect(b.wasTouchedByTheUser()).toBe(false);
        expect(b.wasEditedByTheUser()).toBe(false);
    });
    test('setTouchedAndEditedByTheUser method different value (false true)', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: true, _$editedByTheUser: false});
        updater.updated = false;
        
        var oldBinder = updater.getBinder();
        expect(oldBinder.wasTouchedByTheUser()).toBe(true);
        expect(oldBinder.wasEditedByTheUser()).toBe(false);

        var b = testUpdateBinder(updater, function() {
            return oldBinder.setTouchedAndEditedByTheUser(false, true);
        });
        
        expect(b.getValue()).toBe(updater.initialValue);
        sameProps(oldBinder, b);

        expect(b.wasTouchedByTheUser()).toBe(false);
        expect(b.wasEditedByTheUser()).toBe(true);
    });


    test('setTouchedAndEditedByTheUser method different value (true= true)', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: true, _$editedByTheUser: false});
        updater.updated = false;
        
        var oldBinder = updater.getBinder();
        expect(oldBinder.wasTouchedByTheUser()).toBe(true);
        expect(oldBinder.wasEditedByTheUser()).toBe(false);

        var b = testUpdateBinder(updater, function() {
            return oldBinder.setTouchedAndEditedByTheUser(true, true);
        });
        
        expect(b.getValue()).toBe(updater.initialValue);
        sameProps(oldBinder, b);

        expect(b.wasTouchedByTheUser()).toBe(true);
        expect(b.wasEditedByTheUser()).toBe(true);
    });
    test('setTouchedAndEditedByTheUser method different value (true= false)', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: true, _$editedByTheUser: true});
        updater.updated = false;
        
        var oldBinder = updater.getBinder();
        expect(oldBinder.wasTouchedByTheUser()).toBe(true);
        expect(oldBinder.wasEditedByTheUser()).toBe(true);

        var b = testUpdateBinder(updater, function() {
            return oldBinder.setTouchedAndEditedByTheUser(true, false);
        });
        
        expect(b.getValue()).toBe(updater.initialValue);
        sameProps(oldBinder, b);

        expect(b.wasTouchedByTheUser()).toBe(true);
        expect(b.wasEditedByTheUser()).toBe(false);
    });
    test('setTouchedAndEditedByTheUser method different value (false= false)', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: false, _$editedByTheUser: true});
        updater.updated = false;
        
        var oldBinder = updater.getBinder();
        expect(oldBinder.wasTouchedByTheUser()).toBe(false);
        expect(oldBinder.wasEditedByTheUser()).toBe(true);

        var b = testUpdateBinder(updater, function() {
            return oldBinder.setTouchedAndEditedByTheUser(false, false);
        });
        
        expect(b.getValue()).toBe(updater.initialValue);
        sameProps(oldBinder, b);

        expect(b.wasTouchedByTheUser()).toBe(false);
        expect(b.wasEditedByTheUser()).toBe(false);
    });
    test('setTouchedAndEditedByTheUser method different value (false= true)', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: false, _$editedByTheUser: false});
        updater.updated = false;
        
        var oldBinder = updater.getBinder();
        expect(oldBinder.wasTouchedByTheUser()).toBe(false);
        expect(oldBinder.wasEditedByTheUser()).toBe(false);

        var b = testUpdateBinder(updater, function() {
            return oldBinder.setTouchedAndEditedByTheUser(false, true);
        });
        
        expect(b.getValue()).toBe(updater.initialValue);
        sameProps(oldBinder, b);

        expect(b.wasTouchedByTheUser()).toBe(false);
        expect(b.wasEditedByTheUser()).toBe(true);
    });

    test('setTouchedAndEditedByTheUser method different value (true true=)', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: false, _$editedByTheUser: true});
        updater.updated = false;
        
        var oldBinder = updater.getBinder();
        expect(oldBinder.wasTouchedByTheUser()).toBe(false);
        expect(oldBinder.wasEditedByTheUser()).toBe(true);

        var b = testUpdateBinder(updater, function() {
            return oldBinder.setTouchedAndEditedByTheUser(true, true);
        });
        
        expect(b.getValue()).toBe(updater.initialValue);
        sameProps(oldBinder, b);

        expect(b.wasTouchedByTheUser()).toBe(true);
        expect(b.wasEditedByTheUser()).toBe(true);
    });
    test('setTouchedAndEditedByTheUser method different value (true false=)', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: false, _$editedByTheUser: false});
        updater.updated = false;
        
        var oldBinder = updater.getBinder();
        expect(oldBinder.wasTouchedByTheUser()).toBe(false);
        expect(oldBinder.wasEditedByTheUser()).toBe(false);

        var b = testUpdateBinder(updater, function() {
            return oldBinder.setTouchedAndEditedByTheUser(true, false);
        });
        
        expect(b.getValue()).toBe(updater.initialValue);
        sameProps(oldBinder, b);

        expect(b.wasTouchedByTheUser()).toBe(true);
        expect(b.wasEditedByTheUser()).toBe(false);
    });
    test('setTouchedAndEditedByTheUser method different value (false false=)', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: true, _$editedByTheUser: false});
        updater.updated = false;
        
        var oldBinder = updater.getBinder();
        expect(oldBinder.wasTouchedByTheUser()).toBe(true);
        expect(oldBinder.wasEditedByTheUser()).toBe(false);

        var b = testUpdateBinder(updater, function() {
            return oldBinder.setTouchedAndEditedByTheUser(false, false);
        });
        
        expect(b.getValue()).toBe(updater.initialValue);
        sameProps(oldBinder, b);

        expect(b.wasTouchedByTheUser()).toBe(false);
        expect(b.wasEditedByTheUser()).toBe(false);
    });
    test('setTouchedAndEditedByTheUser method different value (false true=)', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: true, _$editedByTheUser: true});
        updater.updated = false;
        
        var oldBinder = updater.getBinder();
        expect(oldBinder.wasTouchedByTheUser()).toBe(true);
        expect(oldBinder.wasEditedByTheUser()).toBe(true);

        var b = testUpdateBinder(updater, function() {
            return oldBinder.setTouchedAndEditedByTheUser(false, true);
        });
        
        expect(b.getValue()).toBe(updater.initialValue);
        sameProps(oldBinder, b);

        expect(b.wasTouchedByTheUser()).toBe(false);
        expect(b.wasEditedByTheUser()).toBe(true);
    });

    
    test('setError method same error', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: false, _$editedByTheUser: false, _$error: 'Error message 1'});
        updater.updated = false;

        var oldBinder = updater.getBinder();
        var extras = oldBinder.getExtras();
        var b = oldBinder.setError('Error message 1');
        
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

        expect(b.wasTouchedByTheUser()).toBe(false);
        expect(b.wasEditedByTheUser()).toBe(false);
        expect(b.getError()).toBe('Error message 1');
        expect(b.containsErrors()).toBe(true);
    });
    test('setError method null error', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: false, _$editedByTheUser: false, _$error: 'Error message 2'});
        updater.updated = false;

        var oldBinder = updater.getBinder();
        var extras = oldBinder.getExtras();
        var b = oldBinder.setError(null);
        
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

        expect(b.wasTouchedByTheUser()).toBe(false);
        expect(b.wasEditedByTheUser()).toBe(false);
        expect(b.getError()).toBe('Error message 2');
        expect(b.containsErrors()).toBe(true);
    });
    test('setError method undefined error', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: false, _$editedByTheUser: false, _$error: 'Error message 3'});
        updater.updated = false;

        var oldBinder = updater.getBinder();
        var extras = oldBinder.getExtras();
        var b = oldBinder.setError(undefined);
        
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

        expect(b.wasTouchedByTheUser()).toBe(false);
        expect(b.wasEditedByTheUser()).toBe(false);
        expect(b.getError()).toBe('Error message 3');
        expect(b.containsErrors()).toBe(true);
    });
    test('setError method empty error', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: false, _$editedByTheUser: false, _$error: 'Error message 4'});
        updater.updated = false;

        var oldBinder = updater.getBinder();
        var extras = oldBinder.getExtras();
        var b = oldBinder.setError('');
        
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

        expect(b.wasTouchedByTheUser()).toBe(false);
        expect(b.wasEditedByTheUser()).toBe(false);
        expect(b.getError()).toBe('Error message 4');
        expect(b.containsErrors()).toBe(true);
    });
    test('setError method different error', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: false, _$editedByTheUser: false, _$error: null});
        updater.updated = false;

        var oldBinder = updater.getBinder();
        var extras = oldBinder.getExtras();
        var b = oldBinder.setError('Error message 5');
        
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

        expect(b.wasTouchedByTheUser()).toBe(false);
        expect(b.wasEditedByTheUser()).toBe(false);
        expect(b.getError()).toBe('Error message 5');
        expect(b.containsErrors()).toBe(true);
    });


    test('setError method same error (resolved promise)', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: false, _$editedByTheUser: false, _$error: 'Error message 6'});
        updater.updated = false;

        var oldBinder = updater.getBinder();
        var extras = oldBinder.getExtras();

        return oldBinder.setError(Promise.resolve('Error message 6')).then(function (b) {
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
    
            expect(b.wasTouchedByTheUser()).toBe(false);
            expect(b.wasEditedByTheUser()).toBe(false);
            expect(b.getError()).toBe('Error message 6');
            expect(b.containsErrors()).toBe(true);
        });
    });
    test('setError method null error (resolved promise)', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: false, _$editedByTheUser: false, _$error: 'Error message 7'});
        updater.updated = false;

        var oldBinder = updater.getBinder();
        var extras = oldBinder.getExtras();

        return oldBinder.setError(Promise.resolve(null)).then(function (b) {
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
    
            expect(b.wasTouchedByTheUser()).toBe(false);
            expect(b.wasEditedByTheUser()).toBe(false);
            expect(b.getError()).toBe('Error message 7');
            expect(b.containsErrors()).toBe(true);
        });
    });
    test('setError method undefined error (resolved promise)', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: false, _$editedByTheUser: false, _$error: 'Error message 8'});
        updater.updated = false;

        var oldBinder = updater.getBinder();
        var extras = oldBinder.getExtras();

        return oldBinder.setError(Promise.resolve(undefined)).then(function (b) {
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
    
            expect(b.wasTouchedByTheUser()).toBe(false);
            expect(b.wasEditedByTheUser()).toBe(false);
            expect(b.getError()).toBe('Error message 8');
            expect(b.containsErrors()).toBe(true);
        });
    });
    test('setError method empty error (resolved promise)', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: false, _$editedByTheUser: false, _$error: 'Error message 9'});
        updater.updated = false;

        var oldBinder = updater.getBinder();
        var extras = oldBinder.getExtras();

        return oldBinder.setError(Promise.resolve('')).then(function (b) {
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
    
            expect(b.wasTouchedByTheUser()).toBe(false);
            expect(b.wasEditedByTheUser()).toBe(false);
            expect(b.getError()).toBe('Error message 9');
            expect(b.containsErrors()).toBe(true);
        });
    });
    test('setError method different error (resolved promise)', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: false, _$editedByTheUser: false, _$error: null});
        updater.updated = false;

        var oldBinder = updater.getBinder();
        return testUpdateBinder(updater, function() {
            return oldBinder.setError(Promise.reject('Error message 10'));
        }).then(function (b) {
            expect(b.getValue()).toBe(updater.initialValue);
            sameProps(oldBinder, b);
    
            expect(b.wasTouchedByTheUser()).toBe(false);
            expect(b.wasEditedByTheUser()).toBe(false);
            expect(b.getError()).toBe('Error message 10');
            expect(b.containsErrors()).toBe(true);
        });
    });

    test('setError method same error (rejected promise)', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: false, _$editedByTheUser: false, _$error: 'Error message 11'});
        updater.updated = false;

        var oldBinder = updater.getBinder();
        var extras = oldBinder.getExtras();

        return oldBinder.setError(Promise.reject('Error message 11')).then(function (b) {
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
    
            expect(b.wasTouchedByTheUser()).toBe(false);
            expect(b.wasEditedByTheUser()).toBe(false);
            expect(b.getError()).toBe('Error message 11');
            expect(b.containsErrors()).toBe(true);
        });
    });
    test('setError method null error (rejected promise)', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: false, _$editedByTheUser: false, _$error: 'Error message 12'});
        updater.updated = false;

        var oldBinder = updater.getBinder();
        var extras = oldBinder.getExtras();

        return oldBinder.setError(Promise.reject(null)).then(function (b) {
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
    
            expect(b.wasTouchedByTheUser()).toBe(false);
            expect(b.wasEditedByTheUser()).toBe(false);
            expect(b.getError()).toBe('Error message 12');
            expect(b.containsErrors()).toBe(true);
        });
    });
    test('setError method undefined error (rejected promise)', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: false, _$editedByTheUser: false, _$error: 'Error message 13'});
        updater.updated = false;

        var oldBinder = updater.getBinder();
        var extras = oldBinder.getExtras();

        return oldBinder.setError(Promise.reject(undefined)).then(function (b) {
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
    
            expect(b.wasTouchedByTheUser()).toBe(false);
            expect(b.wasEditedByTheUser()).toBe(false);
            expect(b.getError()).toBe('Error message 13');
            expect(b.containsErrors()).toBe(true);
        });
    });
    test('setError method empty error (rejected promise)', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: false, _$editedByTheUser: false, _$error: 'Error message 14'});
        updater.updated = false;

        var oldBinder = updater.getBinder();
        var extras = oldBinder.getExtras();

        return oldBinder.setError(Promise.reject('')).then(function (b) {
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
    
            expect(b.wasTouchedByTheUser()).toBe(false);
            expect(b.wasEditedByTheUser()).toBe(false);
            expect(b.getError()).toBe('Error message 14');
            expect(b.containsErrors()).toBe(true);
        });
    });
    test('setError method different error (rejected promise)', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: false, _$editedByTheUser: false, _$error: null});
        updater.updated = false;

        var oldBinder = updater.getBinder();
        return testUpdateBinder(updater, function() {
                return oldBinder.setError(Promise.reject('Error message 15'));
            }).then(function (b) {
                expect(b.getValue()).toBe(updater.initialValue);
                sameProps(oldBinder, b);
        
                expect(b.wasTouchedByTheUser()).toBe(false);
                expect(b.wasEditedByTheUser()).toBe(false);
                expect(b.getError()).toBe('Error message 15');
                expect(b.containsErrors()).toBe(true);
        });
    });


    test('setError method invalid binder', function() {
        // updater.updated = false;
        // updater.getBinder().setValue({}, true);
        // //expect(updater.getBinder().containsErrors()).toBe(false);
        // var bi = updater.getBinder();
        // var extras = bi.getExtras();
        // expect(!!extras._$updatedChildContainsErrors).toBe(false)
        // expect(!!bi._$oldChildrenHaveErrors).toBe(false)
        // expect(!!extras._$error).toBe(false);
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: false, _$editedByTheUser: false, _$error: null});
        updater.updated = false;

        var oldBinder = updater.getBinder();
        oldBinder.setValue(updater.alternativeValue);
        expect(oldBinder.containsErrors()).toBe(false);
        var b = oldBinder.setError('Error message 16');

        expect(oldBinder).toBe(b);
        expect(b.getError()).toBe('Error message 16');
        expect(b.containsErrors()).toBe(true);

    });
    test('setError method invalid binder (resolved promise)', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: false, _$editedByTheUser: false, _$error: null});
        updater.updated = false;

        var oldBinder = updater.getBinder();
        oldBinder.setValue(updater.alternativeValue);
        expect(oldBinder.containsErrors()).toBe(false);
        return oldBinder.setError(Promise.resolve('Error message 17')).then(function (b) {
            expect(oldBinder).toBe(b);
            expect(b.getError()).toBe('Error message 17');
            expect(b.containsErrors()).toBe(true);
        });
    });
    test('setError method invalid binder (rejected promise)', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.getBinder().updateExtrasInCurrentBinder({_$touchedByTheUser: false, _$editedByTheUser: false, _$error: null});
        updater.updated = false;

        var oldBinder = updater.getBinder();
        expect(oldBinder.containsErrors()).toBe(false);
        oldBinder.setValue(updater.alternativeValue);
        return oldBinder.setError(Promise.reject('Error message 18')).then(function (b) {
            expect(oldBinder).toBe(b);
            expect(b.getError()).toBe('Error message 18');
            expect(b.containsErrors()).toBe(true);
        });
    });

    test('sameValue method', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue, true);
        updater.updated = false;

        var oldBinder = updater.getBinder();
        expect(oldBinder.sameValue(updater.initialValue)).toBe(true);
        expect(oldBinder.sameValue({})).toBe(false);
        expect(oldBinder.sameValue(oldBinder)).toBe(true);
        var b = testUpdateBinder(updater, function() {
            return oldBinder.setValue(updater.alternativeValue);
        });
        expect(b.sameValue(oldBinder)).toBe(false);
    });

}
module.exports = createAbstractBinderTests;