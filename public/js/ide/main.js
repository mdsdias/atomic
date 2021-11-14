function getCompletions(token, context) {
    var found = [], start = token.string;
    function maybeAdd(str) {
        if (str.indexOf(start) == 0) found.push(str);
    }
    function gatherCompletions(obj) {
        if (typeof obj == "string") forEach(stringProps, maybeAdd);
        else if (obj instanceof Array) forEach(arrayProps, maybeAdd);
        else if (obj instanceof Function) forEach(funcProps, maybeAdd);
        for (var name in obj) maybeAdd(name);
    }

    if (context) {
        // If this is a property, see if it belongs to some object we can
        // find in the current environment.
        var obj = context.pop(), base;
        if (obj.className == "js-variable")
            base = window[obj.string];
        else if (obj.className == "js-string")
            base = "";
        else if (obj.className == "js-atom")
            base = 1;
        while (base != null && context.length)
            base = base[context.pop().string];
        if (base != null) gatherCompletions(base);
    }
    else {
        // If not, just look in the window object and any local scope
        // (reading into JS mode internals to get at the local variables)
        for (var v = token.state.localVars; v; v = v.next) maybeAdd(v.name);
        gatherCompletions(window);
        forEach(keywords, maybeAdd);
    }
    return found;
}
function synonyms(cm, option) {
    return new Promise(function(accept) {
        setTimeout(function() {
            var cursor = cm.getCursor(), line = cm.getLine(cursor.line)
            var start = cursor.ch, end = cursor.ch
            while (start && /\w/.test(line.charAt(start - 1)))--start
            while (end < line.length && /\w/.test(line.charAt(end)))++end
            var word = line.slice(start, end).toLowerCase()
            for (var i = 0; i < comp.length; i++) if (comp[i].indexOf(word) != -1)
                return accept({
                    list: comp[i],
                    from: CodeMirror.Pos(cursor.line, start),
                    to: CodeMirror.Pos(cursor.line, end)
                })
            return accept(null)
        }, 100)
    })
}


var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
    extraKeys: {
        "Ctrl-Space": "autocomplete"
    },
    mode: "javascript",
    lineWrapping: true,
    autoCloseTags: true,
    styleActiveLine: true,
    matchBrackets: true,
    theme: "ayu-dark",
    hintOptions: { hint: synonyms }
});

setTimeout(lang, 10);

var docLang = document.getElementById('lang');
function lang() {
    var currentLang = docLang.value;
    console.log(currentLang);
    editor.setOption('mode', currentLang)
}