# require.js

require.js let you call require() in web browser like in node.js.
<br />This is for intellisense purpose. Client in browser and server in nodejs can share some common code now.
## How to use:
You import the script in the html file, then provide a read_file function, a separator and call start_with with your entry script.
```
<script type="text/javascript" src="require.js"></script>
<script>
    Require.set_read_file(<YOUR_READ_FILE_FUNCTION>);
    Require.set_separator(<YOUR_SEPARATOR_STRING>);
    Require.start_with(<YOUR_ENTRY_SCRIPT>, <CALLBACK_WHEN_REQUIRE_DONE>);
</script>
```
In your entry script, you can require other js file and export your result. All of the other require must be done by the entry script or its required scripts.
<br />The separator separates the script to 2 parts. Code before the separator runs when the require statements have not generated results yet. Code after the separator runs with the result of requires garunteed.
```
let <RESULT> = require(<YOUR_SCRIPT>);
<YOUR_SEPARATOR_STRING>;

// some statements using <RESULT>

module.exports = {
    result: <RESULT_TO_YOUR_CALLBACK>,
};
```
## example:
```
<script type="text/javascript" src="scripts/jquery-3.3.1.min.js"></script>
<script type="text/javascript" src="../require.js"></script>
<script>
    Require.set_read_file(function(path, callback) {
        let splits = path.split("/");
        splits.shift();
        let real_path = ["http://localhost/example/scripts"].concat(splits).join("/");
        $.ajax({ url: real_path, success: callback, dataType: "text" });
    });
    Require.set_separator("SEPARATE");
    Require.start_with("./testA.js", function(result) {
        console.log("Index:", result);
    });
</script>
```
```
// testA.js
let resultC = require("./testC.js");
let resultB = require("./test_folder/testB.js");
"SEPARATE";

console.log("Execute A.");
console.log("A:", resultB);
console.log("A:", resultC);

module.exports = {
    result: "Result A",
};
```
See example in repo for more details. You need to setup a local server to provide local resources in the example.

## Limitations:
###### - No cycles in dependency graph.
I resolve dependency in topology order such that the require will never complete if you have cycles in dependency. Normally, you do not do this even if you are in nodejs.
###### - All of the require statement need to be in the start of the script, separated with other statements with a separator provided by you.
You cannot require script in the middle of your script.
###### - Hard to debug.
The stack trace gets long after several require calls.
###### - module.exports must be an object.
I copyed all attributes from module.export to the require result. Therefore module.export must be an object.
