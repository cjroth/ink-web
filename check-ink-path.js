import { resolve } from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const inkPath = require.resolve('ink');
console.log('Ink resolved to:', inkPath);

