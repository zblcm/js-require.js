const Require = {};

// ensure all documents are already done.
Require.headers = {};
Require.Header = function(path) {
    let header = this;
    header.start_waiting = false;
    header.done_waiting = false;
    header.done_processing = false;
    header.headers_upper = {};
    header.headers_lower = {};
    header.result = {};

    // When one of its parent finished processing, check self.
    header.check = function() {
        // ensure that the waiting_callback is only going to be called once.
        if (header.done_waiting)
            return false;

        // ensure we have started waiting. (parents are determined.)
        if (!header.start_waiting)
            return false;

        // ensure all of its parents has generated result.
        for (let i in header.headers_upper)
            if (!header.headers_upper[i].done_processing)
                return false;

        header.done_waiting = true;
        header.waiting_callback();
    };

    // Called when the dependency graph of upper scripts is done.
    header.wait = function(callback) {
        header.start_waiting = true;
        header.waiting_callback = callback;

        // do a check for the case that all of the parent has already done processing.
        header.check();
    };

    // inform its children that I have generated the result.
    header.finish = function() {
        header.done_processing = true;
        for (let i in header.headers_lower)
            header.headers_lower[i].check();
    };

    path = path? path:".";
    header.path = path;
    Require.headers[header.path] = header;

    if (path !== ".")
        Require.read_file(header.path, function(text) {
            // Compile the text.
            let texts;
            texts = text.split("'" + Require.separator + "';");
            if (texts.length < 2)
                texts = text.split('"' + Require.separator + '";');
            let text_h, text_t;
            if (texts.length < 2) {
                text_h = "";
                text_t = texts[0];
            }
            else {
                text_h = texts[0];
                text_t = texts[1];
            }
            text_t = text_t.split("\n").map(line => "    " + line).join("\n");
			
			"use strict";
			const require = function(path) {
				return Require.internal_require(path, header).result;
			};
			text = text_h + "header.wait(function() { let module = {};" + text_t + "\nfor (let i in module.exports) header.result[i] = module.exports[i]; header.finish(); });\n//# sourceURL=Require[" + header.path + "]";

            eval(text);
        });
};
Require.set_read_file = function(read_file) {
    Require.read_file = read_file;
};
Require.set_separator = function(separator) {
    Require.separator = separator;
};
Require.calculate_path = function(path_prev, path_rel) {
    let splits = path_prev.split("/");
    splits.pop(); // remove filename
    splits = splits.concat(path_rel.split("/")).filter(item => item !== ".");
    splits.unshift("."); // add "." back.
    return splits.join("/");
};
Require.get_header = function(path) {
    if (!path) path = ".";
    return Require.headers[path]? Require.headers[path]:(new Require.Header(path));
};

Require.internal_require = function(path_rel, header_curr) {
    let header_next = Require.get_header(Require.calculate_path(header_curr.path, path_rel));

    // Build dependency graph.
    header_next.headers_lower[header_curr.path] = header_curr;
    header_curr.headers_upper[header_next.path] = header_next;

    return header_next;
};
Require.start_with = function(path, callback) {
    let header = Require.get_header();
    let header_next = Require.internal_require(path, header);
    header.wait(function() {
        callback(header_next.result);
        header.finish(); // actually this is useless.
    });
};
Require.run_script = function(text) {
    let elt = document.createElement("script");
    elt.type="text/javascript";
    elt.innerHTML = text;
    document.getElementsByTagName("head")[0].appendChild(elt);
};