/*global expect*/
var binder = require('../../src/binder');
var createUpdater = require('./utils/createUpdater');

var updater = createUpdater();
updater.binder = binder('', updater, updater.initializer);
updater.getBinder = function() {
    return this.binder;
};

test('NaN value', function() {
    updater.updated = false;
    var b = updater.getBinder().setValue(NaN);
    updater.updated = false;
    
    var result = b.setValue(NaN);
    expect(result).toBe(b);
});

test('no binder', function() {
    if (process.env.NODE_ENV !== "production") {
        expect(function() {
            updater.getBinder().setValue(updater.getBinder());
        }).toThrow('You cannot use a binder as value in an another binder');
    } else {
        // nothing to do here, this validation is omitted in production enviroment
    }
});

test('NaN value', function() {
    updater.updated = false;
    var b = updater.getBinder().setValue({size: 'foo'});
    updater.updated = false;
    
    expect(b.size.getValue()).toBe('foo');
});

test('createBinderIncludingFunctions function', function() {
    expect(binder.createBinderIncludingFunctions).toBe(binder.createBinder);
});

test('createPreInitializedBinder function', function() {
    expect(binder.createPreInitializedBinder).toBe(binder.createBinder);
});

test('createPreInitializedBinderIncludingFunctions function', function() {
    expect(binder.createBinderIncludingFunctions).toBe(binder.createBinder);
});

test('withBinderMode function', function() {
    expect(binder.withBinderMode().createBinder).toBe(binder.createBinder);
});

test('withSameBinderMode function', function() {
    expect(binder.withBinderMode().createBinder).toBe(binder.createBinder);
});

test('class value', function() {
    function Klass() {}
    updater.updated = false;
    var b = updater.getBinder().setValue(new Klass());
    updater.updated = false;
    expect(b.isValueBinder()).toBe(true);
    expect(b.isMapBinder()).toBe(false);
    expect(b.isObjectBinder()).toBe(false);
    expect(b.isArrayBinder()).toBe(false);
});

test("don't lose extra information when a sibling is updated", function() {
    updater.updated = false;
    var b = updater.getBinder().setValue({sa: 'aa', sb: 'bb'});
    updater.updated = false;
    b.sa.updateExtrasInCurrentBinder({temporal: 'tmp'}, {permanet: 'perm'});
    b.sb.setValue('bbb');
    updater.updated = false;
    b = updater.getBinder();
    expect(b.sa.getExtras().temporal).toBe('tmp');
    expect(b.sa.getExtras().permanet).toBe('perm');
});

test('containsErrors method on array', function() {
    updater.updated = false;
    var b = updater.getBinder().setValue([0, 1]);
    updater.updated = false;
    b[0].setError('Error message 1');
    updater.updated = false;
    b = updater.getBinder();
    expect(b[0].containsErrors()).toBe(true);
    expect(b[1].containsErrors()).toBe(false);
    expect(b.containsErrors()).toBe(true);
    expect(b.childrenContainErrors()).toBe(true);
    updater.updated = false;
    b[1].setValue(2);
    updater.updated = false;
    b = updater.getBinder();
    expect(b[0].containsErrors()).toBe(true);
    expect(b[1].containsErrors()).toBe(false);
    //expect(b._$oldChildrenHaveErrors).toBe(true);
    expect(b.containsErrors()).toBe(true);
    expect(b.childrenContainErrors()).toBe(true);
});

test('containsErrors method on object', function() {
    updater.updated = false;
    var b = updater.getBinder().setValue({sa: 'aa', sb: 'bb'});
    updater.updated = false;
    b.sa.setError('Error message 2');
    updater.updated = false;
    b = updater.getBinder();
    expect(b.sa.containsErrors()).toBe(true);
    expect(b.sb.containsErrors()).toBe(false);
    expect(b.containsErrors()).toBe(true);
    expect(b.childrenContainErrors()).toBe(true);
    updater.updated = false;
    b.sb.setValue('bbb');
    updater.updated = false;
    b = updater.getBinder();
    expect(b.sa.containsErrors()).toBe(true);
    expect(b.sb.containsErrors()).toBe(false);
    expect(b.containsErrors()).toBe(true);
    expect(b.childrenContainErrors()).toBe(true);
});

test('containsErrors method on array (resolved promise)', function() {
    updater.updated = false;
    var b = updater.getBinder().setValue([0, 1]);
    updater.updated = false;
    return b[0].setError(Promise.resolve('Error message 3')).then(function() {
        expect(updater.updated).toBe(true);
        b = updater.getBinder();
        expect(b[0].getError()).toBe('Error message 3');
        expect(b[0].containsErrors()).toBe(true);
        expect(b.containsErrors()).toBe(true);
        expect(b.childrenContainErrors()).toBe(true);
    });
});

test('containsErrors method on array (rejected promise)', function() {
    updater.updated = false;
    var b = updater.getBinder().setValue([0, 1]);
    updater.updated = false;
    return b[0].setError(Promise.reject('Error message 4')).then(function() {
        expect(updater.updated).toBe(true);
        b = updater.getBinder();
        expect(b[0].getError()).toBe('Error message 4');
        expect(b[0].containsErrors()).toBe(true);
        expect(b.containsErrors()).toBe(true);
        expect(b.childrenContainErrors()).toBe(true);
    });
});

test('containsErrors method on object (resolved promise)', function() {
    updater.updated = false;
    var b = updater.getBinder().setValue({sa: 'aa', sb: 'bb'});
    updater.updated = false;
    return b.sa.setError(Promise.resolve('Error message 5')).then(function() {
        expect(updater.updated).toBe(true);
        b = updater.getBinder();
        expect(b.sa.getError()).toBe('Error message 5');
        expect(b.sa.containsErrors()).toBe(true);
        expect(b.containsErrors()).toBe(true);
        expect(b.childrenContainErrors()).toBe(true);
    });
});

test('containsErrors method on object (rejected promise)', function() {
    updater.updated = false;
    var b = updater.getBinder().setValue({sa: 'aa', sb: 'bb'});
    updater.updated = false;
    return b.sa.setError(Promise.reject('Error message 6')).then(function() {
        expect(updater.updated).toBe(true);
        b = updater.getBinder();
        expect(b.sa.getError()).toBe('Error message 6');
        expect(b.sa.containsErrors()).toBe(true);
        expect(b.containsErrors()).toBe(true);
        expect(b.childrenContainErrors()).toBe(true);
    });
});
