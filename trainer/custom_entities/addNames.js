const fs = require('fs');

const fileName = __dirname + '/sys_last_name_spanish';

const getNames = () => {
  return ``;
};

const sanitized = getNames().split(',')
  .map((n) => n.trim());

console.log('Adding', sanitized.length)

fs.writeFileSync(fileName, sanitized.join('\n'));
