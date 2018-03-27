/*global expect*/
var binder = require('../../src/binder');
var createUpdater = require('./utils/createUpdater');

function createStringBinderfromNumberBinder(sourceValue) {
    var stringValue = sourceValue + '';
    return binder(stringValue);
}

function setValueAsNumber(sourceBinder, newDerivedBinder) {
    var newValue = +newDerivedBinder.getValue();
    if (!isNaN(newValue)) {
        return sourceBinder.setValue(newValue, true);
    }
    
    newDerivedBinder.updateExtrasInCurrentBinder({error: 'This must be a number'});
    return sourceBinder.setValue(sourceBinder.getValue(), true);
}
    
function stringBinderFromNumberBinder(sourceNumberBinder) {
    return binder.deriveFrom(sourceNumberBinder, createStringBinderfromNumberBinder, setValueAsNumber, '_$deriveNumberString');
}

var updater = createUpdater();
updater.binder = binder('', updater, updater.initializer);
updater.getBinder = function() {
    return this.binder;
};

test('string from number binder', function() {
    updater.updated = false;
    var b = updater.getBinder().setValue(10);
    updater.updated = false;
    
    b.updateExtrasInCurrentBinder({
        error: 'error test string',
        stringExtra: 'this must be ignored string'
    }, {
        permanent: 'permanent extra string'
    });
    var stringBinder = stringBinderFromNumberBinder(b);
    
    expect(stringBinder.getValue()).toBe('10');
    expect(stringBinder.getExtras().error).toBe('error test string');
    expect(stringBinder.getExtras().stringExtra).toBeUndefined();
    expect(stringBinder.getExtras().permanent).toBeUndefined();
    expect(stringBinder.getDerivedFrom().sourceBinder).toBe(b);
    expect(stringBinder.getDerivedFrom().createDerivedBinder).toBe(createStringBinderfromNumberBinder);
    expect(stringBinder.getDerivedFrom().setSourceValue).toBe(setValueAsNumber);
    expect(stringBinder.getDerivedFrom().derivationName).toBe('_$deriveNumberString');
    expect(b.getDerivedFrom()).toBe(null);
    
    var stringBinder2 = stringBinderFromNumberBinder(b);
    
    expect(stringBinder).toBe(stringBinder2);
    
    var oldStringBinder = stringBinder;
    var oldBinder = b;
    
    stringBinder = stringBinder.setValue('11');
    b = updater.getBinder();
    
    expect(oldStringBinder).not.toBe(stringBinder);
    expect(oldBinder).not.toBe(b);
    
    expect(stringBinder.getValue()).toBe('11');
    expect(b.getValue()).toBe(11);
    
    expect(b.getExtras().error).toBeUndefined();
    expect(b.getExtras().stringExtra).toBeUndefined();
    expect(b.getExtras().permanent).toBe('permanent extra string');
    
    stringBinder2 = stringBinderFromNumberBinder(b);
    expect(stringBinder).toBe(stringBinder2);
    
    expect(stringBinder.getDerivedFrom().sourceBinder).toBe(b);
    expect(b.getDerivedFrom()).toBe(null);
    
    // second update
    updater.updated = false;

    oldStringBinder = stringBinder;
    oldBinder = b;

    stringBinder = stringBinder.setValue('12');
    b = updater.getBinder();
    
    expect(oldStringBinder).not.toBe(stringBinder);
    expect(oldBinder).not.toBe(b);
    
    expect(stringBinder.getValue()).toBe('12');
    expect(b.getValue()).toBe(12);
    
    stringBinder2 = stringBinderFromNumberBinder(b);
    expect(stringBinder).toBe(stringBinder2);
    
    expect(stringBinder.getDerivedFrom().sourceBinder).toBe(b);
    expect(stringBinder.getDerivedFrom().createDerivedBinder).toBe(createStringBinderfromNumberBinder);
    expect(stringBinder.getDerivedFrom().setSourceValue).toBe(setValueAsNumber);
    expect(stringBinder.getDerivedFrom().derivationName).toBe('_$deriveNumberString');
    expect(b.getDerivedFrom()).toBe(null);

    // error update
    updater.updated = false;

    oldStringBinder = stringBinder;
    oldBinder = b;

    stringBinder = stringBinder.setValue('foo');
    b = updater.getBinder();
    
    expect(updater.updated).toBe(true);
    expect(oldBinder).not.toBe(b);
    expect(oldStringBinder).not.toBe(stringBinder);
    expect(b.getValue()).toBe(12);
    expect(stringBinder.getValue()).toBe('foo');
    expect(stringBinder.getExtras().error).toBe('This must be a number');
    
    expect(stringBinder.getDerivedFrom().sourceBinder).toBe(b);
    expect(stringBinder.getDerivedFrom().createDerivedBinder).toBe(createStringBinderfromNumberBinder);
    expect(stringBinder.getDerivedFrom().setSourceValue).toBe(setValueAsNumber);
    expect(stringBinder.getDerivedFrom().derivationName).toBe('_$deriveNumberString');
    expect(b.getDerivedFrom()).toBe(null);
    
    // update permanet extras
    updater.updated = false;

    oldStringBinder = stringBinder;
    oldBinder = b;

    stringBinder = stringBinder.updateExtras(undefined, {permanentFoo: 456});
    b = updater.getBinder();
    
    expect(oldStringBinder).not.toBe(stringBinder);
    expect(oldBinder).not.toBe(b);
    
    expect(stringBinder.getValue()).toBe(oldStringBinder.getValue());
    expect(b.getValue()).toBe(oldBinder.getValue());
    
    expect(stringBinder.getExtras()).toHaveProperty('permanentFoo', 456);
    expect(oldStringBinder.getExtras()).not.toHaveProperty('permanentFoo');
    
    stringBinder2 = stringBinderFromNumberBinder(b);
    expect(stringBinder).toBe(stringBinder2);
    
    expect(stringBinder.getDerivedFrom().sourceBinder).toBe(b);
    expect(stringBinder.getDerivedFrom().derivationName).toBe('_$deriveNumberString');
    expect(b.getDerivedFrom()).toBe(null);
    
    // update extras
    updater.updated = false;

    oldStringBinder = stringBinder;
    oldBinder = b;

    stringBinder = stringBinder.updateExtras({foo: 123});
    b = updater.getBinder();
    
    expect(oldStringBinder).not.toBe(stringBinder);
    expect(oldBinder).not.toBe(b);
    
    expect(stringBinder.getValue()).toBe(oldStringBinder.getValue());
    expect(b.getValue()).toBe(oldBinder.getValue());
    
    expect(stringBinder.getExtras()).toHaveProperty('foo', 123);
    expect(oldStringBinder.getExtras()).not.toHaveProperty('foo');
    
    stringBinder2 = stringBinderFromNumberBinder(b);
    expect(stringBinder).toBe(stringBinder2);
    
    expect(stringBinder.getDerivedFrom().sourceBinder).toBe(b);
    expect(stringBinder.getDerivedFrom().createDerivedBinder).toBe(createStringBinderfromNumberBinder);
    expect(stringBinder.getDerivedFrom().setSourceValue).toBe(setValueAsNumber);
    expect(stringBinder.getDerivedFrom().derivationName).toBe('_$deriveNumberString');
    expect(b.getDerivedFrom()).toBe(null);
    
    // update source binder
    updater.updated = false;
    b = b.setValue(13);
    
    b.updateExtrasInCurrentBinder({
        error: 'error test string 2',
        stringExtra: 'this must be included string 2'
    });
    binder.inheritedExtras.push('stringExtra');
    
    stringBinder = stringBinderFromNumberBinder(b);
    expect(stringBinder.getValue()).toBe('13');
    expect(stringBinder.getExtras().error).toBe('error test string 2');
    expect(stringBinder.getExtras().stringExtra).toBe('this must be included string 2');
});


test('not binder', function() {
    updater.updated = false;
    var b = updater.getBinder().setValue(false);
    updater.updated = false;
    
    b.updateExtrasInCurrentBinder({
        error: 'error test not',
        notExtra: 'this must be ignored not'
    }, {
        permanent: 'permanent extra not'
    });
    var notBinder = binder.not(b);
    
    expect(notBinder.getValue()).toBe(true);
    expect(notBinder.getExtras().error).toBe('error test not');
    expect(notBinder.getExtras().notExtra).toBeUndefined();
    expect(notBinder.getExtras().permanent).toBeUndefined();
    expect(notBinder.getDerivedFrom().sourceBinder).toBe(b);
    expect(notBinder.getDerivedFrom().derivationName).toBe('_$deriveNot');
    expect(b.getDerivedFrom()).toBe(null);
    
    var notBinder2 = binder.notBinder(b);
    
    expect(notBinder).toBe(notBinder2);
    
    var oldNotBinder = notBinder;
    var oldBinder = b;
    
    notBinder = notBinder.setValue(false);
    b = updater.getBinder();
    
    expect(oldNotBinder).not.toBe(notBinder);
    expect(oldBinder).not.toBe(b);
    
    expect(notBinder.getValue()).toBe(false);
    expect(b.getValue()).toBe(true);
    
    expect(b.getExtras().error).toBeUndefined();
    expect(b.getExtras().stringExtra).toBeUndefined();
    expect(b.getExtras().permanent).toBe('permanent extra not');
    
    notBinder2 = binder.not(b);
    expect(notBinder).toBe(notBinder2);
    
    expect(notBinder.getDerivedFrom().sourceBinder).toBe(b);
    expect(b.getDerivedFrom()).toBe(null);
    
    // second update
    updater.updated = false;

    oldNotBinder = notBinder;
    oldBinder = b;
    
    notBinder = notBinder.setValue(true);
    b = updater.getBinder();
    
    expect(oldNotBinder).not.toBe(notBinder);
    expect(oldBinder).not.toBe(b);
    
    expect(notBinder.getValue()).toBe(true);
    expect(b.getValue()).toBe(false);
    
    notBinder2 = binder.not(b);
    expect(notBinder).toBe(notBinder2);
    
    expect(notBinder.getDerivedFrom().sourceBinder).toBe(b);
    expect(notBinder.getDerivedFrom().derivationName).toBe('_$deriveNot');
    expect(b.getDerivedFrom()).toBe(null);

    // update permanet extras
    updater.updated = false;

    oldNotBinder = notBinder;
    oldBinder = b;

    notBinder = notBinder.updateExtras(undefined, {permanentFoo: 456});
    b = updater.getBinder();
    
    expect(oldNotBinder).not.toBe(notBinder);
    expect(oldBinder).not.toBe(b);
    
    expect(notBinder.getValue()).toBe(oldNotBinder.getValue());
    expect(b.getValue()).toBe(oldBinder.getValue());
    
    expect(notBinder.getExtras()).toHaveProperty('permanentFoo', 456);
    expect(oldNotBinder.getExtras()).not.toHaveProperty('permanentFoo');
    
    notBinder2 = binder.not(b);
    expect(notBinder).toBe(notBinder2);
    
    expect(notBinder.getDerivedFrom().sourceBinder).toBe(b);
    expect(notBinder.getDerivedFrom().derivationName).toBe('_$deriveNot');
    expect(b.getDerivedFrom()).toBe(null);
    
    // update extras
    updater.updated = false;

    oldNotBinder = notBinder;
    oldBinder = b;

    notBinder = notBinder.updateExtras({foo: 123});
    b = updater.getBinder();
    
    expect(oldNotBinder).not.toBe(notBinder);
    expect(oldBinder).not.toBe(b);
    
    expect(notBinder.getValue()).toBe(oldNotBinder.getValue());
    expect(b.getValue()).toBe(oldBinder.getValue());
    
    expect(notBinder.getExtras()).toHaveProperty('foo', 123);
    expect(oldNotBinder.getExtras()).not.toHaveProperty('foo');
    expect(notBinder.getExtras()).toHaveProperty('permanentFoo', 456);
    
    notBinder2 = binder.not(b);
    expect(notBinder).toBe(notBinder2);
    
    expect(notBinder.getDerivedFrom().sourceBinder).toBe(b);
    expect(notBinder.getDerivedFrom().derivationName).toBe('_$deriveNot');
    expect(b.getDerivedFrom()).toBe(null);
    
    // update source binder
    updater.updated = false;
    b = b.setValue(true);
    
    b.updateExtrasInCurrentBinder({
        error: 'error test not 2',
        notExtra: 'this must be included not 2'
    });
    binder.inheritedExtras.push('notExtra');
    
    notBinder = binder.not(b);
    expect(notBinder.getValue()).toBe(false);
    expect(notBinder.getExtras().error).toBe('error test not 2');
    expect(notBinder.getExtras().notExtra).toBe('this must be included not 2');
});

test('devived binder with updater', function() {
    updater.updated = false;
    var b = updater.getBinder().setValue(100);
    updater.updated = false;
    
    var rootBinder;
    function updateDerivedBinder(newRootBinder) {
        rootBinder = newRootBinder;
    }
    
    function createDerivedBinder(sourceBinder) {
        return binder(sourceBinder.getValue(), updateDerivedBinder);
    }

    function setDerivedValue(sourceBinder, newDerivedBinder) {
        return sourceBinder.setValue(newDerivedBinder.getValue(), true);
    }

    var derived = binder.deriveFrom(b, createDerivedBinder, setDerivedValue, '_$test');
    var result = derived.setValue(101);
    expect(rootBinder).toBe(result);
    expect(result).not.toBe(derived);
});

test('invalid source binder to derive', function() {
    expect(function() {
        binder.not({});
    }).toThrow('Expectig a binder');
});

test('error when set derived value function returns nothing', function() {
    updater.updated = false;
    var b = updater.getBinder().setValue(100);
    updater.updated = false;
    
    function createDerivedBinder(sourceBinder) {
        return binder(sourceBinder.getValue());
    }

    function setDerivedValue(sourceBinder, newDerivedBinder) {
        return null;
    }

    var derived = binder.deriveFrom(b, createDerivedBinder, setDerivedValue, '_$test');
    expect(function() {
        derived.setValue(101);
    }).toThrow('Expecting the source binder updated when the derived binder changed, but the setSourceValue funtion returned nothing');
});
