/*global expect*/

test('typescript compile has no errors', function() {
    var child_process = require('child_process');
    var o = child_process.execSync('tsc --strict --noEmit test/typescript/code/*.ts');
    expect(o.toString()).toBe('');
});
