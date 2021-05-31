/***<Logic Programming Language.>
Copyright (C) <2021>  <Dr. Yaw Missah & Gerald Annan>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
***/

let SCOPE = false;
let SCOPE_LEVELS = 0;
let BLOCK_OPENS = [];
let READLINE = false;
let TOKENS_ = {};
let FILE_LINE_DATA = [];
let VALIDATED_SYNTAX = {};
let READING_USER_INPUT = false;
let LINE = 0;
let Tokens = [];
let FLOAT = false;
let EXPONENT = false;
let COMMENTARY = false;
let prevStates = (operatorStates = numberStates = []);
let prevStateIndex = [];
let prevType = undefined;

const array_ids = function_ids = [];
const fs = require('fs');
const prompts = require('prompts');
const readline = require('readline');
const { variables_regexp, user_definitions, user_ids, assignments_regexp, conditionals_regexp, iterations_regexp, functions_regexp } = require('./SymbolTable');
const { exception, error } = require('console'); user_ids.push("pi");
const { throws } = require('assert');
const { parse } = require('path'); const { EACCES } = require('constants');
const { exec } = require('child_process');
``
const readStream = fs.createReadStream('./source.xjs', 'utf8');

const sourceFile = readline.createInterface({input: readStream, output: process.stdout, terminal: false});

class UserException extends Error
{
    constructor(err)
    {
        super(err);
        this.err = err;
    }
}

const KEYS = ["let", "set", "initialize", "declare"];
const OPERATORS = [
  "to", 
  "as",
  "be",
  "plus",
  "minus",
  "times",
  'mod',
  'modulo',
  'modulus',
  "by",
  "of",
  "is greater than or equals",
  "is greater than or equal to",
  "equals",
  "is equal to",
  "is not",
  "is not equal to",
  "is less than",
  "is greater than",
  "is less than or equals",
  "is greater than",
  "is less than or equals",
  "is less than or equal to",
];
const KEYWORDS = [
    "true",
    "false",
    "and",
    "or",
  "let",
  "set",
  "be",
  "initialize",
  "to",
  "as",
  "plus",
  "minus",
  "times",
  "by",
  "of",
  "is greater than or equals",
  "is greater than or equal to",
  "is",
  "equals",
  "is equal to",
  "is not",
  "is not equal to",
  "is less than",
  "is greater than",
  "is less than or equals",
  "is greater than",
  "is less than or equals",
  "is less than or equal to",
];

async function requireUserSourceCode() {
    let CallPromise = new Promise(
        (resolve, reject) => {
            readStream.on('data', (chunk, err) => {
                if(!err)
                {
                    reduceFileCommentSystem(chunk).then(
                        (SUCCESS) => {
                            resolve(true);
                        }
                    )
                }
            })
        }
    )

    return await CallPromise;
}

async function reduceFileCommentSystem(SourceFileStringData) {
    const regExp = /(\/\*[\s\S]*\*\/)|(\/\/.*)/gmi;
    const trimRegExp = /^\s+|\s+$/;
    let StringBuffer = SourceFileStringData;
    let extractedBuffer = StringBuffer.replace(regExp, "");

    FILE_LINE_DATA = extractedBuffer.split(/\n/);
    // extractedBuf = extractedBuf.replace(trimRegExp, '');
    if (FILE_LINE_DATA.length) {
        
        return Promise.resolve(true);
        // const writeStream = fs.createWriteStream('./source-copy.xjs', 'utf8');
        // writeStream.write(extractedBuf, (err) => {
        //     if (err) {
        //         throw new UserException("Unexpected Error Encountered: " + err);
        //     }
        // })
        
    } else throw new UserException("Unexpected Error Encountered: " + err);
}

const LexicalTokenSystem = (dataStream, LINE, def=true) => {
    Tokens = [];
    if(def && LINE >= FILE_LINE_DATA.length)
        throw new UserException("RangeError Encountered: Specified line is too large! FILE_S: " + FILE_LINE_DATA.length);
    else
    {
        let LINE_DATA = def ? FILE_LINE_DATA[LINE] : LINE;

        const strExp = /[\"\']/;
        const numRegExp = /^[0-9]+e$|^[0-9]+$|^[0-9]+e[0-9]+$/;
        const operatorCollection = /[\+\-\*\/\=\%\?\!\|\>\&\^\<\~]/;
        const regExp = /(\w+)|[\|\(\)\{\}\[\]\;\,\.\*\+\:\=\-\?\"\"\'\&\^\%\$\#\@\!\`\~\\\/\<\>\s]/g;
        
        let expressions = LINE_DATA.match(regExp);
        
        if (!expressions) return null;

        for(let expression of expressions) {
            if(strExp.test(expression)) {

                if(operatorStates.length) {
                    let StructuredToken = operatorStates.join('');
                    if(/\/\//.test(StructuredToken)){
                        COMMENTARY = true;
                    }else{
                        Tokens = Tokens.concat([{ 'Operator': StructuredToken }]);
                        operatorStates = [];
                    }
                }

                if (numberStates.length) {
                    let StructuredToken = numberStates.join('');
                    Tokens = Tokens.concat([{'Number': StructuredToken}]);
                    numberStates = [];
                    FLOAT = false;
                }

                if(prevStates.length) {
                    if(expression == prevStates[prevStateIndex[prevStateIndex.length-1]]) {
                        prevStates = prevStates.concat([expression]);
                        prevStateIndex.pop();

                        if(!prevStateIndex.length) {
							let StructuredToken = prevStates.join('');
							
							if (/^\'.*\'$|^\".*\"$/.test(StructuredToken)) {
								Tokens = Tokens.concat([{ 'String': StructuredToken }]);
							} else {
								if(/true|false|and|or/i.test(StructuredToken)) {
									Tokens = Tokens.concat([{ 'Identifier': StructuredToken }]);
								}
								else if(KEYS.indexOf(StructuredToken) !== -1) {
									Tokens = Tokens.concat([{ 'Key': StructuredToken }]);
								}
								else if(OPERATORS.indexOf(StructuredToken) !== -1) {
									Tokens = Tokens.concat([{ 'Identifier': StructuredToken }]);
								}
								else {
									Tokens = Tokens.concat([{ 'Identifier': StructuredToken }]);
								}
							}

                            prevType = undefined;
                            prevStates = [];
                        }
                        
                    }else{
                        prevStates = prevStates.concat([expression]);
                        prevStateIndex = prevStateIndex.concat(prevStates.length - 1);
                    }
                }else{
                    prevStates = prevStates.concat([expression]);
                    prevStateIndex = prevStateIndex.concat(prevStates.length-1);
                    prevType = "string";
                }

            }else if(operatorCollection.test(expression)) {
                if(prevStates.length) {
                    prevStates = prevStates.concat([expression]);
                }else{
                    if(numberStates.length) {
                        if(/\-/.test(expression)) {
                            let exponent  = numberStates[numberStates.length-1];
                            if(/e/.test(exponent)) {
                                numberStates = numberStates.concat(expression);
                                EXPONENT = true;
                            }else{
                                let StructuredToken = numberStates.join('');
                                Tokens = Tokens.concat([{'Number': StructuredToken}]);
                                numberStates = [];
                                EXPONENT = false;

                                operatorStates = operatorStates.concat([expression]);
                            }
                        }else{
                            let StructuredToken = numberStates.join('');
                            Tokens = Tokens.concat([{ 'Number': StructuredToken }]);
                            numberStates = [];
                            EXPONENT = false;

                            operatorStates = operatorStates.concat([expression]);
                        }
                    }else{
                        operatorStates = operatorStates.concat([expression]);
                    }
                }
            }else if(numRegExp.test(expression)){
                if (prevStates.length) {
                    prevStates = prevStates.concat([expression]);
                } else {
                    if(operatorStates.length) {
                        let StructuredToken = operatorStates.join('');
                        if (/\/\//.test(StructuredToken)) {
                            COMMENTARY = true;
                        } else {
                            Tokens = Tokens.concat([{ 'Operator': StructuredToken }]);
                            operatorStates = [];
                        }
                
                        operatorStates = [];
                    }

                    numberStates = numberStates.concat([expression]);
                }
            }else{
                if (operatorStates.length) {
                    let StructuredToken = operatorStates.join('');
                    if (/\/\//.test(StructuredToken)) {
                        COMMENTARY = true;
                    } else {
                        Tokens = Tokens.concat([{ 'Operator': StructuredToken }]);
                        operatorStates = [];
                    }
                    operatorStates = [];
                }
                if(prevStates.length) {
                    prevStates = prevStates.concat([expression]);
                }else{
                    if(/[\.]/.test(expression)) {
                        
                        if(numberStates.length) {
                            if(!FLOAT) {
                                numberStates = numberStates.concat([expression]);
                                FLOAT = true;
                            }else{
                                let StructuredToken = numberStates.join('');
                                if (!COMMENTARY) Tokens = Tokens.concat([{ 'Number': StructuredToken }]);
                                numberStates = [];
                                FLOAT = false;

                                if (/^\'.*\'$|^\".*\"$/.test(expression)) {
                                  Tokens = Tokens.concat([
                                    { String: expression },
                                  ]);
                                } else {
                                  if (/true|false|and|or/i.test(expression)) {
                                    Tokens = Tokens.concat([
                                      { Idenfifier: expression },
                                    ]);
                                  } else if (KEYS.indexOf(expression) !== -1) {
                                    Tokens = Tokens.concat([
                                      { Key: expression },
                                    ]);
                                  } else if (OPERATORS.indexOf(expression) !== -1) {
                                    Tokens = Tokens.concat([
                                      { Identifier: expression },
                                    ]);
                                  } else {
                                    Tokens = Tokens.concat([
                                      { Identifier: expression },
                                    ]);
                                  }
                                }
                            }
                        }else{
                            if(/[\(\)\[\]]/.test(expression))
                              Tokens = Tokens.concat([{'Parenthesis': expression}]);
                            else if(/\,/.test(expression)){
                              Tokens = Tokens.concat([{'Operator': expression }]);
                            }
                            else Tokens = Tokens.concat([{ 'Separator': expression }]);
                        }
                    }else{
                        if(numberStates.length) {
                            let StructuredToken = numberStates.join('');
                            Tokens = Tokens.concat([{'Number': StructuredToken}]);
                            numberStates = [];
                            FLOAT = false;
                        }

						if (/\w+/.test(expression))
              if (/^\'.*\'$|^\".*\"$/.test(expression)) {
                Tokens = Tokens.concat([{ String: expression }]);
              } else {
                if (/true|false|and|or/i.test(expression)) {
                  Tokens = Tokens.concat([{ Identifier: expression }]);
                } else if (KEYS.indexOf(expression) !== -1) {
                  Tokens = Tokens.concat([{ Key: expression }]);
                } else if (OPERATORS.indexOf(expression) !== -1) {
                  Tokens = Tokens.concat([{ Identifier: expression }]);
                } else {
                  Tokens = Tokens.concat([{ Identifier: expression }]);
                }
              }
            else if (!Tokens.length && /\s+/.test(expression)) {
              Tokens = Tokens.concat([{ Separator: expression }]);
            } else if (/[\(\)\[\]]/.test(expression))
              Tokens = Tokens.concat([{ Parenthesis: expression }]);
            else if (/\,/.test(expression)) {
              Tokens = Tokens.concat([{ Operator: expression }]);
            } else Tokens = Tokens.concat([{ Separator: expression }]);
                    }
                }
            }
        }

        if (numberStates.length) {
            let StructuredToken = numberStates.join('');
            Tokens = Tokens.concat([{ 'Number': StructuredToken }]);
            numberStates = [];
            FLOAT = false;
        }

        if (operatorStates.length > 1) {
            let StructuredToken = operatorStates.join('');
            Tokens = Tokens.concat([{ 'Operator': StructuredToken }]);
            operatorStates = [];
            operatorStates = [];
        } else if (operatorStates.length == 1) {
            throw new UserException(`Unexpected Operator assignment ${operatorStates} on Line :` + (LINE + 1));
        }

        if(prevStates.length)
            throw new UserException(`Unidentified Token Exception ${prevStates} on Line: ` + (LINE+1));
        
        return Tokens;
    }
}

const getLineTokens = (_LINE_=null) => {
    if(!_LINE_)
    {
        Tokens = [];
        return LexicalTokenSystem(
            readline.createInterface({
            input: fs.createReadStream("./source.xjs", "utf8"),
            output: process.stdout,
            terminal: false,
            }),
            LINE
        );
    }
}

const ParenthesisEqualizer = (dataString, LINE) => {
    let Equalized = [];

    for(let e = 0; e < dataString.length; e++) {

        if (/[\[\{\(]/.test(dataString[e])) {
          Equalized.push(dataString[e]);
        } else if (/[\]\}\)]/.test(dataString[e])) {
          if(Equalized.length) Equalized.pop();
          else {
            throw new UserException(
            `Mismatched Parenthesis token '${dataString[e]}' identified on Line: ` + LINE
            );
          }
        }
    }

    if(Equalized.length) {
        throw new UserException(
          `Mismatched Parenthesis token '${Equalized.join('')}' identified on Line: ` +
            LINE
        );
    }
}

const trim = (data) => data.replace(/^\s+|\s+$/, '');

const GetOperatorSymbol = (token) => {
    
    if (token == "plus") return "+";
    else if (token == "be") return "=";
    else if (token == "to") return "=";
    else if (token == "as") return "=";
    else if (token == "and") return "&&";
    else if (token == "or") return "||";
    else if (token == "minus") return "-";
    else if (token == "times") return "*";
    else if (token == "by") return "*";
    else if (token == "of") return "*";
    else if (token == 'modulo' || token == 'modulus' || token == 'mod') return '%';
    else if (token == "is greater than or equals") return ">=";
    else if (token == "is greater than or equal to") return ">=";
    else if (token == "is") return "==";
    else if (token == "equals") return "==";
    else if (token == "is equal to") return "==";
    else if (token == "is not") return "!=";
    else if (token == "is not equal to") return "!=";
    else if (token == "is less than") return "<";
    else if (token == "is greater than") return ">";
    else if (token == "is less than or equals") return "<=";
    else if (token == "is less than or equal to") return "<=";
    else {
        if (user_ids.indexOf(token) != -1 || function_ids.indexOf(token) != -1)
          return token.replace(/\s/g, "_");
        return token;
    }
	
}

const BridgeAnalysis = (Tokens, LINE, type) => {
    
    let LfExtend = true;
    let validations = [];
    let evaluations = [];
    let returnId = "";
    let returnType = "";
    let returnStates = "";

    for (let x = 0; x < Tokens.length; x++) {
      let struct = Tokens[x];

      for (let tokenId in struct) {
        if (tokenId != "Separator") {
          evaluations.push(tokenId);
          if (returnId == "") returnId = tokenId;
          else if (returnId == "Operator" && tokenId == "Operator") {
            throw new UserException(
              `SyntaxError: Unexpected token '${struct[tokenId]}' encountered on Line: ${LINE}`
            );
          } else returnId = tokenId;
        }

        if (x == 0) {
          if (!/key/i.test(tokenId)) {
            if (tokenId != "Identifier") {
              throw new UserException(
                `SyntaxError: Illegal Left-hand assignment '${struct[tokenId]}' encountered on Line: ${LINE}`
              );
            } else {
              returnStates += struct[tokenId];
              returnType = "Identifier";
            }
          }
        } else {
          if (tokenId == "Key") {
            throw new UserException(
              `SyntaxError: Unexpected token '${struct[tokenId]}' encountered on Line: ${LINE}`
            );
          } else if (tokenId == "Separator") {
            if (returnStates.length) {
              if (returnType == "Identifier") returnStates += struct[tokenId];
            }
          } else if (tokenId == "Boolean") {
            if (returnStates.length) {
              if (returnType == "Boolean") {
                if (
                  /true|false/i.test(returnStates) &&
                  /and|or/i.test(struct[tokenId])
                ) {
                  validations.push(returnStates);
                  returnStates = "";
                  returnType = "";
                } else if (
                  /true|false/i.test(struct[tokenId]) &&
                  /and|or/i.test(returnStates)
                ) {
                  validations.push(returnStates);
                  returnStates = "";
                  returnType = "";
                } else {
                  throw new UserException(
                    `SyntaxError: Unexpected token '${struct[tokenId]}' encountered on Line: ${LINE}`
                  );
                }
              } else {
                validations.push(returnStates);
                returnStates = "";
                returnType = "";
              }
            } else {
              returnStates += struct[tokenId];
              returnType = "Boolean";
            }
          } else if (tokenId == "String") {
            if (returnStates.length)
              if(/^\s*is\s*$/i.test(trim(returnStates))) {
                  validations.push(returnStates);
                  returnStates = struct[tokenId];
                  returnType = "String";
              } else {
                  throw new UserException(
                    `SyntaxError: Unexpected token '${struct[tokenId]}' encountered on Line: ${LINE}`
                  );
              }
            else {
              returnStates = struct[tokenId];
              returnType = "String";
            }
          } else if (tokenId == "Number") {
            if (returnStates.length) {
                
              if(/^\s*and\s*$|^\s*or\s*$/i.test(trim(returnStates))) {
                validations.push(returnStates);
                returnStates = struct[tokenId];
                returnType = "Number";
              }
              else if(/^\s*is\s*$/i.test(trim(returnStates))) {
                  validations.push(returnStates);
                  returnStates = struct[tokenId];
                  returnType = "Number";
              }
              else if (OPERATORS.indexOf(trim(returnStates)) == -1 || returnType == 'String' || returnType == 'Number') {
                throw new UserException(
                  `SyntaxError: Unexpected token '${returnStates}' encountered on Line: ${LINE}`
                );
              } else {
                validations.push(returnStates);
                returnStates = struct[tokenId];
                returnType = "Number";
              }
            } else {
              returnStates += struct[tokenId];
              returnType = "Number";
            }
          } else if (tokenId == "Identifier") {
              
            if (returnStates.length) {
            
              if (returnType == "Identifier") {
                
                if(struct[tokenId] == 'or')
                {
                    let cr = trim(returnStates);
                    if(cr == 'is less than' || cr == 'is greater than') {
                        returnStates += struct[tokenId];
                    } else {
                        if (user_ids.indexOf(returnStates) !== -1) {
                          validations.push(returnStates);
                        } else if (/^\s*true\s*$|^\s*false\s*$/i.test(returnStates)) {
                          validations.push(returnStates);
                        } else if (
                          /^[0-9]+e[0-9+]$|^[0-9]+e\-[0-9]+$|^[0-9]+\.[0-9]+$|^[0-9]+$/.test(
                            returnStates
                          )
                        ) {
                          validations.push(returnStates);
                        } else if (returnType == "String") {
                          validations.push(returnStates);
                        } else if (/^\s*as\s*$|^\s*be\s*$/i.test(struct[tokenId])) {
                          if (LfExtend) {
                            LfExtend = false;

                            if (returnStates.length) {
                              if (
                                /^[a-zA-Z_$][a-zA-Z0-9_\s]*$/i.test(
                                  returnStates
                                )
                              ) {
                                validations.push(returnStates);
                                returnStates = "";
                                returnType = "";
                              } else {
                                throw new UserException(
                                  `SyntaxError: Unexpected variable assignment '${struct[tokenId]}' encountered on Line: ${LINE}`
                                );
                              }
                            } else {
                              throw new UserException(
                                `SyntaxError: Unexpected token '${struct[tokenId]}' encountered on Line: ${LINE}`
                              );
                            }
                          } else {
                            throw new UserException(
                              `SyntaxError: Unexpected token '${struct[tokenId]}' encountered on Line: ${LINE}`
                            );
                          }
                        } else if (
                          OPERATORS.indexOf(trim(returnStates)) != -1
                        ) {
                          validations.push(returnStates);
                        } else {
                          throw new UserException(
                            `SyntaxError: Unexpected token '${returnStates}' encountered on Line: ${LINE}`
                          );
                        }

                        validations.push(struct[tokenId]);

                        returnStates = "";
                        returnType = "";
                    }
                }
                else if(struct[tokenId] == 'equals')
                {
                    let cr = trim(returnStates);
                    if(cr == 'is less than or' || cr == 'is greater than or') {
                        returnStates += struct[tokenId];
                    } else {
                        if (user_ids.indexOf(returnStates) !== -1) {
                          validations.push(returnStates);
                        } else if (/^\s*true\s*$|^\s*false\s*$/i.test(returnStates)) {
                          validations.push(returnStates);
                        } else if (
                          /^[0-9]+e[0-9+]$|^[0-9]+e\-[0-9]+$|^[0-9]+\.[0-9]+$|^[0-9]+$/.test(
                            returnStates
                          )
                        ) {
                          validations.push(returnStates);
                        } else if (returnType == "String") {
                          validations.push(returnStates);
                        } else if (/^\s*as\s*$|^\s*be\s*$/i.test(struct[tokenId])) {
                          if (LfExtend) {
                            LfExtend = false;

                            if (returnStates.length) {
                              if (
                                /^[a-zA-Z_$][a-zA-Z0-9_\s]*$/i.test(
                                  returnStates
                                )
                              ) {
                                validations.push(returnStates);
                                returnStates = "";
                                returnType = "";
                              } else {
                                throw new UserException(
                                  `SyntaxError: Unexpected variable assignment '${struct[tokenId]}' encountered on Line: ${LINE}`
                                );
                              }
                            } else {
                              throw new UserException(
                                `SyntaxError: Unexpected token '${struct[tokenId]}' encountered on Line: ${LINE}`
                              );
                            }
                          } else {
                            throw new UserException(
                              `SyntaxError: Unexpected token '${struct[tokenId]}' encountered on Line: ${LINE}`
                            );
                          }
                        } else if (
                          OPERATORS.indexOf(trim(returnStates)) != -1
                        ) {
                          validations.push(returnStates);
                        } else if (user_ids.indexOf(trim(returnStates) != -1)) {
                          validations.push(trim(returnStates));
                        } else {
                          throw new UserException(
                            `SyntaxError: Unexpected token '${returnStates}' encountered on Line: ${LINE}`
                          );
                        }

                        validations.push(struct[tokenId]);

                        returnStates = "";
                        returnType = "";
                    }
                }
                else if(struct[tokenId] == 'to')
                {
                    
                    let cr = trim(returnStates);
                    if(cr == 'is less than or equal' || cr == 'is greater than or equal' || cr == 'is equal' || cr == 'is not equal') {
                        returnStates += struct[tokenId];
                        validations.push(returnStates);
                        returnStates = '';
                        returnType = '';
                    } else {
                        if (user_ids.indexOf(returnStates) !== -1) {
                          validations.push(returnStates);
                        } else if (/^\s*true\s*$|^\s*false\s*$/i.test(returnStates)) {
                          validations.push(returnStates);
                        } else if (
                          /^[0-9]+e[0-9+]$|^[0-9]+e\-[0-9]+$|^[0-9]+\.[0-9]+$|^[0-9]+$/.test(
                            returnStates
                          )
                        ) {
                          validations.push(returnStates);
                        } else if (returnType == "String") {
                          validations.push(returnStates);
                        } else if (
                          /^\s*as\s*$|^\s*be\s*$|^\s*to\s*$/i.test(
                            struct[tokenId]
                          )
                        ) {
                          
                          if (LfExtend) {
                            LfExtend = false;
                            
                            if (returnStates.length) {
                              
                              if (
                                /^[a-zA-Z_$][a-zA-Z0-9_\s]*$/i.test(
                                  returnStates
                                )
                              ) {
                                
                                // user_definitions(trim(returnStates));
                                validations.push(trim(returnStates));
                                // validations.push(struct[tokenId]);
                                returnStates = "";
                                returnType = "";
                              } else {
                                throw new UserException(
                                  `SyntaxError: Unexpected variable assignment '${struct[tokenId]}' encountered on Line: ${LINE}`
                                );
                              }
                            } else {
                              throw new UserException(
                                `SyntaxError: Unexpected token '${struct[tokenId]}' encountered on Line: ${LINE}`
                              );
                            }

                            //   validations.push(struct[tokenId]);
                          } else {
                            throw new UserException(
                              `SyntaxError: Unexpected token '${struct[tokenId]}' encountered on Line: ${LINE}`
                            );
                          }
                        } else if (
                          OPERATORS.indexOf(trim(returnStates)) != -1 ||
                          user_ids.indexOf(trim(returnStates)) != -1
                        ) {
                          validations.push(returnStates);
                        } else {
                          throw new UserException(
                            `SyntaxError: Unexpected token '${returnStates}' encountered on Line: ${LINE}`
                          );
                        }

                        validations.push(struct[tokenId]);

                        returnStates = "";
                        returnType = "";
                    }
                }
                else if(user_ids.indexOf(trim(returnStates)) != -1) {
                    validations.push(trim(returnStates));
                    returnStates = struct[tokenId];
                    
                }
                else if (/^\s*and\s*$|^\s*or\s*$/i.test(struct[tokenId]) || OPERATORS.indexOf(struct[tokenId]) != -1 || user_ids.indexOf(trim(struct[tokenId])) != -1) {
                  let push_struct = true;
                  if (user_ids.indexOf(returnStates) !== -1) {
                    validations.push(returnStates);
                  } else if (/^\s*true\s*$|^\s*false\s*$/i.test(returnStates)) {
                    validations.push(returnStates);
                  } else if (
                    /^[0-9]+e[0-9+]$|^[0-9]+e\-[0-9]+$|^[0-9]+\.[0-9]+$|^[0-9]+$/.test(
                      returnStates
                    )
                  ) {
                    validations.push(returnStates);
                  } else if (returnType == "String") {
                    validations.push(returnStates);
                  } else if (/^\s*as\s*$|^\s*be\s*$/i.test(struct[tokenId])) {
                    if (LfExtend) {
                      LfExtend = false;

                      if (returnStates.length) {
                        if (/^[a-zA-Z_$][a-zA-Z0-9_\s]*$/i.test(returnStates)) {
                          // user_definitions(returnStates);
                          validations.push(returnStates);
                          returnStates = "";
                          returnType = "";
                        } else {
                          throw new UserException(
                            `SyntaxError: Unexpected variable assignment '${struct[tokenId]}' encountered on Line: ${LINE}`
                          );
                        }
                      } else {
                        throw new UserException(
                          `SyntaxError: Unexpected token '${struct[tokenId]}' encountered on Line: ${LINE}`
                        );
                      }
                    } else {
                      throw new UserException(
                        `SyntaxError: Unexpected token '${struct[tokenId]}' encountered on Line: ${LINE}`
                      );
                    }
                  } else if (
                    OPERATORS.indexOf(trim(returnStates)) != -1 ||
                    user_ids.indexOf(trim(returnStates)) != -1
                  ) {
                    validations.push(returnStates);
                  } else if (/^\s*and\s*$|^\s*or\s*$/i.test(returnStates)) {
                    validations.push(returnStates);
                  } 
                  else if (
                    user_ids.indexOf(`${returnStates}${struct[tokenId]}`) != -1
                  ) {
                    push_struct = false;
                    validations.push(`${returnStates}${struct[tokenId]}`);
                  } else {
                    throw new UserException(
                      `SyntaxError: Unexpected token '${returnStates}${struct[tokenId]}' encountered on Line: ${LINE}`
                    );
                  }

                  if(push_struct) validations.push(struct[tokenId]);

                  returnStates = "";
                  returnType = "";
                } 
                else if (/^\s*as\s*$|^\s*be\s*$/i.test(struct[tokenId])) {
                    
                  if (LfExtend) {
                    LfExtend = false;
                    
                    if (returnStates.length) {
                      if (/^[a-zA-Z_$][a-zA-Z0-9_\s]*$/i.test(returnStates)) {
                        // user_definitions(returnStates);
                        validations.push(returnStates);
                        returnStates = "";
                        returnType = "";
                      } else {
                        throw new UserException(
                          `SyntaxError: Unexpected variable assignment '${struct[tokenId]}' encountered on Line: ${LINE}`
                        );
                      }
                    } else {
                      throw new UserException(
                        `SyntaxError: Unexpected token '${struct[tokenId]}' encountered on Line: ${LINE}`
                      );
                    }

                    validations.push(struct[tokenId]);
                  }

                } 
                else if(/^\s*true\s*$|^\s*false\s*$/i.test(struct[tokenId])) {
                    let cr = trim(returnStates);
                    if(/and|or/i.test(cr)) {
                        validations.push(returnStates);
                        returnStates = '';
                        returnType = '';
                    }
                    else{
                        throw new UserException(`SyntaxError: Undefined variable usaged '${returnStates}' encountered on Line: ${LINE}`)
                    }

                    validations.push(struct[tokenId]);
                }
                else {
                    returnStates += struct[tokenId];
                }
              } else {
                  
                validations.push(returnStates);

                if (OPERATORS.indexOf(trim(struct[tokenId])) != -1) {
                  validations.push(struct[tokenId]);
                  returnStates = '';
                  returnType = '';
                }else {
                    returnStates = struct[tokenId];
                    returnType = "Identifier";
                }
              }
            } else {
              
              if(OPERATORS.indexOf(trim(struct[tokenId])) != -1){
                  validations.push(struct[tokenId]);
                  returnStates = "";
                  returnType = "";
              }else{
                  returnStates += struct[tokenId];
                  returnType = "Identifier";
              }
              
            }
          } else if (tokenId == "Operator" || tokenId == "Parenthesis") {
            
            if (LfExtend) {
              
              if(/[\[\]]/.test(struct[tokenId])) {
                  
                  LfExtend = true;
              } else LfExtend = false;
              
              if (returnStates.length) {
                if (/^[a-zA-Z_$][a-zA-Z0-9_\s]*$/i.test(returnStates)) {

                  validations.push(returnStates);
                  returnStates = "";
                  returnType = "";

                } else {
                  if(tokenId == 'Parenthesis') {
                      validations.push(returnStates);
                      returnStates = "";
                      returnType = "";
                  } else {
                      throw new UserException(
                        `SyntaxError: Unexpected variable assignment '${struct[tokenId]}' encountered on Line: ${LINE}`
                      );
                  }
                  
                }
              }

              validations.push(struct[tokenId]);
            } else {

              if(struct[tokenId] == '='){
                let patt = /^.+\[.+\]/i;
                if(patt.test(validations.join(''))){
                    // validations.push(struct[tokenId]);
                } else throw new UserException(`SyntaxError: Invalid left-hand assignment '${struct[tokenId]}' encountered on Line: ${LINE}`);
              }

              if (returnStates.length) {
                if (user_ids.indexOf(trim(returnStates)) !== -1) {
                  validations.push(returnStates);
                } else if (/true|false/i.test(returnStates)) {
                  validations.push(returnStates);
                } else if (
                  /^[0-9]+e[0-9+]$|^[0-9]+e\-[0-9]+$|^[0-9]+\.[0-9]+$|^[0-9]+$/.test(
                    returnStates
                  )
                ) {
                  validations.push(returnStates);
                } else if (
                  returnType == "String"
                ) {
                  validations.push(returnStates);
                }
                else if(/^\s*squarerootof\s*$/i.test(returnStates)){
                  validations.push('squareroot');
                }
                else if(/^\s*squareof\s*$/i.test(returnStates)){
                  validations.push('square');
                }
                else if(/^\s*lengthof\s*$/i.test(returnStates)){
                  validations.push('length');
                }
                else if (
                  /^\s*cos\s*$/i.test(returnStates) ||
                  /^\s*sin\s*$/i.test(returnStates) ||
                  /^\s*tan\s*$/i.test(returnStates) ||
                  /^\s*round\s*$/i.test(returnStates) ||
                  /^\s*power\s*$/i.test(returnStates) ||
                  /^\s*absoluteof\s*$/i.test(returnStates) ||
                  /^\s*minimumof\s*$/i.test(returnStates) ||
                  /^\s*maximumof\s*$/i.test(returnStates) ||
                  /^\s*valueof\s*$/i.test(returnStates) ||
                  /^\s*indexof\s*$/i.test(returnStates) ||
                  /^\s*push\s*$/i.test(returnStates) ||
                  /^\s*pop\s*$/i.test(returnStates) ||
                  /^\s*ceil\s*$/i.test(returnStates) ||
                  /^\s*floor\s*$/i.test(returnStates) ||
                  /^\s*sort\s*$/i.test(returnStates) ||
                  /^\s*reverse\s*$/i.test(returnStates)
                ) {
                  validations.push(returnStates.trim().toLowerCase());
                } else {
                  if (
                    /and|or/i.test(trim(returnStates)) ||
                    OPERATORS.indexOf(trim(returnStates)) != -1
                  ) {
                    validations.push(returnStates);
                  } else {
                    throw new UserException(
                      `SyntaxError: Unexpected token '${returnStates}' encountered on Line: ${LINE}`
                    );
                  }
                }

                returnStates = "";
                returnType = "";
              }

              if (returnStates.length) validations.push(returnStates);
              validations.push(struct[tokenId]);
            }
          }
        }
      }
    }

    returnStates = trim(returnStates);
    if (returnStates.length) {
      if (returnType == "Identifier") {
        if (user_ids.indexOf(trim(returnStates)) == -1) {
          if (OPERATORS.indexOf(returnStates) == -1) {
            if (!/^\s*true\s*$|^\s*false\s*$/i.test(returnStates)) {
              throw new UserException(
                `SyntaxError: Undefined variable '${returnStates}' encountered on Line: ${LINE}`
              );
            } else validations.push(returnStates);
          } else validations.push(returnStates);
        } else validations.push(returnStates);
      }
      else validations.push(returnStates);
    }

    for (let i = 0; i < evaluations.length; i++) {
      if (evaluations[i] == "Operator") {
        if (
          evaluations[i - 1] == "undefined" ||
          evaluations[i + 1] == "undefined"
        ) {
          throw new UserException(
            `SyntaxError: Unexpected token encountered on Line: ${LINE}`
          );
        }
      }
    }

    return validations;
}

const validatedSyntax = [];

const SemanticParsingSystem = (Tokens, LINE, type) => {
	
	switch(type) {
        case 0:
            {
                let Continue = true;
                let Expression = [];

                for (let i = 0; i < Tokens.length; i++) {
                  let tokenStruct = Tokens[i];

                  for (let tokenId in tokenStruct) {
                    if (tokenId == "Separator") {
                      if (Continue) {
                      } else Expression.push(tokenStruct);
                    } else {
                      Continue = false;
                      Expression.push(tokenStruct);
                    }
                  }
                }

                let validations = BridgeAnalysis(Expression, LINE, 0);
                let varname = trim(validations[0]);
                let defined = true;

                if(user_ids.indexOf(varname) == -1) {
                    defined = false;
                    user_definitions(varname);
                }

                validatedSyntax.push(
                    {
                        type: 'assignment',
                        userdefined: defined,
                        data: validations
                    }
                );

                break;
            }
        case 1:
            {
                let Continue = true;
                let Expression = [];

                for (let i = 0; i < Tokens.length; i++) {
                  let tokenStruct = Tokens[i];

                  for (let tokenId in tokenStruct) {
                    if (tokenId == "Separator") {
                      if (Continue) {
                      } else Expression.push(tokenStruct);
                    } else {
                      Continue = false;
                      Expression.push(tokenStruct);
                    }
                  }
                }

                for (let i = 0; i < 2; i++) Expression.shift();

                Expression.unshift({ Operator: "=" });
                Expression.unshift({ Separator: " " });
                Expression.unshift({ Identifier: "exp" });

                let validations = BridgeAnalysis(Expression, LINE, 0);
                
                let spliced = validations.splice(0, 2);
                
                validatedSyntax.push(
                    {
                        type: 'while-iteration',
                        data: validations
                    }
                );

                break;
            }
        case 2:
            {
                let Continue = true;
                let Expression = [];

                for (let i = 0; i < Tokens.length; i++) {
                  let tokenStruct = Tokens[i];

                  for (let tokenId in tokenStruct) {
                    if (tokenId == "Separator") {
                      if (Continue) {
                      } else Expression.push(tokenStruct);
                    } else {
                      Continue = false;
                      Expression.push(tokenStruct);
                    }
                  }
                }

                for (let i = 0; i < 2; i++) Expression.shift();

                Expression.unshift({ Operator: "=" });
                Expression.unshift({ Separator: " " });
                Expression.unshift({ Identifier: "exp" });

                let validations = BridgeAnalysis(Expression, LINE, 0);
                
                let spliced = validations.splice(0, 2);
                
                validatedSyntax.push(
                    {
                        type: 'conditional',
                        data: validations
                    }
                );
                
                break;
            }
        case 3:
            {
                let Continue = true;
                let Expression = [];

                for (let i = 0; i < Tokens.length; i++) {
                  let tokenStruct = Tokens[i];

                  for (let tokenId in tokenStruct) {
                    if (tokenId == "Separator") {
                      if (Continue) {
                      } else Expression.push(tokenStruct);
                    } else {
                      Continue = false;
                      Expression.push(tokenStruct);
                    }
                  }
                }

                for (let i = 0; i < 3; i++) Expression.shift();

                Expression.unshift({ Operator: "=" });
                Expression.unshift({ Separator: " " });
                Expression.unshift({ Identifier: "exp" });

                let validations = BridgeAnalysis(Expression, LINE, 0);
                let spliced = validations.splice(0, 2);
                
                validatedSyntax.push(
                    {
                        type: 'else-conditional',
                        data: validations
                    }
                );
                
                break;
            }
        case 4:
            {
                let defined = true;
                let validations = [];
                let arrayname = Tokens[2];

                if (/^[a-zA-Z_$][a-zA-Z0-9_\s]*$/i.test(arrayname)) {
                    if(user_ids.indexOf(arrayname) == -1) {
                        user_definitions(arrayname);
                        defined = false;
                    }

                    array_ids.push(arrayname);
                    validations.push(arrayname);
                }
                else {
                    throw new UserException(`SyntaxError: Invalid array name '${arrayname}' initialized on Line: ${LINE}`);
                }

                let data = Tokens[3].split(',');

                for(let i = 0; i < data.length; i++) {
                    let eval = trim(data[i]);

                    if (user_ids.indexOf(eval) != -1) {
                        validations.push(eval);
                    } 
                    else if (/^\'.*\'$|^\".*\"$/.test(eval)) {
                        validations.push(eval);
                    }
                    else if (
                      /^[0-9]+e[0-9]+$|^[0-9]+e\-[0-9]+$|^[0-9]+\.[0-9]+$|[0-9]+/.test(eval)
                    ) {
                        if(isNaN(eval)) {
                            throw new UserException(
                              `SyntaxError: Unidentified token '${eval}' encountered on Line: ${LINE}'`
                            );
                        }
                        
                        validations.push(eval);
                    }
                    else{
                        throw new UserException(`SyntaxError: Unidentified token '${eval}' encountered on Line: ${LINE}'`);
                    }
                }

                validatedSyntax.push(
                    {
                        type: 'array-declaration',
                        userdefined: defined,
                        data: validations
                    }
                );
                
                break;
            }
        case 5:
            {
                let validations = [];

                for(let i = 1; i <= 2; i++) {
                    let factor = Tokens[i];

                    if(isNaN(factor)) {
                        if(user_ids.indexOf(factor) == -1) {

                            let expression = 'let exp = ' + factor;
                
                            let extractions = BridgeAnalysis(
                                                LexicalTokenSystem(
                                                    readline.createInterface({
                                                      input: fs.createReadStream("./source.xjs", "utf8"),
                                                      output: process.stdout,
                                                      terminal: false,
                                                    }),
                                                    expression,
                                                    false),
                                                LINE,
                                                0
                                            );
                            extractions.splice(0, 2);
                            validations.push(extractions.join(''));
                            // throw new UserException(`SyntaxError: Unidentified token '${factor}' encountered on Line: ${LINE}`);
                        }else{
                            validations.push(factor);
                        }

                    }else validations.push(factor);
                }

                if(Tokens.length == 4) {
                    let eval = Tokens[3];
                    if (/^[a-zA-Z_$][a-zA-Z0-9_\s]*$/i.test(eval)) {
                        user_definitions(eval);
                        validations.push(eval);
                    }
                }
                else if (Tokens.length == 5) {
                    let eval = Tokens[3];

                    if (/^[a-zA-Z_$][a-zA-Z0-9_\s]*$/i.test(eval)) {
                      user_definitions(eval);
                      validations.push(eval);
                    }

                    let step = Tokens[4];
                    if(!isNaN(step) || user_ids.indexOf(step) != -1) {
                        validations.push(step);
                    }else {
                        throw new UserException(
                          `SyntaxError: Unidentified token '${step}' encountered on Line: ${LINE}`
                        );
                    }
                }

                validatedSyntax.push(
                    {
                        type: 'from-iteration',
                        data: validations
                    }
                );

                break;
            }
        case 6:
            {
                let validations = [];
                let value = Tokens[1];

                if (/^[a-zA-Z_$][a-zA-Z0-9_\s]*$/i.test(value)) {
                    if(user_ids.indexOf(value) == -1) {
                        user_definitions(value);
                    }

                    validations.push(value);
                }
                else {
                    
                    throw new UserException(`SyntaxError: Invalid variable name '${value}' declared on Line: ${LINE}`);
                }

                let data = Tokens[2];

                if (/^[a-zA-Z_$][a-zA-Z0-9_\s]*$/i.test(data)) {
                    if(user_ids.indexOf(data) == -1) {
                      
                        throw new UserException(
                          `RuntimeError: Non-iterable or invalid list element '${data}' declared on Line: ${LINE}`
                        );
                    }

                    validations.push(data);
                }
                else {
                    throw new UserException(`SyntaxError: Invalid variable name '${data}' declared on Line: ${LINE}`);
                }

                validatedSyntax.push(
                    {
                        type: 'for-each-loop',
                        data: validations
                    }
                );
                
                break;
            }
        case 7:
            {
                let validations = [];
                let modname = Tokens[1];

                if (/^[a-zA-Z_$][a-zA-Z0-9_\s]*$/i.test(modname)) {
                    
                    if(user_ids.indexOf(modname) != -1) {
                        throw new UserException(`RuntimeError: Already declared function name '${modname}' encountered on Line: ${LINE}`);
                    } else {
                        function_ids.push(modname);
                        user_ids.push(modname);
                        validations.push(modname);
                    }
                }
                else {
                    throw new UserException(`SyntaxError: Invalid function name assignment '${modname}' encountered on Line: ${LINE}`);
                }

                validatedSyntax.push(
                    {
                        type: 'function-declaration',
                        data: validations
                    }
                );
                
                break;
            }
        case 8:
            {   
                let validations = trim(Tokens[0]);
                
                validatedSyntax.push(
                    {
                        type: 'closing-block',
                        data: validations
                    }
                );

                break;
            }
        case 9:
            {
                let validations = [];
                let data = Tokens[1].split(',');
            
                for(let i = 0; i < data.length; i++) {
                    let token = trim(data[i]);

                    if (/^[a-zA-Z_$][a-zA-Z0-9_\s]*$/i.test(token)) {
                        user_definitions(token);
                        validations.push(token);
                    } else {
                        throw new UserException (`SyntaxError: Unexpected token '${data[i]}' encountered on Line: ${LINE}`);
                    }
                }

                validatedSyntax.push(
                    {
                        type: 'function-arguments',
                        data: validations
                    }
                );

                break;
            }
        case 10:
            { 
                let validations = [];
                let data = Tokens[1][2].trim();

                if  (user_ids.indexOf(data) != -1) {
                    validations.push(data);
                }
                else if (/^\'.*\'$|^\".*\"$/.test(data)) {
                    validations.push(data);
                }
                else if (!isNaN(data)) {
                    validations.push(data);
                }
                else {
                    let Continue = true;
                    let Expression = [];
                    
                    for(let i = 0; i < Tokens[0].length; i++)
                    {
                        let tokenStruct = Tokens[0][i];

                        for(let tokenId in tokenStruct)
                        {
                            if(tokenId == 'Separator') {
                                if(Continue) {}
                                else Expression.push(tokenStruct);
                            }
                            else{
                                Continue = false;
                                Expression.push(tokenStruct);
                            }
                        }
                    }

                    for(let i = 0; i < 2; i++) Expression.shift();
                    Expression.unshift({ Operator: "=" });
                    Expression.unshift({ Separator: " " });
                    Expression.unshift({ Identifier: "exp" });
                    
                    validations = BridgeAnalysis(Expression, LINE, 0);
                    validations.splice(0, 2);
                    
                }

                validatedSyntax.push(
                    {
                        type: 'console-log',
                        data: validations
                    }
                );

                break;
            }
        case 11:
            {
                let questions = [];
                let validations = [];
                let data = Tokens[1].split(',');

                for(let i = 0; i < data.length; i++) {
                    let token = trim(data[i]);

                    if (user_ids.indexOf(token) == -1) {
                        if (/^[a-zA-Z_$][a-zA-Z0-9_\s]*$/i.test(token)) {
                            user_definitions(token);
                            validations.push(token);
                        }
                        else {
                            throw new UserException(`SyntaxError: Unexpected token '${token}' encountered on Line: ${LINE}`);
                        }
                    }
                    else {
                        throw new UserException(`SyntaxError: Predefined input variable '${token}' on Line: ${LINE}`);
                    }
                }

                for(let i = 0; i < validations.length; i++) {
                    questions.push({
                        type: 'text',
                        name: `${validations[i]}`,
                        message: `Enter ${validations[i]}`
                    });
                }

                (async () => {
                    const response = await prompts(questions);
                    
                    validatedSyntax.push(
                        {
                            type: 'user-input',
                            data: response
                        }
                    );

                    READING_USER_INPUT = false;

                })();

                break;
            }
        case 12:
            {

                let Continue = true;
                let Expression = [];

                for (let i = 0; i < Tokens[0].length; i++) {
                    let tokenStruct = Tokens[0][i];

                    for (let tokenId in tokenStruct) {
                        if (tokenId == "Separator") {
                          if (Continue) {
                          } else Expression.push(tokenStruct);
                        } else {
                          Continue = false;
                          Expression.push(tokenStruct);
                        }
                    }
                }

                let validations = [];
                let data = Tokens[1][1].trim();

                if  (user_ids.indexOf(data) != -1) {
                    validations.push(data);
                }
                else if (/^\'.*\'$|^\".*\"$/.test(data)) {
                    validations.push(data);
                }
                else if (!isNaN(data)) {
                    validations.push(data);
                }
                else {
                    
                    for (let i = 0; i < 2; i++) Expression.shift();
                    Expression.unshift({ Operator: "=" });
                    Expression.unshift({ Separator: " " });
                    Expression.unshift({ Identifier: "exp" });
                    
                    validations = BridgeAnalysis(Expression, LINE, 0);
                    validations.splice(0, 2);
                }

                validatedSyntax.push(
                    {
                        type: 'return-statement',
                        data: validations
                    }
                );

                break;
            }
        case 13:
            {
                let validations = [];
                let data = Tokens[1];
                
                data = trim(data);

                if(function_ids.indexOf(data) != -1) {
                    validations.push(data);
                }
                else {
                    throw new UserException(`SyntaxError: Unidentified function call '${data}' encountered on Line: ${LINE}`);
                }

                if(Tokens.length == 3)
                {
                    let evaluations = Tokens[2].split(",");
                    
                    for(let e = 0; e < evaluations.length; e++) {
                        let token = trim(evaluations[e]);

                        if (user_ids.indexOf(token) != -1) {
                            validations.push(token);
                        } else if (/^\'.*\'$|^\".*\"$/.test(token)) {
                            validations.push(token);
                        } else if (!isNaN(token)) {
                            validations.push(token);
                        }
                        else {
                            throw new UserException(`SyntaxError: Unexpected token '${token}' encountered on Line: ${LINE}`);
                        }
                    }
                }

                validatedSyntax.push(
                    {
                        type: 'function-call',
                        data: validations
                    }
                );

                break;
            }
        case 14:
            {
                let defined = true;
                let data = Tokens;
                let validations = [];
                let varname = data[1];

                if (!/^[a-zA-Z_$][a-zA-Z0-9_\s]*$/i.test(varname)) {
                    throw new UserException(
                      `SyntaxError: Invalid variable name ${varname} encountered on Line: ${LINE}`
                    );
                }

                validations.push(varname);

                let module = data[2];

                if(function_ids.indexOf(module) != -1) {
                    validations.push(module);
                }
                else {
                    throw new UserException(`SyntaxError: Unidentified function call '${module}' encountered on Line: ${LINE}`);
                }

                if(data.length == 4) {
                    let evaluations = data[3].split(',');
                    
                    for(let e = 0; e < evaluations.length; e++) {
                        let token = trim(evaluations[e]);

                        if (user_ids.indexOf(token) != -1) {
                            validations.push(token);
                        } else if (/^\'.*\'$|^\".*\"$/.test(token)) {
                            validations.push(token);
                        } else if (!isNaN(token)) {
                            validations.push(token);
                        }
                        else {
                            throw new UserException(`SyntaxError: Unexpected token '${token}' encountered on Line: ${LINE}`);
                        }
                    }
                }

                if(user_ids.indexOf(varname) == -1) {
                    defined = false;
                    user_definitions(varname);
                }

                validatedSyntax.push(
                    {
                        type: 'function-assignment',
                        userdefined: defined,
                        data: validations
                    }
                );

                break;
            }
        case 15:
            {
                let data = Tokens;
                let varname = trim(data[1]);

                if (user_ids.indexOf(varname) != -1) {
                    throw new UserException(`SyntaxError: Using an already defined variable name '${varname}' encountered on Line: ${LINE}`);
                }
                else {
                    user_definitions(varname);
                }

                validatedSyntax.push(
                    {
                        type: 'undefined-assignment',
                        data: varname
                    }
                );
                
                break;
            }
        case 16:
            {
                let data = Tokens;
                let validations = [];
                let arrayid = data[1];

                if(array_ids.indexOf(arrayid) == -1 || arrayid != data[3]){
                    throw new UserException(`SyntaxError: Mismatched array swap '${array}' encountered on Line: ${LINE}`);
                }else{
                    validations.push(arrayid);
                }

                let xpos = 'let exp = ' + data[2];
                let ypos = 'let exp = ' + data[4];
                
                let extractx = BridgeAnalysis(
                                    LexicalTokenSystem(
                                        readline.createInterface({
                                          input: fs.createReadStream("./source.xjs", "utf8"),
                                          output: process.stdout,
                                          terminal: false,
                                        }),
                                        xpos,
                                        false),
                                    LINE,
                                    0
                                );
                extractx.splice(0, 2);
                let extracty = BridgeAnalysis(
                  LexicalTokenSystem(
                    readline.createInterface({
                      input: fs.createReadStream("./source.xjs", "utf8"),
                      output: process.stdout,
                      terminal: false,
                    }),
                    ypos,
                    false
                  ),
                  LINE,
                  0
                );
                extracty.splice(0, 2);
                validations.push(extractx);
                validations.push(extracty);

                validatedSyntax.push({
                    'type': 'swapping-elements',
                    'data': validations
                });
                
                break;
            }
    }
}

const JavaScriptCodeGeneratorSystem = (SourceCode = validatedSyntax) => {
    
    var executableScript = `
      const fs = require('fs');
      const PI = 22/7;
      function squareroot(num){ return Math.sqrt(num);}
      function square(num){ return Math.pow(num, 2);}
      function length(str){ return str.length;}
      function cos(num) { return Math.cos(num);}
      function sin(num) { return Math.sin(num);}
      function tan(num) { return Math.tan(num);}
      function round(num) { return Math.round(num);}
      function floor(num) { return Math.floor(num);}
      function ceil(num) { return Math.ceil(num);}
      function power(num, n) { return Math.pow(num, n);}
      function absoluteof(num){ return Math.abs(num);}
      function valueof(i, arr){ return arr[i]; }
      function pop(arr) { return arr.pop(); }
      function sort(arr) { arr.sort(); return arr; }
      function reverse(arr) { arr.reverse(); return arr; }
      function push(arr, ...val) { 
          for(let i = 0; i < val.length; i++) {
              arr.push(val[i])
          }
          return arr.length
      }
      function indexof(val, arr) {
          return arr.indexOf(val);
      }
      function minimumof(...args) {
          let min = args[0];
          for(let i = 0; i < args.length; i++){
            if(args[i] < min) min = args[i];
          }
          return min;
      }
      function swap(array, a, b){
        let container = array[a];
        array[a] = array[b];
        array[b] = container;
      }
      function maximumof(...args) {
          let max = args[0];
          for(let i = 0; i < args.length; i++){
            if(args[i] > max) max = args[i];
          }
          return max;
      }
    `;
    for (let line in SourceCode) {
        let LineSyntax = SourceCode[line];
        let template = LineSyntax['type'];

        if(template == 'assignment')
        {
            let Indentation = '';

            if(SCOPE) {
                for (let i = 0; i < SCOPE_LEVELS; i++) {
                    Indentation += '\t';
                }
            }

            let assignment = `${Indentation}`;
            assignment += LineSyntax['userdefined'] ? '' : "var ";
            let evaluation = LineSyntax['data'];

            for(let e = 0; e < evaluation.length; e++) {
                assignment += GetOperatorSymbol(trim(evaluation[e])) + ' ';
            }
            
            executableScript += assignment + '\n';
        }
        else if(template == 'delete-file')
        {
            let Indentation = "";

            if (SCOPE) {
                for (let i = 0; i < SCOPE_LEVELS; i++) {
                  Indentation += "\t";
                }
            }

            let data = LineSyntax['data'];
            let assignment = `${Indentation}fs.unlink('${data}', (err)=>{ if(err) throw err; if(!err) console.log('${data} deleted!'); });\n`;
            executableScript += assignment;
        }
        else if(template == 'rename-file')
        {
            let Indentation = "";

            if (SCOPE) {
                for (let i = 0; i < SCOPE_LEVELS; i++) {
                  Indentation += "\t";
                }
            }

            let data = LineSyntax['data'];
            let name = LineSyntax['name'];
            let assignment = `${Indentation}fs.rename('${data}', '${name}', (err)=>{ if(err) throw err; if(!err) console.log('${data} renamed!'); });\n`;
            executableScript += assignment;
        }
        else if(template == 'read-file')
        {
            let Indentation = "";

            if (SCOPE) {
                for (let i = 0; i < SCOPE_LEVELS; i++) {
                  Indentation += "\t";
                }
            }

            let data = LineSyntax['data'];
            let assignment = `${Indentation}fs.readFile('${data}', {encoding: 'utf8'}, (err, data)=>{ if(!err) console.log(data); });\n`;
            executableScript += assignment;
        }
        else if(template == 'read-file-as')
        {
            let Indentation = "";

            if (SCOPE) {
                for (let i = 0; i < SCOPE_LEVELS; i++) {
                  Indentation += "\t";
                }
            }

            let filename = LineSyntax['data'];
            let varname = LineSyntax['varname'];
            let assignment = LineSyntax["declared"] ? `` : `${Indentation}let ${varname} = '';\n`;
            assignment += `${Indentation}let condition = true; \n${Indentation}while(condition){\n fs.readFile('${filename}', {encoding: 'utf8'}, (err, data)=>{ if(!err) { ${varname} = data; condition = false; console.log(${varname}); }\n})};\n`;
            executableScript += assignment;
            // console.log(executableScript);
        }
        else if(template == 'create-file')
        {
            let Indentation = "";

            if (SCOPE) {
                for (let i = 0; i < SCOPE_LEVELS; i++) {
                  Indentation += "\t";
                }
            }

            let data = LineSyntax['data'];
            let assignment = `${Indentation}fs.open('${data}', 'w', (err)=>{ if(err) throw err; if(!err) console.log('${data} created!'); });\n`;
            executableScript += assignment;
        }
        else if(template == 'append-file')
        {
            let Indentation = "";

            if (SCOPE) {
                for (let i = 0; i < SCOPE_LEVELS; i++) {
                  Indentation += "\t"
                }
            }

            let data = LineSyntax['data'];
            let file = LineSyntax['file'];
            let assignment = `${Indentation}fs.appendFile('${file}', ${data}, (err)=>{ if(err) throw err; if(!err) console.log('${data} appended to ${file}'); });\n`;
            executableScript += assignment;
        }
        else if(template == 'write-file')
        {
            let Indentation = "";

            if (SCOPE) {
                for (let i = 0; i < SCOPE_LEVELS; i++) {
                  Indentation += "\t";
                }
            }

            let data = LineSyntax['data'];
            let file = LineSyntax['file'];
            let assignment = `${Indentation}fs.writeFile('${file}', ${data}, (err)=>{ if(err) throw err; if(!err) console.log('${file} saved!'); });\n`;
            executableScript += assignment;
        }
        else if(template == 'popping-element'){
            let Indentation = "";

            if (SCOPE) {
                for (let i = 0; i < SCOPE_LEVELS; i++) {
                  Indentation += "\t";
                }
            }

            let data = LineSyntax['data'];
            let assignment = `${Indentation}pop(${data});\n`;
            executableScript += assignment;
        }
        else if(template == 'pushing-element'){
            let Indentation = "";

            if (SCOPE) {
                for (let i = 0; i < SCOPE_LEVELS; i++) {
                  Indentation += "\t";
                }
            }

            let validations = LineSyntax["data"];
            
            let assignment = `${Indentation}`;
            for(let i = 1; i < validations.length; i++){
                assignment += `push(${validations[0]}, ${validations[i]}); `;
            }
            assignment += '\n';
            executableScript += assignment;
        }
        else if(template == 'swapping-elements'){
            let Indentation = "";

            if (SCOPE) {
              for (let i = 0; i < SCOPE_LEVELS; i++) {
                Indentation += "\t";
              }
            }

            let validations = LineSyntax["data"];
            let assignment = `${Indentation}swap(${validations[0]},`;

            let xpos = validations[1];
            for(let i = 0; i < xpos.length; i++) assignment += `${xpos[i]}`;
            assignment += ',';
            let ypos = validations[2];
            for(let i = 0; i < ypos.length; i++) assignment += `${ypos[i]}`;
            assignment += ');\n';
            executableScript += assignment;
        }
        else if(template == 'do-while-iteration') {

            let Indentation = '';

            if (SCOPE) {
                for (let i = 0; i < SCOPE_LEVELS; i++) {
                    Indentation += '\t';
                }
            }

            SCOPE = true;
            SCOPE_LEVELS++;

            BLOCK_OPENS.push('DO');

            executableScript += `${Indentation}do {\n`;
        }
        else if(template == 'while-iteration')
        {   
            let Indentation = '';

            if (SCOPE) {
                for (let i = 0; i < SCOPE_LEVELS; i++) {
                    Indentation += '\t';
                }
            }

            SCOPE = true;

            const Do = BLOCK_OPENS[BLOCK_OPENS.length-1];

            let assignment = ``;
            if (Do == 'DO'){ 
                Indentation = '';
                if (SCOPE) {
                    for (let i = 0; i < SCOPE_LEVELS-1; i++) {
                      Indentation += "\t";
                    }
                }
                assignment += `${Indentation}} while ( `; 
            }
            else assignment += `${Indentation}while ( `;

            let evaluation = LineSyntax["data"];

            for (let e = 0; e < evaluation.length; e++) {
              assignment += GetOperatorSymbol(trim(evaluation[e])) + " ";
            }

            if (Do == 'DO'){ assignment += `)\n`; SCOPE_LEVELS--; BLOCK_OPENS.pop(); }
            else { assignment += `) {\n `; SCOPE_LEVELS++; BLOCK_OPENS.push("WHILE"); };
            
            executableScript += assignment;
        }
        else if(template == 'conditional')
        {   
            let Indentation = '';

            if (SCOPE) {
                for (let i = 0; i < SCOPE_LEVELS; i++) {
                    Indentation += '\t';
                }
            }

            SCOPE = true;
            SCOPE_LEVELS++;

            BLOCK_OPENS.push('IF');

            let assignment = `${Indentation}if ( `;
            let evaluation = LineSyntax["data"];

            for (let e = 0; e < evaluation.length; e++) {
              assignment += GetOperatorSymbol(trim(evaluation[e])) + " ";
            }

            assignment += ') {\n';

            executableScript += assignment;
        }
        else if(template == 'else-conditional') {
            if (SCOPE) {
                let OpenStruct = BLOCK_OPENS[BLOCK_OPENS.length-1];

                if (!/^\s*if\s*$/i.test(OpenStruct)) {
                    
                    throw new UserException(
                      `Unmatched Closing Block Statement '${OpenStruct}' on Line: ${LINE}`
                    );
                }
            } else {
                
                throw new UserException(
                  `Unmatched Closing Block Statement on Line: ${LINE}`
                );
            }

            let Indentation = '';
            for(let i = 0; i < SCOPE_LEVELS - 1; i++) {
                Indentation += '\t';
            }

            let assignment = `${Indentation}} else if ( `;
            let evaluation = LineSyntax["data"];

            for (let e = 0; e < evaluation.length; e++) {
              assignment += GetOperatorSymbol(trim(evaluation[e])) + " ";
            }

            assignment += ") {\n";

            executableScript += assignment;
        }
        else if(template == 'array-declaration') {

            let Indentation = '';

            if (SCOPE) {
                for (let i = 0; i < SCOPE_LEVELS; i++) {
                    Indentation += '\t';
                }
            }

            let evaluation = LineSyntax["data"];
            let assignment = `${Indentation}`;
            assignment += LineSyntax["userdefined"] ? '' : 'var ';
            assignment += `${GetOperatorSymbol(evaluation[0])} = [ `;

            for (let e = 1; e < evaluation.length - 1; e++) {
              assignment += GetOperatorSymbol(trim(evaluation[e])) + ", ";
            }

            if(evaluation.length > 1) assignment += `${evaluation[evaluation.length - 1].replace(/\s/g, '_')} ]`;
            else assignment += `]`;

            executableScript += assignment + ";\n";
        }
        else if(template == 'from-iteration') {

            let Indentation = "";

            if (SCOPE) {
                for (let i = 0; i < SCOPE_LEVELS; i++) {
                    Indentation += "\t";
                }
            }

            SCOPE = true;
            SCOPE_LEVELS++;
            BLOCK_OPENS.push('FROM');

            let assignment = `${Indentation}`;
            let evaluations = LineSyntax['data'];

            switch(evaluations.length)
            {
                case 2:
                    {
                        assignment += `for ( let i = ${evaluations[0].replace(
                          /\s/g,
                          "_"
                        )}; i < ${evaluations[1].replace(/\s/g, "_")}; i++ ) {`;
                        break;
                    }
                case 3:
                    {
                        let itr = evaluations[2].replace(" ", "_");
                        assignment += `for ( let ${itr} = ${evaluations[0].replace(
                          /\s/g,
                          "_"
                        )}; ${itr} < ${evaluations[1].replace(
                          /\s/g,
                          "_"
                        )}; ${itr}++ ) {`;
                        break;
                    }
                case 4:
                    {
                        let itr = evaluations[2].replace(/\s/g, "_");
                        let step = evaluations[3].replace(/\s/g, "_");
                        assignment += `for ( let ${itr} = ${evaluations[0].replace(
                          /\s/g,
                          "_"
                        )}; ${itr} < ${evaluations[1].replace(
                          /\s/g,
                          "_"
                        )}; ${itr} += ${step} ) { `;
                        break;
                    }
            }

            executableScript += assignment + '\n';
        }
        else if(template == 'for-each-loop') {
            
            let Indentation = "";

            if (SCOPE) {
                for (let i = 0; i < SCOPE_LEVELS; i++) {
                    Indentation += "\t";
                }
            }

            SCOPE = true;
            SCOPE_LEVELS++;
            BLOCK_OPENS.push('FOR');

            let data = LineSyntax['data'];
            let assignment = `${Indentation}for ( let ${data[0].replace(
              /\s/g,
              "_"
            )} of ${data[1].replace(/\s/g, "_")} ) {\n`;

            executableScript += assignment;
        }
        else if(template == 'function-declaration') {
            let nextLine = `${+line + 1}`;
            let nextLineSyntax = SourceCode[nextLine];

            let Indentation = "";

            if (SCOPE) {
                for (let i = 0; i < SCOPE_LEVELS; i++) {
                    Indentation += "\t";
                }
            }

            SCOPE = true;
            SCOPE_LEVELS++;
            BLOCK_OPENS.push('FUNCTION');

            let data = LineSyntax['data'];
            let assignment = `${Indentation}function ${data[0].replace(
              /\s/g,
              "_"
            )} ( `;

            if (nextLineSyntax["type"] == "function-arguments") {

                let data = nextLineSyntax['data'];

                for(let i = 0; i < data.length; i++) {

                    assignment += `${data[i].replace(/\s/g, "_")}`;
                    if(i < data.length - 1) assignment += `, `;
                }
            }

            assignment += ` ) {\n`;

            executableScript += assignment;
        }
        else if(template == 'closing-block') {
            
            let assignment = '';
            let Indentation = "";
            let data = LineSyntax["data"];

            SCOPE_LEVELS--;
            
            if (SCOPE) {
                for (let i = 0; i < SCOPE_LEVELS; i++) {
                    Indentation += "\t";
                }
            } else {
                throw new UserException(`SyntaxError: Unexpected token '${data}' encountered on Line: ${LINE}`);
            }

            let CurrentOpenStruct = BLOCK_OPENS.pop();

            if(/IF/.test(CurrentOpenStruct)) {
                if(/end|endif|\:|endblock/i.test(data)) {
                    assignment += `${Indentation}}`;
                } else {
                    throw new UserException(`SyntaxError: Unexpected Closing Structure '${data}' encountered on Line: ${LINE}`);
                }
            }
            else if(/FROM/.test(CurrentOpenStruct)) {
                if (/end|endfrom|\:|endblock/i.test(data)) {
                  assignment += `${Indentation}}`;
                } else {
                  throw new UserException(
                    `SyntaxError: Unexpected Closing Structure '${data}' encountered on Line: ${LINE}`
                  );
                }
            }
            else if(/WHILE/.test(CurrentOpenStruct)) {
                if (/end|endwhile|\:|endblock/i.test(data)) {
                  assignment += `${Indentation}}`;
                } else {
                  throw new UserException(
                    `SyntaxError: Unexpected Closing Structure '${data}' encountered on Line: ${LINE}`
                  );
                }
            }
            else if(/FOR/.test(CurrentOpenStruct)) {
                if (/end|endfor|\:|endblock/i.test(data)) {
                  assignment += `${Indentation}}`;
                } else {
                  throw new UserException(
                    `SyntaxError: Unexpected Closing Structure '${data}' encountered on Line: ${LINE}`
                  );
                }
            }
            else if(/FUNCTION/.test(CurrentOpenStruct)) {
                if (/end|endfunction|\:|endblock/i.test(data)) {
                  assignment += `${Indentation}}`;
                } else {
                  throw new UserException(
                    `SyntaxError: Unexpected Closing Structure '${data}' encountered on Line: ${LINE}`
                  );
                }
            }

            executableScript += assignment + '\n';

            if (SCOPE_LEVELS == 0) SCOPE = false;
        }
        else if(template == 'function-arguments') {
            
            if (SCOPE) {

                let prevLine = `${+line - 1}`;
                let prevLineSyntax = SourceCode[prevLine];
                
                if(prevLineSyntax['type'] != 'function-declaration') {
                    throw new UserException(`SyntaxError: Unexpected function arguments on Line: ${LINE-1}`);
                }
            }
            else {

                throw new UserException(
                  `SyntaxError: Unexpected function argumnents on Line: ${LINE-1}`
                );
            }
        }
        else if(template == 'console-log') {

            let Indentation = "";

            if (SCOPE) {
                for (let i = 0; i < SCOPE_LEVELS; i++) {
                    Indentation += "\t";
                }
            }

            let data = LineSyntax['data'];
            let assignment = `${Indentation}console.log( `;

            for (let e = 0; e < data.length; e++) {
                assignment += GetOperatorSymbol(trim(data[e])) + " ";
            }

            assignment += ')\n';
            executableScript += assignment;
        }
        else if(template == 'return-statement') {

            let Indentation = "";

            if (SCOPE) {
                for (let i = 0; i < SCOPE_LEVELS; i++) {
                    Indentation += "\t";
                }
            }

            let assignment = `${Indentation}return `;
            let data = LineSyntax['data'];

            for (let e = 0; e < data.length; e++) {
                assignment += GetOperatorSymbol(trim(data[e])) + " ";
            }

            executableScript += `${assignment}\n`;
        }
        else if(template == 'else') {
            let Indentation = "";

            if (SCOPE) {
              for (let i = 0; i < SCOPE_LEVELS-1; i++) {
                Indentation += "\t";
              }
            }

            executableScript += `${Indentation}} else {\n`;
        }
        else if(template == 'user-input') {
            let Indentation = '';

            if (SCOPE) {
                for (let i = 0; i < SCOPE_LEVELS; i++) {
                    Indentation += '\t';
                }
            }

            let assignment = `${Indentation}`;
            let data = LineSyntax['data'];
            
            
            for (let id in data) {
                assignment += `let ${GetOperatorSymbol(id)} = ${/^\'.*\'$|^\".*\"$/.test(
                  trim(data[id])) ? data[id] : isNaN(trim(data[id])) ?
                  "'" + data[id] + "'" : data[id]
                };\n`;
            }
            
            executableScript += assignment;
        }
        else if(template == 'function-call') {

            let Indentation = "";

            if (SCOPE) {
                for (let i = 0; i < SCOPE_LEVELS; i++) {
                    Indentation += "\t";
                }
            }

            let data = LineSyntax['data'];
            
            let assignment = `${Indentation}${GetOperatorSymbol(data[0])} ( `;

            if (data.length == 2) {
                assignment += `${data[1]} )\n`;
            }
            else if (data.length > 2) {
          
                for (let i = 1; i < data.length-1; i++) {
                    assignment += `${data[i]}, `;
                }

                assignment += `${data[data.length-1]} )\n`;
            }
            else assignment += `)\n`;

            executableScript += assignment;
        }
        else if(template == 'function-assignment') {

            let Indentation = "";

            if (SCOPE) {
                for (let i = 0; i < SCOPE_LEVELS; i++) {
                    Indentation += "\t";
                }
            }

            let data = LineSyntax['data'];

            let assignment = `${Indentation}`;
            assignment += LineSyntax["userdefined"] ? "" : "var ";
            assignment += `${data[0]} = ${data[1]} ( `;

            if (data.length == 3) {
                assignment += `${data[2]} )\n`;
            }
            else if (data.length > 3) {
          
                for (let i = 2; i < data.length-1; i++) {
                    assignment += `${data[i]}, `;
                }

                assignment += `${data[data.length-1]} )\n`;
            }
            else assignment += `)\n`;

            executableScript += assignment;
        }
        else if(template == 'undefined-assignment') {

            let Indentation = '';

            if (SCOPE) {
                for (let i = 0; i < SCOPE_LEVELS; i++) {
                    Indentation += '\t';
                }
            }

            let data = LineSyntax['data'];
            executableScript += `${Indentation}let ${data};\n`;
        }
        else if(template == 'loop-jump') {

            let Indentation = '';
            let data = LineSyntax["data"];

            if (SCOPE) {
                for (let i = 0; i < SCOPE_LEVELS; i++) {
                    Indentation += '\t';
                }
            }
            else {
                throw new UserException(`SyntaxError: Illegal '${data}' statement on Line: ${LINE}`);
            }

            executableScript += `${Indentation}${data};\n`;
        }
        else if(template == 'add-increment') {
            let Indentation = '';

            if (SCOPE) {
                for (let i = 0; i < SCOPE_LEVELS; i++) {
                    Indentation += '\t';
                }
            }

            let data = LineSyntax["data"];
            let assignment = `${Indentation}${data[0]} += ${data[1]};\n`;
            executableScript += assignment;
        }
        else if(template == 'minus-decrement') {
            let Indentation = '';

            if (SCOPE) {
                for (let i = 0; i < SCOPE_LEVELS; i++) {
                    Indentation += '\t';
                }
            }

            let data = LineSyntax["data"];
            let assignment = `${Indentation}${data[0]} -= ${data[1]};\n`;
            executableScript += assignment;
        }
        else if(template == 'multiply') {
            let Indentation = '';

            if (SCOPE) {
                for (let i = 0; i < SCOPE_LEVELS; i++) {
                    Indentation += '\t';
                }
            }

            let data = LineSyntax["data"];
            let assignment = `${Indentation}${data[0]} *= ${data[1]};\n`;
            executableScript += assignment;
        }
        else if(template == 'divide') {
            let Indentation = '';

            if (SCOPE) {
                for (let i = 0; i < SCOPE_LEVELS; i++) {
                    Indentation += '\t';
                }
            }

            let data = LineSyntax["data"];
            let assignment = `${Indentation}${data[0]} /= ${data[1]};\n`;
            executableScript += assignment;
        }
    }

    if (SCOPE_LEVELS) {
        throw new UserException(
          `TokenError: Expected closing tag for '${BLOCK_OPENS.pop()}' block`
        );
    }

    try{
        eval(executableScript);
        //console.log(executableScript);
    }
    catch(e) {
        console.log(executableScript);
        throw new UserException(`${e}`);
    }
}

const SyntaxValidationMetrics = (Tokens, LINE) => {
  
	let dataString = "";

	for (let tokenStruct of Tokens) {
		for (let tokenId in tokenStruct) {
		dataString += tokenStruct[tokenId];
		}
  }

	if (/^\s+$/.test(dataString)) return;

	dataString = trim(dataString);
  ParenthesisEqualizer(dataString, LINE);

  let pattern = /^\s*(endblock)\s*$|^\s*(end)\s*$|^\s*(endif)\s*$|^\s*(endfor)\s*$|^\s*(endwhile)\s*$|^\s*(endfrom)\s*$|^\s*(endfunction)\s*$|^\s*\:\s*$/i;
  
  if(/^\s*(break|continue)\s*$/i.test(dataString)) {
      validatedSyntax.push(
          {
              type: 'loop-jump',
              data: trim(dataString)
          }
      );
  }
  else if(/^\s*do\s*$/i.test(dataString)) {
      validatedSyntax.push(
          {
              type: 'do-while-iteration',
              data: trim(dataString)
          }
      );
  }
  else if (/^\s*if\s+(.+)/i.test(dataString)) {
    
      SemanticParsingSystem(Tokens, LINE, 2);
      
      return;
  } 
  else if (/^\s*while\s*/i.test(dataString)) {
      
      const regexp = /^\s*while\s+(.+)/i;

      if (regexp.test(dataString)) {
          SemanticParsingSystem(Tokens, LINE, 1);
      }
      else{
          throw new UserException(`SyntaxError: Unidentified expression '${dataString}' encountered on Line: ${LINE}`);
      }

		  return;
  }
  else if(/^\s*pop\s+(.+)/i.test(dataString)){

      const regexp = /^\s*pop\s+(.+)/i;
      const data = dataString.match(regexp);
      if(data.length < 2) throw new UserException(`SyntaxError: Parse Error encountered on Line: ${LINE}`);
      
      if(array_ids.indexOf(data[1].trim()) == -1){
          throw new UserException(`SyntaxError: Unexpected array variable '${arrname}' encountered on Line: ${LINE}`);
      }

      validatedSyntax.push(
          {
              'type': 'popping-element',
              'data': data[1].trim()
          }
      )
  }
  else if (/^\s*push\s*/i.test(dataString)){

      const validations = [];
      const regexp = /^\s*push\s+(.+)/i;
      const data = dataString.match(regexp);
      if(data.length < 2) throw new UserException(`SyntaxError: Parse Error encountered on Line: ${LINE}`);
      const values = data[1].split(',');
      const arrname = values[values.length-1].trim();

      if(array_ids.indexOf(trim(arrname)) == -1) {
          throw new UserException(`SyntaxError: Unexpected array variable '${arrname}' encountered on Line: ${LINE}`);
      }else validations.push(arrname);

      for(let i = 0; i < values.length-1; i++){
          let expression = 'let exp = ' + values[i];
                
          let extractions = BridgeAnalysis(
                              LexicalTokenSystem(
                                  readline.createInterface({
                                    input: fs.createReadStream("./source.xjs", "utf8"),
                                    output: process.stdout,
                                    terminal: false,
                                  }),
                                  expression,
                                  false),
                              LINE,
                              0
                          );
          extractions.splice(0, 2);
          validations.push(extractions.join(''));
      }

      validatedSyntax.push(
          {
              'type': 'pushing-element',
              'data': validations
          }
      )
  }
  else if (/^\s*else\s*$/i.test(dataString)) {

      validatedSyntax.push(
          {
              'type': 'else'
          }
      )
  }
  else if(/^\s*swap\s+(.+)\s*\[(.+)\]\s+with\s+(.+)\s*\[(.+)\]\s*$/i.test(dataString)) {
      
      const regexp = /^\s*swap\s(.+)\[(.+)\]\swith\s(.+)\[(.+)\]\s*$/i;
      const data = dataString.match(regexp);

      SemanticParsingSystem(data, LINE, 16);
  }
  else if (/^\s*increment\s*/i.test(dataString)) {

      const regexp = /^\s*increment\s+(.+)\s+by\s+(.+)/i;

      if (regexp.test(dataString)) {
          const data = dataString.match(regexp);
          let value = data[2], varname = data[1];

          if(isNaN(value) && user_ids.indexOf(value) == -1){
              throw new UserException(
                `SyntaxError: Unidentified token '${value}' encountered on Line: ${LINE}`
              );
          }

          if(user_ids.indexOf(varname) == -1){
              throw new UserException(
                `SyntaxError: Unidentified token '${varname}' encountered on Line: ${LINE}`
              );
          }

          validatedSyntax.push(
              {
                  'type': 'add-increment',
                  'data': [varname, value]
              }
          )
      }
      else{
          throw new UserException(
            `SyntaxError: Unidentified expression '${dataString}' encountered on Line: ${LINE}`
          );
      }
  }
  else if (/^\s*decrement\s*/i.test(dataString)) {

      const regexp = /^\s*decrement\s+(.+)\s+by\s+(.+)/i;

      if (regexp.test(dataString)) {
          const data = dataString.match(regexp);
          let value = data[2], varname = data[1];

          if(isNaN(value) && user_ids.indexOf(value) == -1){
              throw new UserException(
                `SyntaxError: Unidentified token '${value}' encountered on Line: ${LINE}`
              );
          }

          if(user_ids.indexOf(varname) == -1){
              throw new UserException(
                `SyntaxError: Unidentified token '${varname}' encountered on Line: ${LINE}`
              );
          }

          validatedSyntax.push(
              {
                  'type': 'minus-decrement',
                  'data': [varname, value]
              }
          )
      }
      else{
          throw new UserException(
            `SyntaxError: Unidentified expression '${dataString}' encountered on Line: ${LINE}`
          );
      }
  }
  else if (/^\s*subtract\s*/i.test(dataString)) {

      const regexp = /^\s*subtract\s+(.+)\s+from\s+(.+)/i;

      if (regexp.test(dataString)) {
          const data = dataString.match(regexp);
          let value = data[1], varname = data[2];

          if(isNaN(value) && user_ids.indexOf(value) == -1){
              throw new UserException(
                `SyntaxError: Unidentified token '${value}' encountered on Line: ${LINE}`
              );
          }

          if(user_ids.indexOf(varname) == -1){
              throw new UserException(
                `SyntaxError: Unidentified token '${varname}' encountered on Line: ${LINE}`
              );
          }

          validatedSyntax.push(
              {
                  'type': 'minus-decrement',
                  'data': [varname, value]
              }
          )
      }
      else{
          throw new UserException(
            `SyntaxError: Unidentified expression '${dataString}' encountered on Line: ${LINE}`
          );
      }
  }
  else if (/^\s*add\s*/i.test(dataString)) {

      const regexp = /^\s*add\s+(.+)\s+to\s+(.+)/i;

      if (regexp.test(dataString)) {
          const data = dataString.match(regexp);
          let value = data[1], varname = data[2];

          if(isNaN(value) && user_ids.indexOf(value) == -1){
              throw new UserException(
                `SyntaxError: Unidentified token '${value}' encountered on Line: ${LINE}`
              );
          }

          if(user_ids.indexOf(varname) == -1){
              throw new UserException(
                `SyntaxError: Unidentified token '${varname}' encountered on Line: ${LINE}`
              );
          }

          validatedSyntax.push(
              {
                  'type': 'add-increment',
                  'data': [varname, value]
              }
          )
      }
      else{
          throw new UserException(
            `SyntaxError: Unidentified expression '${dataString}' encountered on Line: ${LINE}`
          );
      }
  }
  else if (/^\s*multiply\s*/i.test(dataString)) {

      const regexp = /^\s*multiply\s+(.+)\s+by\s+(.+)/i;

      if (regexp.test(dataString)) {
          const data = dataString.match(regexp);
          let value = data[2], varname = data[1];

          if(isNaN(value) && user_ids.indexOf(value) == -1){
              throw new UserException(
                `SyntaxError: Unidentified token '${value}' encountered on Line: ${LINE}`
              );
          }

          if(user_ids.indexOf(varname) == -1){
              throw new UserException(
                `SyntaxError: Unidentified token '${varname}' encountered on Line: ${LINE}`
              );
          }

          validatedSyntax.push(
              {
                  'type': 'multiply',
                  'data': [varname, value]
              }
          )
      }
      else{
          throw new UserException(
            `SyntaxError: Unidentified expression '${dataString}' encountered on Line: ${LINE}`
          );
      }
  }
  else if (/^\s*divide\s*/i.test(dataString)) {

      const regexp = /^\s*divide\s+(.+)\s+by\s+(.+)/i;

      if (regexp.test(dataString)) {
          const data = dataString.match(regexp);
          let value = data[2], varname = data[1];

          if(isNaN(value) && user_ids.indexOf(value) == -1){
              throw new UserException(
                `SyntaxError: Unidentified token '${value}' encountered on Line: ${LINE}`
              );
          }

          if(user_ids.indexOf(varname) == -1){
              throw new UserException(
                `SyntaxError: Unidentified token '${varname}' encountered on Line: ${LINE}`
              );
          }

          validatedSyntax.push(
              {
                  'type': 'divide',
                  'data': [varname, value]
              }
          )
      }
      else{
          throw new UserException(
            `SyntaxError: Unidentified expression '${dataString}' encountered on Line: ${LINE}`
          );
      }
  }
  else if (/^\s*read file\s+(.+)/i.test(dataString)) {
    const regexp = /^\s*read file\s+(.+)\s+as\s+(.+)/i;

    if (regexp.test(dataString)) {
      const data = dataString.match(regexp);
      let filename = data[1];
      let varname = data[2];
      let declared = false;

      if (user_ids.indexOf(varname) != -1) {
        declared = true;
      } else {
        if (!/^[a-zA-Z_$][a-zA-Z0-9_\s]*$/i.test(varname)) {
          throw new UserException(
            `SyntaxError: Unidentified expression '${varname}' encountered on Line: ${LINE}`
          );
        }else user_ids.push(varname);
      }

      let isFile = fs.exists(filename, (val) => {
        if (val){}
        else
          throw new UserException(
            `FileError: Unidentified file path '${filename}' encountered on Line: ${LINE}`
          );
      });

      validatedSyntax.push({
        type: "read-file-as",
        data: filename,
        varname: varname,
        declared: declared
      });
    }
    else{
      const regexp = /^\s*read file\s+(.+)/i;
      if (regexp.test(dataString)) {
        const data = dataString.match(regexp);
        let filename = data[1];
        let isFile = fs.exists(filename, (val) => {
          if (val) {
          } else
            throw new UserException(
              `FileError: Unidentified file path '${filename}' encountered on Line: ${LINE}`
            );
        });

        validatedSyntax.push({
          type: "read-file",
          data: filename,
        });
      }
    }
  } 
  else if (/^\s*read file\s+(.+)/i.test(dataString)) {
    const regexp = /^\s*read file\s+(.+)/i;

    if (regexp.test(dataString)) {
      const data = dataString.match(regexp);
      let filename = data[1];
      let isFile = fs.exists(filename, (val) => {
        if (val){}
        else
          throw new UserException(
            `FileError: Unidentified file path '${filename}' encountered on Line: ${LINE}`
          );
      });

      validatedSyntax.push({
        type: "read-file",
        data: filename,
      });
    }
  }
  else if (/^\s*delete file\s+(.+)/i.test(dataString)) {
    const regexp = /^\s*delete file\s+(.+)/i;

    if (regexp.test(dataString)) {
      const data = dataString.match(regexp);
      let filename = data[1];
      let isFile = fs.exists(filename, (val) => {
        if (val){}
        else
          throw new UserException(
            `FileError: Unidentified file path '${filename}' encountered on Line: ${LINE}`
          );
      });

      validatedSyntax.push({
        type: "delete-file",
        data: filename,
      });
    }
  } else if (/^\s*create file\s+(.+)/i.test(dataString)) {
    const regexp = /^\s*create file\s+(.+)/i;

    if (regexp.test(dataString)) {
      const data = dataString.match(regexp);
      let filename = data[1];
      let isFile = fs.exists(filename, (val) => {
        if (!val){}
        else
          throw new UserException(
            `FileError: Specified file '${filename}' already exists. Encountered on Line: ${LINE}`
          );
      });

      validatedSyntax.push({
        type: "create-file",
        data: filename,
      });
    }
  } else if (/^\s*append\s+(.+)/i.test(dataString)) {
    const regexp = /^\s*append\s+(.+)\s+to\s+(.+)/i;

    if (regexp.test(dataString)) {
      const data = dataString.match(regexp);
      let filedata = data[1];
      if (/^\'.*\'$|^\".*\"$/.test(filedata)){}
      else if (
        /^[0-9]+e[0-9]+$|^[0-9]+e\-[0-9]+$|^[0-9]+\.[0-9]+$|[0-9]+/.test(
          filedata
        )
      ){}
      else if (user_ids.indexOf(filedata) != -1){}
      else {
        throw new UserException(
          `SyntaxError: Unidentified token '${filedata}' encountered on Line: ${LINE}'`
        );
      }

      let filename = data[2];

      validatedSyntax.push({
        type: "append-file",
        data: filedata,
        file: filename,
      });
    }
  } else if (/^\s*write\s+(.+)\s+to\s+(.+)/i.test(dataString)) {
    const regexp = /^\s*write\s+(.+)\s+to\s+(.+)/i;

    if (regexp.test(dataString)) {
      const data = dataString.match(regexp);
      let filedata = data[1];
      if (/^\'.*\'$|^\".*\"$/.test(filedata)){}
      else if (
        /^[0-9]+e[0-9]+$|^[0-9]+e\-[0-9]+$|^[0-9]+\.[0-9]+$|[0-9]+/.test(
          filedata
        )
      ){}
      else if (user_ids.indexOf(filedata) != -1){}
      else {
        throw new UserException(
          `SyntaxError: Unidentified token '${filedata}' encountered on Line: ${LINE}'`
        );
      }

      let filename = data[2];

      validatedSyntax.push({
        type: "write-file",
        data: filedata,
        file: filename,
      });
    }
  } 
  else if (/^\s*rename\s+(.+)\s+as\s+(.+)/i.test(dataString)) {
    const regexp = /^\s*rename\s+(.+)\s+as\s+(.+)/i;

    if (regexp.test(dataString)) {
      const data = dataString.match(regexp);
      let filename = data[1];
      let new_filename = data[2];

      let isFile = fs.exists(filename, (val) => {
        if (val){}
        else
          throw new UserException(
            `FileError: Specified file '${filename}' does not exists. Encountered on Line: ${LINE}`
          );
      });

      validatedSyntax.push({
        type: "rename-file",
        data: filename,
        name: new_filename,
      });
    }
  }
  else if (/^\s*read\s*/i.test(dataString)) {
    const regexp = /^\s*read\s+(.+)/i;

    if (regexp.test(dataString)) {
      const data = dataString.match(regexp);

      READING_USER_INPUT = true;

      SemanticParsingSystem(data, LINE, 11);
    } else {
      throw new UserException(
        `SyntaxError: Unidentified expression '${dataString}' encountered on Line: ${LINE}`
      );
    }

    return;
  } 
  else if (/^\s*enter\s*/i.test(dataString)) {
    const regexp = /^\s*enter\s+(.+)/i;

    if (regexp.test(dataString)) {
      const data = dataString.match(regexp);

      READING_USER_INPUT = true;

      SemanticParsingSystem(data, LINE, 11);
    } else {
      throw new UserException(
        `SyntaxError: Unidentified expression '${dataString}' encountered on Line: ${LINE}`
      );
    }

    return;
  }
  else if (/^\s*else if\s*/i.test(dataString)) {
    const regexp = /^\s*else if\s+(.+)/i;

    if (regexp.test(dataString)) {
      SemanticParsingSystem(Tokens, LINE, 3);
    }

    return;
  } else if (/^\s*from\s+(.+)/i.test(dataString)) {
    for (let regexp of iterations_regexp) {
      if (regexp.test(dataString)) {
        const data = dataString.match(regexp);

        SemanticParsingSystem(data, LINE, 5);

        break;
      }
    }

    return;
  } else if (/^\s*declare\s+(.+)/i.test(dataString)) {
    let regexp = /^\s*declare\s+(.+)\s+as\s+(.+)/i;
    if (regexp.test(dataString)) {
      const data = dataString.match(regexp);

      SemanticParsingSystem(Tokens, LINE, 0);
    } else {
      regexp = /^\s*declare\s+(.+)/i;
      const data = dataString.match(regexp);

      SemanticParsingSystem(data, LINE, 15);
    }

    return;
  } else if (/^\s*function\s+(.+)/i.test(dataString)) {
    let regexp = /^\s*function\s+(.+)$/i;
    const data = dataString.match(regexp);

    SemanticParsingSystem(data, LINE, 7);

    return;
  } else if (/^\s*for each\s+(.+)/i.test(dataString)) {
    let regexp = /^\s*for each\s+(.+)\s+in\s+(.+)/i;

    if (regexp.test(dataString)) {
      const data = dataString.match(regexp);

      SemanticParsingSystem(data, LINE, 6);
    } else {
      throw new UserException(
        `SyntaxError: Unidentified expression '${dataString}' encountered on Line: ${LINE}`
      );
    }

    return;
  } else if (/^\s*for every\s+(.+)/i.test(dataString)) {
    let regexp = /^\s*for every\s+(.+)\s+in\s+(.+)/i;

    if (regexp.test(dataString)) {
      const data = dataString.match(regexp);

      SemanticParsingSystem(data, LINE, 6);
    } else {
      throw new UserException(
        `SyntaxError: Unidentified expression '${dataString}' encountered on Line: ${LINE}`
      );
    }

    return;
  } else if (/^\s*(initialize|set)\s*/i.test(dataString)) {
    const regexp = /^\s*(initialize|set)\s+(.+)\s+with\s+(.+)/i;

    if (regexp.test(dataString)) {
      const data = dataString.match(regexp);

      SemanticParsingSystem(data, LINE, 4);
    } else {
      let regexp = /^\s*(initialize|set)\s+(.+)/i;
      const data = dataString.match(regexp);

      let defined = true;
      let arrayname = data[2];

      if (/^[a-zA-Z_$][a-zA-Z0-9_\s]*$/i.test(arrayname)) {
        if (user_ids.indexOf(arrayname) == -1) {
          user_definitions(arrayname);
          defined = false;
        }

        array_ids.push(arrayname);
      } else {
        throw new UserException(
          `SyntaxError: Invalid array name '${arrayname}' initialized on Line: ${LINE}`
        );
      }

      validatedSyntax.push({
        type: "array-declaration",
        userdefined: defined,
        data: [arrayname],
      });
    }

    return;
  } else if (/^\s*pass in\s+(.+)/i.test(dataString)) {
    const regexp = /^\s*pass in\s+(.+)/i;
    const data = dataString.match(regexp);

    SemanticParsingSystem(data, LINE, 9);

    return;
  } else if (
    /^\s*write\s+|^\s*print\s+|^\s*output\s+|^\s*log\s+|^\s*display\s+|^\s*enter\s+/i.test(
      dataString
    )
  ) {
    const regexp = /^\s*(write|print|output|log|display|enter)\s+(.+)/i;
    const data = dataString.match(regexp);

    SemanticParsingSystem([Tokens, data], LINE, 10);

    return;
  } else if (/^\s*return\s*/i.test(dataString)) {
    const regexp = /^\s*return\s+(.+)/i;

    if (regexp.test(dataString)) {
      const data = dataString.match(regexp);

      SemanticParsingSystem([Tokens, data], LINE, 12);
    } else if (/^\s*return\s*$/i.test(dataString)) {
      validatedSyntax.push({
        type: "return-statement",
        data: [],
      });
    } else {
      throw new UserException(
        `SyntaxError: Unidentified expression '${dataString}' encountered on Line: ${LINE}`
      );
    }

    return;
  } else if (/^\s*call\s+(.+)/i.test(dataString)) {
    const regexp = /^\s*call\s+(.+)\s+with\s+(.+)/i;
    if (regexp.test(dataString)) {
      let data = dataString.match(regexp);
      SemanticParsingSystem(data, LINE, 13);
      return;
    } else {
      let data = dataString.match(/^\s*call\s+(.+)/i);
      SemanticParsingSystem(data, LINE, 13);
      return;
    }
  } else if (/^\s*get\s+(.+)/i.test(dataString)) {
    const regexp = /^\s*get\s+(.+)\s+from\s+(.+)\s+with\s+(.+)/i;
    if (regexp.test(dataString)) {
      let data = dataString.match(regexp);
      SemanticParsingSystem(data, LINE, 14);
      return;
    } else {
      let data = dataString.match(/^\s*get\s+(.+)\s+from\s+(.+)/i);
      SemanticParsingSystem(data, LINE, 14);
      return;
    }
  } else if (pattern.test(dataString)) {
    const data = pattern.exec(dataString);

    SemanticParsingSystem(data, LINE, 8);

    return;
  } else {
    let Continue = false;

    for (let i = 0; i < assignments_regexp.length; i++) {
      let regexp = assignments_regexp[i];

      if (regexp.test(trim(dataString))) {
        Continue = true;

        SemanticParsingSystem(Tokens, LINE, 0);

        break;
      }

      if (i == assignments_regexp.length - 1 && !Continue) {
        let isvariable = false;

        for (let i = 0; i < variables_regexp.length; i++) {
          let regexp = variables_regexp[i];

          if (regexp.test(trim(dataString))) {
            isvariable = true;

            SemanticParsingSystem(Tokens, LINE, 0);

            break;
          }

          if (i == variables_regexp.length - 1 && !isvariable) {
            throw new UserException(
              `SyntaxError: Unidentified expression '${dataString}' encountered on Line: ${LINE}`
            );
          }
        }
      }
    }
  }
  
}

function SyntaxTreeAbstraction() {
    
    if(READING_USER_INPUT) {

        setTimeout(()=>{
            SyntaxTreeAbstraction();
        }, 3000);

        return;
    }

    let Tokens_;

    if(!LINE)
    {
        requireUserSourceCode().then(
            () => { 

                Tokens_ = getLineTokens();
				        TOKENS_[++LINE] = Tokens_;
                
                if (Tokens_) SyntaxValidationMetrics(Tokens_, LINE);
                
                if(LINE < FILE_LINE_DATA.length) {
                    SyntaxTreeAbstraction();
                } else {
                    
                    JavaScriptCodeGeneratorSystem();
                }
            }
        )
    }else{
        Tokens_ = getLineTokens();
        
        TOKENS_[++LINE] = Tokens_;
        
        if (Tokens_)  SyntaxValidationMetrics(Tokens_, LINE);

        if (LINE < FILE_LINE_DATA.length) {
            SyntaxTreeAbstraction();
        } else {
            
            JavaScriptCodeGeneratorSystem();
        }
    }
}

SyntaxTreeAbstraction();

