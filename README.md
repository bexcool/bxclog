# BXCLog

BeXCool Logger  
A simple logging utility module

## How to use

- [Javascript](#javascript)  
- [Typescript](#typescript)  
- [C++](#cpp)

## Options

### locale

Type: `string`  
Default: `"auto"`  
Any locale code (eg. en-GB, de-DE, en-US)  
Use "auto" to set automatically from OS.

### timeZone

Type: `string`  
Default: `"auto"`  
Any [timezone](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)  
Use "auto" to set automatically from OS.

### brackets

Type: `string`  
Default: `"[]"`  
Which type of brackets to use.  
Available options (Note: Any field is a valid option)

| Shape  | Name        | Character |
| ------ | ----------- | --------- |
| round  | parentheses | ( )       |
| square | box         | [ ]       |
| braces | curly       | { }       |
| angle  | chevrons    | < >       |

### saveToFile

Type: `boolean`  
Default: `false`  
Should the log be saved into a file?

### saveFilePath

Type: `string`  
Default: `"logs"`  
Where should the file be saved?  
[SaveToFile](#saveToFile) must be enabled for this to have effect.  
Relative to the entry point (eg. index.js, app.exe, ...).

### showDebug

Type: `boolean`  
Default: `true`  
Changes whether the debug method displays anything.  
Should be changed by the value of an environment variable (eg. `environment == "release"`)

## Javascript

Install with npm:  
`npm install bxclog`

Example code:

```js
const { BXCLog } = require("bxclog");

/**
 * This BXCLog instance should be stored in a file like "lib.js" 
 * in the exports object.
 * You can save a lot of performance and resources by doing that, 
 * because creating new instances every time you need to log 
 * something will have a negative impact on performance
 */
const bxclogger = new BXCLog({
    saveToFile: true,
    brackets:   "<>",
});

const service = "CatsService";
bxclogger.debug("process.argv", process.argv);
bxclogger.info(service, "purr... meow, meow!", "we think the number", Math.random(), "is really cool... meow 😺");
bxclogger.warn(service, 
  "The cats are hungry", "\n", "You better go feed them right now \n", 
  "They also said that they need exactly this many kilos of food:", 68429796945127451n, "...it should be enough for about one and a half days 😼");
bxclogger.error(service, "The cats are really hungry and are starting to delete your programs 😠 Go feed them right now 🚔👮‍♂️");
```

## Typescript

Install with npm:

`npm install bxclog`

Example code:

```ts
import { BXCLog } from "bxclog";

/**
 * You can copy the rest of the code from Javascript, 
 * The only difference is that instead of the "exports" object you use es6 export ("export const bxclogger = ...")
 */
```

## CPP

Note: Has been tested only with Visual Studio 2019

Install by cloning the repository into a directory like `deps` in your solution

`git clone https://github.com/Spejik/bxclog.git`

Then you need to include the repo as a project and set it as a Static Library.

[//]: # (todo: put an image here)

Next, add the following directories into the compiler... or you know what, the code for C++ isn't even completed, so just don't do it yet 🙂 These are just notes for me so I know what to put here 😃

[//]: # (todo: put an image here)

### WIP
