# require.js

require.js let you call require() in web browser like in node.js.
You import the script in the html file, then provide a read_file function, a separator and call start_with with your entry script. All of other requires need to be in your entry script.
In each imported script, all require calls and other statements need to be separated by a separator provided by you. See example for details.

Limitations:
No cycles in dependency graph. I resolve dependency in topology order such that the require will never complete if you have cycles in dependency. Normally, you do not do this even if you are in nodejs.
All of the require statement need to be in the start of the script, separated with other statements with a separator provided by you. You cannot require script in the middle of your script.
Hard to debug. The stack trace gets long after several require calls.

See example for detail. You need to setup a local server to provide local resources in the example.
