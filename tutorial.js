/*
Source Code goes into Source.xjs file

by Gerald Sampson Annan and Dr. Yaw Missah

---------- Logic Programming Language ----------
----------------------------------------------
------------- Overview & Grammar -------------

Logic is a scripting programming language built by Gerald Annan as a support language for pseudocode programming and algorithmic implementation. It is written in nodejs and assembly for console manipulation.
It supports various fundamental programming concepts such as variable-declaration,
function calling, conditional statements, loops, proper order of operations, and recursion.
The language syntax is meant to be very readable and intuitive making use of simple structured english constructs: for instance, every
function body, conditional statement body, and loop body is ends with a colon : loops
follow a "from [startingNumber] to [endingNumber] as [variable]" syntax; and variable types are
specified upon declaration. Below is the language's EBNF-based grammar, and following that is the code
for the actual interpreter in the pseudolang.js file. Starting on line ? are some examples of programs that the language can run.

-----------------------
--------GRAMMAR--------
-----------------------

program::= variable-declaration | conditional | loop | expression [ program ]

variable-declaration::= variable-keyword variable-name assignment-operator variable-body
variable-keyword::= "set" | "let" | "declare" | "initialize"
variable-name::= identifier
assignment-operator::= "="
variable-body::= function-declaration | expression | comparison

function-declaration::= function-arguments wrapper function-body wrapper
function-arguments::= "pass in" (.+) "(" [ { expression "," } ] ")"
function-body::= program

conditional::= "if" comparison wrapper program wrapper [ { "else if" ... } | "else" wrapper program wrapper ]

comparison::= expression [ comparison-operator expression ]
comparison-operator::= "=="

loop::= "from" expression "to" expression "as" identifier wrapper program wrapper

expression::= term { "+" | "-" term }
term::= factor { "*" | "/" | "%" factor }
factor::= number | string | boolean | array | identifier | "-" factor | "(" expression ")" | function-call
function-call::= identifier "(" [ { expression "," } ] ")"
identifier::= { letter }
number::= { digit } [ "." { digit } ]
string::= """ [ { * } ] """
array::= initialize with "[" [ { expression "," } ] "]"
boolean::= "true" | "false"



letter::= "a" | "b" | ... | "y" | "z" | "A" | "B" | ... | "Y" | "Z"
digit::= "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"



wrapper::= ":"

---------- Logic Programming Language ----------
------------------------------------------------
---------------- Examples --------------------

*/

//  let one = 1
// 	set three as 3
// 	let hello be "hello"
// 	initialize array with 1, 2, 3, 4, 5, 6, 7

// function add
//   pass in a, b
//   let result be a
//   add b to result
//   return result
// endfunction

// get result from add with 5, 4
// display "result is: " + result
//
// 	function echo
//      pass in a
// 		  display a
// 	:
//
//  Basic Function Calling
//
//  call echo with 5
//
//  Basic conditional statements
//
//  if 3 equals 3
//		print "First"
//  else if echo(one) == 1
//		display "Second"
//	else
//		log "Third"
//	:
// 
//  Basic loops
//  
//  let len = lengthOf(array)
//
//  from 0 to len as i
//    let currentindexvalue be array[i]
//    print currentindexvalue
//  endfrom
//  
//  Nested Loops
// 
//  from 1 to 3 as i
//    from 1 to 3 as j
//      from 1 to 3 as k
//        print i, j, k
//      :
//    end
//  endfrom
//
//  display "-----------------"
//
// let index = 0
// let length be lengthOf(array)

// while index is less than length
//   display valueOf(index, array)
//   increment index by 1
// end

// display "-----------------"
// initialize names with "Gerald", "Sampson", "Annan"

// push "Joffery", names

// let name be pop(names)

// print name
// display "-----------------"

// let x be 20
// display "x is: ", x

// increment x by 5
// display "x is: ", x

// decrement x by 5
// subtract 5 from x
// display "x is: ", x

// add 5 to x
// display "x is: ", x

// multiply x by 5
// display "x is: ", x

// divide x by 5
// display "x is: ", x

// display "-----------------"
//
//  Fizzbuzz implementation
//
//  function Fizzbuzz

//    pass in n

//    from 1 to n as i
//      if i % 15 == 0
// 			  	print "FizzBuzz"
// 		  else if i mod 5 equals 0
// 			  	display "Buzz"
// 		  else if i modulo 3 is equal to 0
// 			  	output "Fizz"
// 	    else
// 			  	write i
// 		  endif

//    endfrom

//  endfunction

//  call Fizzbuzz with 35

// Recursion and Fibonacci

// function fib
//     pass in n

//     if n == 1
//         return 0
//     else if n equals 2
//         return 1
//     else
//         return Fib(n-1) + Fib(n-2)
//     endif
// end

// from 1 to 15 as i
//     print i, Fib(i)
// :
//
// Order Of operations
//
// function alwaysTwo
//     pass in n
// 		return ((((n + 47 % (19 * add(-3, 5))) * echo(three - one) - 4) / fib(4) - n + fib(echo(10)) - 29) * 3 - 9) / 3 - (((n + 109 % 10) * 2 - 4) / 2 - n)
//

// Call alwaysTwo with 4751
//
// Bubble Sort algorithmic implementation
//
//Bubble Sort algorithmic implementation

//initialize array with 101, 15, 1002, 77, 9, 14

//declare len as lengthof(array)

//from 0 to len as i
//  let parse = len - i
//  from 0 to parse as j
//  if array[j] > array[j+1]
//    swap array[j] with array[j+1]
//  endif
// endfrom
//endfrom

//display array