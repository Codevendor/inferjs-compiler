<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/Codevendor/inferjs">
    <img src="https://github.com/Codevendor/inferjs/blob/main/assets/images/inferjs-logo.png?raw=true" alt="Logo" height="183px" width="443px" />
  </a>
</div>

## <img height="28" width="29" src="https://github.com/Codevendor/inferjs-compiler/blob/main/assets/images/arrowright.png?raw=true" style="float:left;" />&nbsp;&nbsp;InferJS-Compiler: Overview

A compiler that processes **JSDoc** comments into an [**InferObject**]() file, for utilizing with the [**InferJS-Library**](https://github.com/Codevendor/inferjs/tree/main/projects/inferjs-library). The [**InferJS-Compiler**](https://github.com/Codevendor/inferjs/tree/main/projects/inferjs-compiler) is part of a bigger project called [**InferJS**](https://github.com/Codevendor/inferjs/tree/main/projects/inferjs-library). The compiler can be used for other third party projects, that may need to interpret **JSDoc** comments into **JSON** type files.

### Built With
* [JSDoc Version 3+](https://jsdoc.app/)
* [Node.js Version 18+](https://nodejs.org/)
* [Visual Studio Code](https://code.visualstudio.com/)

## <img height="28" width="29" src="https://github.com/Codevendor/inferjs-compiler/blob/main/assets/images/arrowright.png?raw=true" style="float:left;" />&nbsp;&nbsp;InferJS-Compiler: Installation

To install the latest version of [**InferJS-Compiler**](https://github.com/Codevendor/inferjs/tree/main/projects/inferjs-compiler) with **npm**:
```ps
npm -i inferjs-compiler
```

**Optional**: If you would like to download the repo source code from **github**:
```ps
git clone https://github.com/Codevendor/inferjs.git
```


## <img height="28" width="29" src="https://github.com/Codevendor/inferjs/blob/main/assets/images/arrowright.png?raw=true" style="float:left;" />&nbsp;&nbsp;InferJS-Compiler: CLI Usage

To use the [**InferJS-Compiler**](https://github.com/Codevendor/inferjs/tree/main/projects/inferjs-compiler) from the command line and create [**InferObjects**](), please use the following commands.
```sh
# CLI Run Format - InferJS-Compiler Globally Installed: 
inferjs-compiler <cmd> <input> <inputOptions> <outputOptions> -o <output>

# or

# CLI Node Run Format - InferJS-Compiler Not Globally Installed
node <path/to/inferjs-compiler> <cmd> <input> <inputOptions> <outputOptions> -o <output>
```

### How to Parse: [Input Files]()

| Action&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|Cmd| Description |
| :-- | :--: | :-- |               
| [parse-files]()        | -f          | Parses single or multiple **JavaScript** files, looking for **JSDoc** multi-line comments. Parses the **JSDoc** comments into an [**InferObject**](), that can be outputed to the terminal or specified **output** file. |

#### Example - Parse Single Input File to Terminal Output:
```ps
foo@console:~$: inferjs-compiler -f ./path/test1.js -o  
```

#### Example - Parse Single Input File to Output File:
```ps
foo@console:~$: inferjs-compiler -f ./path/test1.js -o ./path/infer-object.js
```

#### Example - Parse Multiple Input Files to Terminal Output:
```ps
foo@console:~$: inferjs-compiler -f ./path/test1.js ./path/test2.js -o 
```

#### Example - Parse Multiple Input Files to Output File:
```ps
foo@console:~$: inferjs-compiler -f ./test1.js ./test2.js -o ./path/infer-object.js 
```


### How to Parse: [Input Directories]()

| Action&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|Cmd| Description |
| :-- | :--: | :-- |               
| [parse-directories]()        | -d          | Parses single or multiple directory paths to **JavaScript** files, looking for **JSDoc** multi-line comments. Parses the **JSDoc** comments into an [**InferObject**](), that can be outputed to the terminal or specified **output** file. |

#### Example - Parse Single Directory to Terminal Output:
```ps
foo@console:~$: inferjs-compiler -d ./path/directory -o  
```

#### Example - Parse Single Directory to Output File:
```ps
foo@console:~$: inferjs-compiler -d ./path/directory -o ./path/infer-object.js
```

#### Example - Parse Multiple Directories to Terminal Output:
```ps
foo@console:~$: inferjs-compiler -d ./path/directory1 ./path/directory2 -o 
```

#### Example - Parse Multiple Directories to Output File:
```ps
foo@console:~$: inferjs-compiler -d ./path/directory1 ./path/directory2 -o ./path/infer-object.js 
```

### How to Parse: [Input FileList]():

| Action&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|Cmd| Description |
| :-- | :--: | :-- |               
| [parse-file-list]()        | -l          | Parses a delimited file with **JavaScript** file paths, looking for **JSDoc** multi-line comments per file. Parses the **JSDoc** comments into an [**InferObject**](), that can be outputed to the terminal or specified **output** file. _Delimiter Defaults_: to **newline** character. |

#### Example - Parse File List to Terminal Output:
```ps
foo@console:~$: inferjs-compiler -l ./path/file-list.txt -o  
```

#### Example - Parse File List to Output File:
```ps
foo@console:~$: inferjs-compiler -l ./path/file-list.txt -o ./path/infer-object.js
```