const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'Technical-docs', 'README.md');
const data = fs.readFileSync(filePath, 'utf8');

const result = data.replace(/\(modules/g, '(./modules');

fs.writeFileSync(filePath, result, 'utf8');
