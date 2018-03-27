/*global expect*/
var binder = require('../../../src/binder');
var createAbstractBinderTests = require('./createAbstractBinderTests');
var testUpdateBinder = require('./testUpdateBinder');

function testChild(b, key, value) {
        expect(b.getValue()[key]).toBe(value);
        expect(b.get(key)).toBeInstanceOf(binder);
        expect(b[key]).toBeInstanceOf(binder);
        expect(b.get(key)).toBe(b[key]);
        expect(b.get(key).getValue()).toBe(value);
        expect(b.has(key)).toBe(true);
}

function testNoChild(b, key) {
        expect(b.getValue()[key]).toBe(undefined);
        expect(b.get(key)).toBe(undefined);
        expect(b[key]).toBe(undefined);
        expect(b.get(key)).toBe(b[key]);
        expect(b.has(key)).toBe(false);
}

function createMapBinderTests(updater) {
    createAbstractBinderTests(updater);
    
    test('has same properties', function() {
        updater.updated = false;
        updater.getBinder().setValue(updater.initialValue);
        
        var b = updater.getBinder();
        var value = b.getValue();
        
        for (var key in value) {
            expect(b[key]).toBeInstanceOf(binder);
            expect(b[key].getValue()).toBe(value[key]);
        }
        
        for (var key in b) {
            expect(b[key]).toBeInstanceOf(binder);
            expect(b[key].getValue()).toBe(value[key]);
            expect(value).toHaveProperty(key);
        }
    });
    
    test('get, set & has methods', function() {
        var b = updater.getBinder();
        
        testNoChild(b, 'h1');
        
        var h1 = {h1: 'h1v'};
        
        b = testUpdateBinder(updater, function() {
            return updater.getBinder().set('h1', h1);
        });
        
        testChild(b, 'h1', h1);
    });
    
    test('set method of a child', function() {
        var h6 = {h6: 'h6v'};
        updater.updated = false;
        updater.getBinder().setValue(h6);
        
        var b = testUpdateBinder(updater, function() {
            return updater.getBinder().set('h6', 'h6_2v').h6;
        }, function() {
            return updater.getBinder().h6;
        }).getParent();
        
        testChild(b, 'h6', 'h6_2v');
    });
    
    test('clear method', function() {
        var h2 = {h2: 'h2v'};
        updater.updated = false;
        updater.getBinder().set('h2', h2);
        
        var b = testUpdateBinder(updater, function() {
            return updater.getBinder().clear();
        });
        
        expect(b.size).toBe(0);
        
        for (var key in b) {
            throw new Error('Unknown key ' + key);
        }

        for (var key in b.getValue()) {
            throw new Error('Unknown key ' + key);
        }
    });
    
    test('set inner value', function() {
        var h3 = {
            h3_1: 'h3_1v',
            h3_2: 'h3_2v',
            h3_3: 'h3_3v'
        };
        updater.updated = false;
        var b = updater.getBinder().setValue(h3);
        
        expect(b.size).toBe(3);
        
        testChild(b, 'h3_1', 'h3_1v');
        testChild(b, 'h3_2', 'h3_2v');
        testChild(b, 'h3_3', 'h3_3v');

        var oldBinder = b;
        b = testUpdateBinder(updater, function() {
            return updater.getBinder().h3_2.setValue('h3_2_1v');
        }, function() {
            return updater.getBinder().h3_2;
        }).getParent();
        
        expect(b.size).toBe(3);

        testChild(b, 'h3_1', 'h3_1v');
        expect(b.get('h3_1')).toBe(oldBinder.get('h3_1'));
        testChild(b, 'h3_2', 'h3_2_1v');
        expect(b.get('h3_2')).not.toBe(oldBinder.get('h3_2'));
        testChild(b, 'h3_3', 'h3_3v');
        expect(b.get('h3_3')).toBe(oldBinder.get('h3_3'));
        
        expect(b).not.toBe(oldBinder);
        expect(b.getValue()).toEqual({
            h3_1: 'h3_1v',
            h3_2: 'h3_2_1v',
            h3_3: 'h3_3v'
        });
        
        for (var key in b) {
            if (key !== 'h3_1' && key !== 'h3_2' && key !== 'h3_3') {
                throw new Error('Unknown key ' + key);
            }
        }

        for (var key in b.getValue()) {
            if (key !== 'h3_1' && key !== 'h3_2' && key !== 'h3_3') {
                throw new Error('Unknown key ' + key);
            }
        }
    });
    
    test('delete method', function() {
        var h4 = {
            h4_1: 'h4_1v',
            h4_2: 'h4_2v',
            h4_3: 'h4_3v'
        };
        updater.updated = false;
        var b = updater.getBinder().setValue(h4);
        
        expect(b.size).toBe(3);
        
        testChild(b, 'h4_1', 'h4_1v');
        testChild(b, 'h4_2', 'h4_2v');
        testChild(b, 'h4_3', 'h4_3v');

        var oldBinder = b;
        b = testUpdateBinder(updater, function() {
            return updater.getBinder().delete('h4_2');
        });
        
        expect(b.size).toBe(2);
        
        testChild(b, 'h4_1', 'h4_1v');
        expect(b.get('h4_1')).toBe(oldBinder.get('h4_1'));
        testNoChild(b, 'h4_2');
        testChild(b, 'h4_3', 'h4_3v');
        expect(b.get('h4_3')).toBe(oldBinder.get('h4_3'));
        
        expect(b).not.toBe(oldBinder);
        expect(b.getValue()).toEqual({
            h4_1: 'h4_1v',
            h4_3: 'h4_3v'
        });
        
        for (var key in b) {
            if (key !== 'h4_1' && key !== 'h4_3') {
                throw new Error('Unknown key ' + key);
            }
        }

        for (var key in b.getValue()) {
            if (key !== 'h4_1' && key !== 'h4_3') {
                throw new Error('Unknown key ' + key);
            }
        }
    });
    
    test('forEach method', function() {
        var h5 = {
            h5_1: 'h5_1v',
            h5_2: 'h5_2v',
            h5_3: 'h5_3v'
        };
        updater.updated = false;
        var b = updater.getBinder().setValue(h5);
        b.forEach(function(value, key, container) {
            expect(container).toBe(b);
            expect(value).toBeInstanceOf(binder);

            switch(key) {
                case 'h5_1':
                    testChild(container, 'h5_1', 'h5_1v');
                    break;
                case 'h5_2': 
                    testChild(container, 'h5_2', 'h5_2v');
                    break;
                case 'h5_3': 
                    testChild(container, 'h5_3', 'h5_3v');
                    break;
                default:
                    throw new Error('Unknown key ' + key);
            }
        });
    });
}
module.exports = createMapBinderTests;