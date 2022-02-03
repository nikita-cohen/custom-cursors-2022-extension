window.addEventListener("message", (event) => {
    if (event.data.type && (event.data.type === "FROM_PAGE")) {
        chrome.storage.local.get(["user_Id_custom_cursors"], function (result) {
           window.postMessage({ type: "FROM_EXTENSION", user_id_cursors : result.user_Id_custom_cursors}, "*");
        });
    } else if (event.data.type && (event.data.type === "FROM_ADD_CURSOR")) {
        console.log("lalal")
        chrome.runtime.sendMessage({type: "REFRESH_COLLECTION"}, function (response) {

        });
    }
}, false);

function getStyle(element, property) {
    return (getComputedStyle(element, null).getPropertyValue(property));
}

function changePointer(url) {
    let styleSheet = document.createElement('style');

    styleSheet.type = 'text/css';
    styleSheet.rel = 'stylesheet';

    styleSheet.innerHTML = `a,  button, .pointer-hover {\n  cursor: url('${url}') 0 0, pointer !important;\n        }\n `;

    document.head.appendChild(styleSheet);
}

function changeCursor(url) {
    let styleSheet = document.createElement('style');

    styleSheet.type = 'text/css';
    styleSheet.rel = 'stylesheet';

    styleSheet.innerHTML = `.cursor-hover {\n  cursor: url('${url}') 0 0, default !important;\n        }\n `;

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
            changeCursor(newValue.urlCursor)
            changePointer(newValue.urlPointer)
        }
    }
})

chrome.storage.local.get("obj_cursor_url", function (result) {
    if (result.obj_cursor_url !== null) {
        changeCursor(result.obj_cursor_url.urlCursor)
        changePointer(result.obj_cursor_url.urlPointer)
    }
});




