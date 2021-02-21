const fs = require('fs');

const fileName = __dirname + '/sys_first_name';
/**
 * Removes unusual names from base
 * - Names with only two letters
 */
const firstNames = fs.readFileSync(fileName).toString().split('\n');
console.log('before', firstNames.length);

const deduped = {};

firstNames.forEach((name) => {
  deduped[name.toLowerCase()] = true;
});

const sanitized = Object.keys(deduped);

console.log('after', sanitized.length);

fs.writeFileSync(fileName, sanitized.sort().join('\n'));


