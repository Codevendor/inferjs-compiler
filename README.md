[inferjs]: https://github.com/Codevendor/inferjs
[inferjs-library]: https://github.com/Codevendor/inferjs-library
[inferjs-compiler]: https://github.com/Codevendor/inferjs-compiler
[infer-object]: https://github.com/Codevendor/inferjs-library
[logo]: https://github.com/Codevendor/inferjs-compiler/blob/main/assets/images/inferjs-logo.png?raw=true
[arrow]: https://github.com/Codevendor/inferjs-compiler/blob/main/assets/images/arrowright.png?raw=true
[library-docs]: https://github.com/Codevendor/inferjs-library/
[library-issues]: https://github.com/Codevendor/inferjs-library/issues
[compiler-docs]: https://github.com/Codevendor/inferjs-compiler/
[compiler-issues]: https://github.com/Codevendor/inferjs-compiler/issues

![InferJS Library][logo]

## ![Heading][arrow]&nbsp;&nbsp;InferJS-Compiler: Overview

A compiler that processes **JSDoc** comments into an [**InferObject**][infer-object] file, for utilizing with the [**InferJS-Library**][inferjs-library]. The [**InferJS-Compiler**][inferjs-compiler] is part of a bigger project called [**InferJS**][inferjs]. The compiler can be used for other third party projects, that may need to interpret **JSDoc** comments into **JSON** type files.

### Built With
* [JSDoc Version 3+](https://jsdoc.app/)
* [Node.js Version 12+](https://nodejs.org/)
* [NPM Version 5+](https://www.npmjs.com/)
* [Visual Studio Code](https://code.visualstudio.com/)

## ![Heading][arrow]&nbsp;&nbsp;InferJS-Compiler: Installation

To install the latest version of [**InferJS-Compiler**][inferjs-compiler] locally with `npm`:
#### Install: [Locally]()
```sh
npm install inferjs-compiler
```

#### Install: [Globally]()
```sh
npm install -g inferjs-compiler 
```

**Optional**: If you would like to download the repo source code with `git`:
```sh
git clone https://github.com/Codevendor/inferjs-compiler.git
```





## ![Heading][arrow]&nbsp;&nbsp;InferJS-Compiler: CLI Usage

To use the [**InferJS-Compiler**][inferjs-compiler] from the command line and create [**InferObjects**][infer-object], please use the following commands.
```sh
# Global: CLI Run Format - InferJS-Compiler Globally Installed: 
inferjs-compiler <cmd> <input> <inputOptions> <outputOptions> -o <output>

# or

# Local: CLI Node Run Format - InferJS-Compiler Not Globally Installed
node <path/to/inferjs-compiler> <cmd> <input> <inputOptions> <outputOptions> -o <output>
```

### InferJS-Compiler: [parse-files]()

| Action&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|Cmd| Description |
| :-- | :--: | :-- |               
| [parse-files]()        | [-f]()          | Parses single or multiple **JavaScript** files, looking for **JSDoc** multi-line comments. Parses the **JSDoc** comments into an [**InferObject**][infer-object], that can be outputed to the terminal or specified **output** file. |

#### Example - Parse Single Input File to Terminal Output:
```sh
foo@console:~$: inferjs-compiler -f ./path/test1.js -o  
```

#### Example - Parse Single Input File to Output File:
```sh
foo@console:~$: inferjs-compiler -f ./path/test1.js -o ./path/infer-object.js
```

#### Example - Parse Multiple Input Files to Terminal Output:
```sh
foo@console:~$: inferjs-compiler -f ./path/test1.js ./path/test2.js -o 
```

#### Example - Parse Multiple Input Files to Output File:
```sh
foo@console:~$: inferjs-compiler -f ./test1.js ./test2.js -o ./path/infer-object.js 
```


### InferJS-Compiler: [parse-directories]()

| Action&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|Cmd| Description |
| :-- | :--: | :-- |               
| [parse-directories]()        | [-d]()          | Parses single or multiple directory paths to **JavaScript** files, looking for **JSDoc** multi-line comments. Parses the **JSDoc** comments into an [**InferObject**][infer-object], that can be outputed to the terminal or specified **output** file. |

#### Example - Parse Single Directory to Terminal Output:
```sh
foo@console:~$: inferjs-compiler -d ./path/directory -o  
```

#### Example - Parse Single Directory to Output File:
```sh
foo@console:~$: inferjs-compiler -d ./path/directory -o ./path/infer-object.js
```

#### Example - Parse Multiple Directories to Terminal Output:
```sh
foo@console:~$: inferjs-compiler -d ./path/directory1 ./path/directory2 -o 
```

#### Example - Parse Multiple Directories to Output File:
```sh
foo@console:~$: inferjs-compiler -d ./path/directory1 ./path/directory2 -o ./path/infer-object.js 
```

### InferJS-Compiler: [parse-file-list]()

| Action&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|Cmd| Description |
| :-- | :--: | :-- |               
| [parse-file-list]()        | [-l]()          | Parses a delimited file with **JavaScript** file paths, looking for **JSDoc** multi-line comments per file. Parses the **JSDoc** comments into an [**InferObject**][infer-object], that can be outputed to the terminal or specified **output** file. Delimiter Defaults: to `newline` character. |

#### Example - Parse File List to Terminal Output:
```sh
foo@console:~$: inferjs-compiler -l ./path/file-list.txt -o  
```

#### Example - Parse File List to Output File:
```sh
foo@console:~$: inferjs-compiler -l ./path/file-list.txt -o ./path/infer-object.js
```

### InferJS-Compiler: [combine]()

| Action&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|Cmd| Description |
| :-- | :--: | :-- |               
| [combine]()        | [-c]()          | Combines multiple [**InferObject**][infer-object] files together, outputed to the terminal or specified output file.  |

#### Example - Combine Multiple InferObject Files to Terminal Output:
```sh
foo@console:~$: inferjs-compiler -f ./path/infer-object1.js ./path/infer-object2.js -o 
```

#### Example - Combine Multiple InferObject Files to Output File:
```sh
foo@console:~$: inferjs-compiler -f ./path/infer-object1.js ./path/infer-object2.js -o ./path/new-infer-object.js 
```




### InferJS-Compiler: [Options]()
| Option&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Cmd | Description |
| :-- | :--: | :-- |
| [--help]() | [-h]() |  Displays the help menu. |
| [--preview]() | [-p]() | Displays information about the files to be processed, without actually executing process. |
| [--quiet]() | [-q]() | Hide all display information from standard output. |
| [--stat]() | [-s]() | Displays statistics about total infers parsed from files or directories. |
| [--version]() | [-v]() | Displays the version number of the [**InferJS-Compiler**][inferjs-compiler]. |

### InferJS-Compiler: [INPUT-OPTIONS]()
| Option&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Description |
| :-- | :-- |
| [--input-options-flags]() | The file input flags for reading file. Flags: (`r`, `r+`, `rs`, `rs+`, `w+`, `wx+`, `a+`, `ax+`) |
| [--input-options-encoding]() | The encoding type for the input files. Example: `UTF8`. |
| [--input-options-recursive]() | Used in combination with [-d](), to recursively navigate through sub directories, looking for files to parse. |
| [--input-options-file-extensions]() | Used in combination with [-d](), to allow only specific file extensions to be parsed from directories. |
| [--input-options-delimiter]() | Used in combination with [-l](), to specify the delimiter for parsing the file list with. Defaults to `newline` character. |

### InferJS-Compiler: [OUPUT-OPTIONS]()
| Option&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Description |
| :-- | :-- |
| [--output-options-flags]() | The file output flags for writing file. Flags: (`r+`, `rs+`, `w`, `wx`, `w+`, `wx+`, `a`, `ax`, `a+`, `ax+`) |
| [--output-options-module]() | Generates the output [**InferObject**][infer-object], in a specific module type format. Formats: (`esmodule`, `commonjs`, `script`, `json`). Defaults to `script`. |

### InferJS-Compiler: [NodeJS Read/Write Flags]()
| Flag&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| Description |
|:-- | :-- |
| [r]() | Open file for `reading`. An exception occurs if the file does not exist. |
| [r+]() | Open file for `reading` and `writing`. An `exception` occurs if the file does not exist. |
| [rs]() | Open file for `reading` in `synchronous` mode. |
| [rs+]() | Open file for `reading` and `writing`, asking the OS to open it `synchronously`. See notes for `rs` about using this with caution. |
| [w]() | Open file for `writing`. The file is created (if it does not exist) or truncated (if it exists). |
| [wx]() | Like `w` but fails if the path exists. |
| [w+]() | Open file for `reading` and `writing`. The file is created (if it does not exist) or truncated (if it exists). |
| [wx+]() | Like `w+` but fails if path exists. |
| [a]() | Open file for `appending`. The file is created if it does not exist. |
| [ax]() | Like `a` but fails if the path exists. |
| [a+]() | Open file for `reading` and `appending`. The file is created if it does not exist. |
| [ax+]() | Like `a+` but fails if the the path exists. |




    


    
        


<!-- ROADMAP -->
## ![Heading][arrow]&nbsp;&nbsp;InferJS-Compiler: Roadmap
- [[ April 2023 ]()] - Create a plan for text localization with the [**InferJS-Compiler**][inferjs-compiler] repo.
- [[ Jan 25, 2023 ]()] - Under Development and Testing


<!-- CONTRIBUTING -->
## ![Heading][arrow]&nbsp;&nbsp;InferJS-Compiler: Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag `enhancement`.
Don't forget to give the project a [⭐ star](), Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request





<!-- LICENSE -->
## ![Heading][arrow]&nbsp;&nbsp;InferJS-Compiler: License

Distributed under the **MIT** License. See `LICENSE.txt` for more information.





<!-- CONTACT -->
## ![Heading][arrow]&nbsp;&nbsp;InferJS-Compiler: Support Related

 - [**InferJS-Compiler** Documentation][compiler-docs] - Information documentation for the **InferJS-Compiler**.
 - [**InferJS-Compiler** Issues][compiler-issues] - Direct all questions about the **InferJS-Compiler**.
