window.addEventListener("message", (event) => {
    if (event.data.type && (event.data.type === "FROM_PAGE")) {
        chrome.storage.local.get(["user_Id_custom_cursors"], function (result) {
           window.postMessage({ type: "FROM_EXTENSION", user_id_cursors : result.user_Id_custom_cursors}, "*");
        });
    } else if (event.data.type && (event.data.type === "FROM_ADD_CURSOR")) {
        chrome.runtime.sendMessage({type: "REFRESH_COLLECTION"}, function (response) {

        });
    }
}, false);

function getStyle(element, property) {
    return (getComputedStyle(element, null).getPropertyValue(property));
}

function changeCursor(urlCursor, urlPointer) {
    let styleSheet = document.createElement('style');

    styleSheet.type = 'text/css';
    styleSheet.rel = 'stylesheet';

    styleSheet.innerHTML = `.cursor-hover {\n  cursor: url('${urlCursor}') 0 0, default !important;\n        }\n 
     a,  button, .pointer-hover {\n  cursor: url('${urlPointer}') 0 0, pointer !important;\n        }\n`;

    document.head.appendChild(styleSheet);
}

function disableCursor() {
    let styleSheet = document.createElement('style');

    styleSheet.type = 'text/css';
    styleSheet.rel = 'stylesheet';

    styleSheet.innerHTML = `a, button, .cursor-hover {\n  cursor: default !important;\n        }\n 
    a, button, .pointer-hover {\n  cursor: pointer !important;\n        }\n `;
    document.head.appendChild(styleSheet);
}

document.body.addEventListener('mouseover', event => {
    let pointer = getStyle(event.target, 'cursor');
    if (pointer === 'pointer') {
        event.target.classList.add("pointer-hover");
    } else if (pointer === "default" || pointer === "auto") {
        event.target.classList.add("cursor-hover");
    }
})

chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (let [key, {oldValue, newValue}] of Object.entries(changes)) {
        if (key === "obj_cursor_url") {
            changeCursor(newValue.urlCursor, newValue.urlPointer)
        }
        if (key === "turn_off" && newValue === "off") {
            disableCursor()
        }
    }
})

chrome.storage.local.get("obj_cursor_url", function (result) {
    console.log(result.obj_cursor_url)
        changeCursor(result.obj_cursor_url.urlCursor, result.obj_cursor_url.urlPointer)
});
