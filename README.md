# Queryable Logger
TypeScript logger that can be queried for log messages.

[![npm version](https://badge.fury.io/js/queryable-logger.svg)](https://badge.fury.io/js/queryable-logger)
[![npm](https://img.shields.io/npm/dt/queryable-logger.svg)](https://www.npmjs.com/package/queryable-logger)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
## Installation
```bash
npm install --save-dev npm-queryable-logger
```

## Usage
```typescript
import QueryableLogger from 'npm-queryable-logger';

// Initialize a logger instance
const logger = new QueryableLogger();

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

// result = [
//   {
//     id: 2,
//     timestamp: 1667279539356,
//     message: 'This is a warning!',
//     foo: null
//   },
//   {
//     id: 5,
//     timestamp: 1667279539356,
//     message: 'This is a warning!',
//     foo: 'bar'
//   }
// ]

// Save the log message to local storage
const id: string = logger.saveToLocalStore();

// Retrieve an session from local storage
const session: QueryableLogger = QueryableLogger.loadFromLocalStore(id);

// Clear the local storage from logger instances
QueryableLogger.clearLocalStore();
```

## API
### QueryableLogger
#### Constructor
```typescript
constructor(userDefinedAttrs?: string[], enablePrint: boolean = false);
```
##### Parameters
| Name | Type | Description |
| --- | --- | --- |
| userDefinedAttrs | string[] | User defined attributes that can be logged (currently only used to safe guard reads) |
| enablePrint | boolean | Enable printing of log messages to the console |

#### Methods
##### log
```typescript
log(message: string, ...args: Record<string, any>): Log;
```
Log a message. The message will be printed to the console if `enablePrint` or `displayInfo` is set to `true` in the constructor. The message will be saved to the log store. The message will be returned as a `Log` object. See `Log` for more information.
###### Parameters
| Name | Type | Description |
| --- | --- | --- |
| message | `string` | The message to log |
| `...args` | `Record<string, any>` | Additional arguments to log |

##### warn
```typescript
warn(message: string, ...args: Record<string, any>): Log;
```
Log a warning message. The message will be printed to the console if `enablePrint` or `displayInfo` is set to `true` in the constructor. The message will be saved to the log store. The message will be returned as a `Log` object. See `Log` for more information.
###### Parameters
| Name | Type | Description |
| --- | --- | --- |
| message | `string` | The message to log |
| `...args` | `Record<string, any>` | Additional arguments to log |

##### error
```typescript
error(message: string, trace: string[] = [], errorCode: number = 400, ...args: Record<string, any>[]): Log {
```
Log an error message. The message will be printed to the console if `enablePrint` or `displayInfo` is set to `true` in the constructor. The message will be saved to the log store. The message will be returned as a `Log` object. See `Log` for more information. Error messages may optionally have a trace stack, an error code, and additional arguments. Errors have a defaulted paramater `resolved = False` that can be set to `true` if the error has been resolved.
###### Parameters
| Name | Type | Description |
| --- | --- | --- |
| message | `string` | The message to log |
| trace | `string[]` | The trace stack |
| errorCode | `number` | The error code |
| `...args` | `Record<string, any>` | Additional arguments to log |


##### getLog
```typescript
getLog(id: number): Log;
```
Get a log message by its id.
###### Parameters
| Name | Type | Description |
| --- | --- | --- |
| id | `number` | The id of the log message |

##### getLogs
```typescript
getLogs(): Log[];
```
Get all log messages.

##### getInfo
```typescript
getInfo(): Log[];
```
Get all info messages.

##### getWarn
```typescript
getWarn(): Log[];
```
Get all warning messages.

##### getError
```typescript
getError(): Log[];
```
Get all error messages.

##### resolveError
```typescript
resolveError(id: number): Log;
```
Sets an error log message to resolved.
###### Parameters
| Name | Type | Description |
| --- | --- | --- |
| id | `number` | The id of the log message |

##### resolveAllErrors
```typescript
resolveAllErrors(): Log[];
```
Sets all error log messages to resolved.

##### clearLogs
```typescript
clearLogs(): void;
```
Clears all log messages.

##### clearErrors
```typescript
clearErrors(): void;
```
Clears all error messages.

##### clearWarnings
```typescript
clearWarnings(): void;
```

##### clearInfo
```typescript
clearInfo(): void;
```
Clears all info messages.

##### displayLogs
```typescript
displayLogs(): void;
```
Prints all log messages to the console using `console.table`.

##### displayErrors
```typescript
displayErrors(): void;
```
Prints all error messages to the console using `console.table`.

##### displayWarnings
```typescript
displayWarnings(): void;
```
Prints all warning messages to the console using `console.table`.

##### displayInfo
```typescript
displayInfo(): void;
```
Prints all info messages to the console using `console.table`.

##### downloadJSON
```typescript
downloadJSON(): void;
```
Downloads the log messages as a JSON file. This is only supported in browsers.

##### getJSON
```typescript
getJSON(): string;
```
Returns a JSON string of the log messages.

##### getCSV
```typescript
getCSV(logs: Logs[] = this.logs): string;
```
Returns a CSV string of the log messages with columns `id`, `message`, `timestamp`, `datetime`, `userDefinedAttrs`.
###### Parameters
| Name | Type | Description |
| --- | --- | --- |
| logs | `Logs[]` | The log messages to format as csv |

##### downloadCSV
```typescript
downloadCSV(logs: Logs[] = this.logs): void;
```
Downloads the log messages as a CSV file. This is only supported in browsers.
###### Parameters
| Name | Type | Description |
| --- | --- | --- |
| logs | `Logs[]` | The log messages to download |

##### saveToLocalStore
```typescript
saveToLocalStore(): number;
```
Saves the log messages to local storage. Returns the id of the log messages. All log messages are saved to local storage with the key `QueryableLoggerNPM-{id}`.

##### loadFromLocalStore
```typescript
static loadFromLocalStore(id: number): QueryableLogger | null;
```
Loads the log messages from local storage. Returns a `QueryableLogger` object. Returns `null` if the log messages are not found.
###### Parameters
| Name | Type | Description |
| --- | --- | --- |
| id | `number` | The id of the log messages |

##### clearLocalStore
```typescript
static clearLocalStore(id?: number): void;
```
Clears the log messages from local storage. If no id is provided, all log messages are cleared.
###### Parameters
| Name | Type | Description |
| --- | --- | --- |
| id | `number` (optional) | The id of the log messages |

##### overrideLogs
```typescript
overrideLogs(logs: Log[]): void;
```
Overrides the log messages with the provided log messages.
###### Parameters
| Name | Type | Description |
| --- | --- | --- |
| logs | `Log[]` | The log messages to override |

##### select
```typescript
select(columns: string[] = ['id', 'message', 'type', 'timestamp', 'userDefinedAttrs']): LoggerQueryContainer;
```
Selects the columns to display in the console table. The default columns are `id`, `message`, `type`, `timestamp`, and `userDefinedAttrs`. Every query must start with a select.

###### Parameters
| Name | Type | Description |
| --- | --- | --- |
| columns | `string[]` | The columns to select |

##### from
```typescript
static from(selected: Log[], type = "all" || "error" || "warn" || "log"): Log[];
```
Selects the type of log messages to query. The default type is `all`. The type can be `all`, `error`, `warn`, or `log`. This method is not meant to be called directly. It is called by the `LoggerQueryContainer` class.

###### Parameters
| Name | Type | Description |
| --- | --- | --- |
| selected | `Log[]` | The log messages to query |
| type | `string` | The type of log messages to query |

##### where
```typescript
static where(selected: Log[], key: string, value: (string | number)[]): Log[];
```
Filters the log messages by the provided key and value. This method is not meant to be called directly. It is called by the `LoggerQueryContainer` class.

###### Parameters
| Name | Type | Description |
| --- | --- | --- |
| selected | `Log[]` | The log messages to query |
| key | `string` | The key to filter by |
| value | `(string \| number)[]` | The value to filter by (e.g. `('key', ['LIKE', 'value'])` |

##### LoggerQueryContainer.get()
```typescript
get(): Log[];
```
Returns the log messages after the query has been executed. This method must be called at the end of the query, although it is not part of the `QueryableLogger` class. This method is not a child of the `QueryableLogger` class.

##### setDisplayLogs
```typescript
setDisplayLogs(object: Record<string, boolean>) {
```
Overrides default behaviour of issuing `console` calls on the use of `log`, `warn`, and `error`.
###### Parameters
| Name | Type | Description |
| --- | --- | --- |
| object | `Record<string, boolean>` | An object with keys `log`, `warn`, and `error` |

###### object example
```typescript
{
    "displayLogs": true,
    "displayErrors": true,
    "displayWarnings": true,
    "displayInfos": true,
    "displayResolvedErrors": true,
    "displayUnresolvedErrors": true,
}
```

### LoggerQueryContainer
The `LoggerQueryContainer` class is used to build queries. It is not meant to be used directly. It is used by the `QueryableLogger` class. When a query is initiated using the `QueryableLogger.select` method, a `LoggerQueryContainer` object is returned. The `LoggerQueryContainer` object has the following methods:

##### from
```typescript
from(type = "all" || "error" || "warn" || "log"): LoggerQueryContainer;
```
Delegates execution to `QueryableLogger.from` and wraps the result in a `LoggerQueryContainer` object.

###### Parameters
| Name | Type | Description |
| --- | --- | --- |
| type | `string` | The type of log messages to query |

##### where
```typescript
where(key: string, value: (string | number)[]): LoggerQueryContainer;
```
Delegates execution to `QueryableLogger.where` and wraps the result in a `LoggerQueryContainer` object.

###### Parameters
| Name | Type | Description |
| --- | --- | --- |
| key | `string` | The key to filter by |
| value | `(string \| number)[]` | The value to filter by (e.g. `('key', ['LIKE', 'value'])` |

##### get
```typescript
get(): Log[];
```
Uses columns from `QueryableLogger.select()` to filter the generated result and return the result as an array of `Log` objects.

### Log
`Log` is an algebriac datatype that represents a log message. It groups log messages into three categories: `info`, `warn`, `error`. It has the following definition:
```typescript
type Log = LogError | LogWarning | LogInfo;
```

### LogMessage
`LogMessage` is a data interface that represents information shared by `LogError`, `LogWarning`, and `LogInfo`. It has the following definition:
```typescript
interface LogMessage {
    id: number;
    message: string;
    type: "info" | "warn" | "error";
    timestamp: number;
    datetime: string;
    userDefinedAttrs: Record<string, any>;
}
```

#### Paramaters for LogMessage
| Name | Type | Description |
| --- | --- | --- |
| id | `number` | The id of the log message |
| message | `string` | The message of the log message |
| type | `"info" \| "warn" \| "error"` | The type of the log message |
| timestamp | `number` | The timestamp of the log message |
| datetime | `string` | The ISO representation of the timestamp |

### LogError
`LogError` is a data interface that represents an error log message. It defines additional special paramaters to the error message. It has the following definition:
```typescript
interface LogError extends LogMessage {
    type: "error";
    trace: string[];
    resolved: boolean;
    errorCode: number;
}
```

#### Paramaters for LogError
| Name | Type | Description |
| --- | --- | --- |
| trace | `string[]` | The stack trace of the error |
| resolved | `boolean` | Whether the error has been resolved |
| errorCode | `number` | The error code of the error |

### LogWarning
`LogWarning` is a data interface that represents a warning log message. It has the following definition:
```typescript
interface LogWarning extends LogMessage {
    type: "warn";
}
```

### LogInfo
`LogInfo` is a data interface that represents an info log message. It has the following definition:
```typescript
interface LogInfo extends LogMessage {
    type: "info";
}
```

## Future Work
- [ ] Add support for indexing and index stores
- [ ] Add support for custom loggers

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## Authors and acknowledgment
- [**@omargfh**](www.github.com/omargfh) - *Initial work*

## Project status
This project is currently in development.

## Contact
- [**@omargfh**](www.github.com/omargfh)

## License
[MIT](https://choosealicense.com/licenses/mit/)
