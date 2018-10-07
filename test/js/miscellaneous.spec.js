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