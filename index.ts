import QueryableLogger from './logger';

// Initialize a logger instance
const logger = new QueryableLogger(['foo', 'bar'], true);

// Log some messages
logger.log('Hello world!');
logger.warn('This is a warning!');
logger.error('This is an error!');

// Log some advanced messages
logger.log('This is an error!', { foo: 'bar' });
logger.warn('This is a warning!', { foo: 'bar' });
logger.error('This is an error!', ["trace stack 1", "trace stack 2"], 404, { foo: 'bar' }, { baz: 'qux' });

// Query the log messages
let query = logger.select(['id', 'timestamp', 'message', 'foo']).from('warn').where('message', ['LIKE', 'a warning!']);
let result = query.get();

console.log(result);