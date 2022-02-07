const cursorContainerWelcomePopUp = document.getElementById("cursor-container-welcome")
const topCursorContainerUserPopUp = document.getElementById('top-cursor-container')
const togBtn = document.getElementById('togBtn');
const extensionOff = document.getElementById('extension-off');
const extensionNotWorking = document.getElementById('extension-not-working');
const extensionNotWorkingWelcome = document.getElementById('extension-not-working-welcome');
const userCollectionPopUp = document.getElementById("user-collection-pop-up");
const welcomePopUp = document.getElementById("welcome-pop-up");
const buttonsUserCollectionPopUp =  document.getElementById('buttons-user-collection-popup');
const sizeDotContainerOff = document.getElementById('size-dot-container-off');
const sizeDotContainer = document.getElementById('size-dot-container');
let userCollection = []

chrome.storage.local.get(["cursor_size", "topCollection", "user_collection", "extension_play", "isExtensionWorking", "obj_cursor_url"], function (result) {
    userCollection = result.user_collection;
    if (result.user_collection !== undefined && Array.isArray(result.user_collection) && result.user_collection.length > 0) {
       userCollectionPopUp.style.display = "flex";
        welcomePopUp.style.display = "none";
    } else {
        userCollectionPopUp.style.display = "none";
        welcomePopUp.style.display = "flex";

    }
    document.getElementById(result.cursor_size).classList.add('active');
    document.getElementById(result.cursor_size + "-o").classList.add('active-off');

    if (result.extension_play === "on") {
        togBtn.checked = true;
    } else if (result.extension_play === "off") {
        togBtn.checked = false;
        extensionOff.style.display = 'block';
    }

    if (result.user_collection !== undefined && Array.isArray(result.user_collection) && result.user_collection.length > 0) {
        if (result.isExtensionWorking === false) {
            extensionNotWorking.style.display = "flex";
        }
    } else {
        if (result.isExtensionWorking === false) {
            extensionNotWorkingWelcome.style.display = "flex";
        }
    }

    result.topCollection.forEach((item, index) => {
        if (index <= 27) {
            drawTopCursorsInWelcomePopUp(item, index, cursorContainerWelcomePopUp, "welcome")
            if (result.user_collection !== undefined && Array.isArray(result.user_collection) && result.user_collection.length > 0){
                drawTopCursorsInWelcomePopUp(item, index, topCursorContainerUserPopUp, "user", userCollection)
            }
        }
    })

    if (result.user_collection){
        result.user_collection.forEach((item, index) => {
            drawUserCursors(item)
        })
    }

    if (result.obj_cursor_url && result.extension_play === 'on') {
        changeCursor(result.obj_cursor_url.urlCursor)
        changePointer(result.obj_cursor_url.urlPointer)
    }

})

function setOnClickListener() {
    document.getElementById('button-get-more-welcome').addEventListener('click', () => {
        window.open("https://mycustomcursors.online/cursor-collection", '_blank').focus();
    })

    document.getElementById('more-cursors-btn-welcome').addEventListener('click', () => {
        window.open("https://mycustomcursors.online/cursor-collection", '_blank').focus();
    })

    document.getElementById('button-go-to-collection').addEventListener('click', () => {
        chrome.storage.local.get(["user_collection", "topCollection", "isExtensionWorking"], function (result) {
            result.topCollection.forEach((item, index) => {
                if (index <= 27) {
                    drawTopCursorsInWelcomePopUp(item, index, topCursorContainerUserPopUp, "user" , result.user_collection)
                }
            })
            if (result.user_collection){
                result.user_collection.forEach((item) => {
                    drawUserCursors(item)
                })
                if (result.isExtensionWorking === false) {
                    extensionNotWorking.style.display = "flex";
                    extensionNotWorkingWelcome.style.display = "none";
                }
                userCollectionPopUp.style.display = "flex";
                welcomePopUp.style.display = "none";
            }
        })
    })

    document.getElementById('resize-button').addEventListener('click', () => {
        chrome.storage.local.get("obj_cursor_url", function (result) {
            if (!result.obj_cursor_url || result.obj_cursor_url === "") {
                buttonsUserCollectionPopUp.style.display = "none";
                sizeDotContainerOff.style.display = "flex";
            } else {
                buttonsUserCollectionPopUp.style.display = "none";
                sizeDotContainer.style.display = "flex";
            }
        });

    })

    document.getElementById('x-for-resize').addEventListener('click', () => {
        sizeDotContainer.style.display = "none";
        buttonsUserCollectionPopUp.style.display = "flex";
    })

    document.getElementById('x-for-resize-off').addEventListener('click', () => {
        sizeDotContainerOff.style.display = "none";
        buttonsUserCollectionPopUp.style.display = "flex";
    })

    document.getElementById('welcome-logo').addEventListener('click', () => {
        window.open("https://mycustomcursors.online/cursor-collection", '_blank').focus();
    })

    document.getElementById('welcome-how-to-use-container').addEventListener('click', () => {
        window.open("https://mycustomcursors.online/how-to-use", '_blank').focus();
    })

    document.getElementById('button-get-more').addEventListener('click', () => {
        window.open("https://mycustomcursors.online/cursor-collection", '_blank').focus();
    })

    document.getElementById('welcome-logo-user').addEventListener('click', () => {
        window.open("https://mycustomcursors.online/cursor-collection", '_blank').focus();
    })

    document.getElementById('how-to-use-button').addEventListener('click', () => {
        window.open("https://mycustomcursors.online/how-to-use", '_blank').focus();
    })

    document.getElementById('togBtn').addEventListener('change', () => {
        chrome.storage.local.get(["extension_play", "obj_cursor_url", "default_url"],async function (result) {
            if (result.extension_play === "on") {
                chrome.storage.local.set({"extension_play" : "off"})
                extensionOff.style.display = 'block';
                disablePointer()
                disableCursor()
                chrome.storage.local.set({"turn_off" : "off"})
            } else if (result.extension_play === "off") {
                chrome.storage.local.set({"extension_play" : "on"})
                chrome.storage.local.set({"obj_cursor_url" : ""})
                chrome.storage.local.set({"obj_cursor_url" : result.obj_cursor_url})
                changeCursor(result.obj_cursor_url.urlCursor)
                changePointer(result.obj_cursor_url.urlPointer)
                extensionOff.style.display = 'none';
                chrome.storage.local.set({"turn_off" : "on"})
            }
        })

    })
}

setOnClickListener();

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

function disablePointer() {
    let styleSheet = document.createElement('style');

    styleSheet.type = 'text/css';
    styleSheet.rel = 'stylesheet';

    styleSheet.innerHTML = `a, button, .pointer-hover {\n  cursor: pointer !important;\n        }\n `;
    document.head.appendChild(styleSheet);
}

function disableCursor() {
    let styleSheet = document.createElement('style');

    styleSheet.type = 'text/css';
    styleSheet.rel = 'stylesheet';

    styleSheet.innerHTML = `a, button, .cursor-hover {\n  cursor: default !important;\n        }\n `;
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

function resizeDataURL(data, wantedWidth, wantedHeight, type) {
    return new Promise(function (resolve, reject) {
        let img = document.createElement('img');
        img.onload = function () {
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            canvas.width = wantedWidth;
            canvas.height = wantedHeight;
            ctx.drawImage(img, 0, 0, wantedWidth, wantedHeight);
            resolve({type: type, data: canvas.toDataURL('image/png', 1)});
            img = null;
            canvas = null;
        };

        img.crossOrigin = "anonymous";
        img.src = data;
    });
}

function resizeCurrentCursor() {
    chrome.storage.local.get(["default_url"], async function (result) {
        if (result.default_url){
            const urls = await getResizedUrl(result.default_url.urlCursor, result.default_url.urlPointer);
            changeCursor(urls.urlCursor)
            changePointer(urls.urlPointer);
            chrome.storage.local.set({"obj_cursor_url" : urls})
        }
    });
}

function onClickForResize () {
    const dotArray = document.getElementsByClassName('dot');
    const dotOArray = document.getElementsByClassName('dot-o');
    Array.from(dotArray).forEach(dot => {
        dot.addEventListener("click", (event) => {
            if (!dot.classList.contains('active')){
                Array.from(dotOArray).forEach(dotO => {
                    if (dot.id + "-o" !== dotO.id) {
                        if (dotO.classList.contains('active-off')){
                            dotO.classList.remove('active-off')
                        }
                    } else {
                        dotO.classList.add('active-off')
                    }
                })

                Array.from(dotArray).forEach(dotIn => {
                    if (dot.id !== dotIn.id) {
                        if (dotIn.classList.contains('active')){
                            dotIn.classList.remove('active')
                        }
                    }
                })
                chrome.storage.local.set({"cursor_size" : dot.id})
                dot.classList.add('active')
                resizeCurrentCursor();
            }
        })
    })
}

onClickForResize()

function checkCursorSize() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(["cursor_size"], function (result) {
            let width = "";
            let height = "";
            console.log(result.cursor_size)
            if (result.cursor_size === "one") {
                width = 16;
                height = 16;
            } else if (result.cursor_size === "two") {
                width = 22;
                height = 22;
            } else if (result.cursor_size === "three") {
                width = 32;
                height = 32;
            }else if (result.cursor_size === "four") {
                width = 38;
                height = 38;
            }else if (result.cursor_size === "five") {
                width = 42;
                height = 42;
            }else if (result.cursor_size === "six") {
                width = 50;
                height = 50;
            }
            resolve({
                "width" : width,
                "height" : height
            })
        })

    })
}

function getResizedUrl(cursorUrl, pointerUrl) {
    return new Promise(async (resolve, reject) => {
        const sizeObj = await checkCursorSize();
        const dataResizedCursor = await resizeDataURL(cursorUrl, sizeObj.width, sizeObj.height, "cursor");
        const dataResizedPointer = await resizeDataURL(pointerUrl, sizeObj.width, sizeObj.height, "cursor");
        const newObj = {
            urlCursor: dataResizedCursor.data,
            urlPointer: dataResizedPointer.data
        }
        resolve(newObj)
    })
}

function changeTxtColorAndTextTryingButton(type, element) {
    if (type === "trying") {
        const buttonTxt = element.querySelector('.try-txt-welcome');
        buttonTxt.style.color = '#197DE1';
        buttonTxt.innerHTML = "STOP TRYING";
    } else {
        const buttonTxt = element.querySelector('.try-txt-welcome');
        buttonTxt.style.color = '#FFFFFF';
        buttonTxt.innerHTML = "TRY";
    }
}

function disableTrying() {
    const tryingButtons = document.querySelectorAll('.try-button-welcome')
    tryingButtons.forEach(button => {
        if (button.getAttribute('trying') === "true") {
                button.setAttribute('trying', 'false');
                button.style.backgroundColor = "#9F25FF";
                const anotherButtonTxt = button.querySelector('.try-txt-welcome')
                anotherButtonTxt.innerHTML = "TRY"
                anotherButtonTxt.style.color = "#ffffff"
        }
    })
}

function checkIfAnotherButtonTrying(index) {
    const tryingButtons = document.querySelectorAll('.try-button-welcome')
    tryingButtons.forEach(button => {
        if (button.id !== index.toString()) {
            if (button.getAttribute('trying') === "true") {
                button.setAttribute('trying', 'false');
                button.style.backgroundColor = "#9F25FF";
                const anotherButtonTxt = button.querySelector('.try-txt-welcome')
                anotherButtonTxt.innerHTML = "TRY"
                anotherButtonTxt.style.color = "#ffffff"
            }
        }
    })
}

async function onClickTry(event, item, element, index) {
    const mainElement = element.querySelector('.try-button-welcome');
    if (mainElement.getAttribute("trying") === "false") {
        const urlCursor = item.cursor_path ? item.cursor_path : item.cursor.newPath;
        const urlPointer = item.pointer_path ? item.pointer_path : item.pointer.newPath;
        const url = await getResizedUrl(urlCursor, urlPointer)

        mainElement.style.backgroundColor = "#F6FBFF";

        changeTxtColorAndTextTryingButton("trying", element)
        changeCursor(url.urlCursor);
        changePointer(url.urlPointer);
        checkIfAnotherButtonTrying(index)

        mainElement.setAttribute('trying', 'true')
    } else if (mainElement.getAttribute("trying") === "true") {
        disableCursor()
        disablePointer()
        mainElement.style.backgroundColor = "#9F25FF";
        changeTxtColorAndTextTryingButton("stop", element)
        mainElement.setAttribute('trying', 'false')
        chrome.storage.local.get("obj_cursor_url", function (result) {
            if (result.obj_cursor_url !== null) {
                changeCursor(result.obj_cursor_url.urlCursor)
                changePointer(result.obj_cursor_url.urlPointer)
            }
        });

    }
}

function addCursor(cursorId, element) {
    chrome.runtime.sendMessage({type: "ADD", cursorId: cursorId}, function (response) {
        if (response === "ok") {

            const backgroundElement = element.querySelector('.add-button-welcome');
            console.log(backgroundElement)
            backgroundElement.style.background = '#00D108';
            backgroundElement.querySelector('.image-add-welcome').src = '../asset/v-small.svg';
            element.querySelector('.v').style.display = 'flex';
            chrome.storage.local.get(["user_collection"], function (result) {
                userCollection = result.user_collection;
            })
        }
    });
}

function drawTopCursorsInWelcomePopUp(item, index, mainElement, type, collection) {

    let display = "none";
    let src = "../asset/ADD.svg";
    let backgroundColor = "linear-gradient(269.42deg, #006EDD 0%, #004585 100%)";

    if (type === "user") {
        if (collection) {
            collection.forEach(cursor => {
                if (cursor.id === item.id) {
                    display = "flex";
                    src = "../asset/v-small.svg"
                    backgroundColor = "#00D108"
                }
            })
        }
    } else {
        if (userCollection) {
            userCollection.forEach(cursor => {
                if (cursor.id === item.id) {
                    display = "flex";
                    src = "../asset/v-small.svg"
                    backgroundColor = "#00D108"
                }
            })
        }
    }


    const cubeContainerInner = document.createElement('div');

    cubeContainerInner.className = 'cube-container-inner-welcome';
    cubeContainerInner.id = item.id;

    cubeContainerInner.innerHTML =
        `<div class="cube-welcome">
                           <img class="img-cube-welcome" src="${item.cursor.newPath}" alt="pony"/>
                           <div class="v" style="display:${display}">
                              <img class="v-img" src="../asset/v.svg" alt="v" />
                           </div>
                       </div>
                       
                       <div class="cube-hover-welcome">
                           <div class="inner-cube-welcome">
                               <div class="img-cube-hover-welcome">
                                   <img class="img-cube-welcome" src="${item.pointer.newPath}" alt="pony"/>
                               </div>
                               <div class="buttons-inner-cube-welcome">
                                   <div id="${index}" trying="false" class="try-button-welcome">
                                       <div class="try-txt-welcome">
                                           TRY
                                       </div>
                                   </div>
                                   <div class="add-button-welcome" style="background:${backgroundColor}">
                                       <img class="image-add-welcome" src="${src}" alt="add"/>
                                   </div>
                               </div>
                           </div>
                       </div>`

    cubeContainerInner.querySelector('.try-button-welcome').addEventListener('click', async (event) => {
        await onClickTry(event, item, cubeContainerInner, index)
    })

    if (type === "welcome" && display === "none"){
        cubeContainerInner.querySelector('.add-button-welcome').addEventListener('click', async (event) => {
            addCursor(item.id, cubeContainerInner)
            document.getElementById("button-get-more-welcome").style.display = "none";
            document.getElementById('go-to-collection-button').style.display = 'flex';
        },{once : true})
    } else if (type === "user" && display === "none"){
        cubeContainerInner.querySelector('.add-button-welcome').addEventListener('click', bindingDataToClickListener.bind(null, item, cubeContainerInner),{once : true})
    }


    mainElement.appendChild(cubeContainerInner)
}

function bindingDataToClickListener(item, element) {
    addCursor(item.id, element)
    drawUserCursors(item)
}

function drawUserCursors(item) {
    const container  = document.getElementById("cursor-container");
    const cube = document.createElement('div');
    let cursorUrl = item.cursor_path ? item.cursor_path : item.cursor.newPath;
    let pointerUrl = item.pointer_path ? item.pointer_path : item.pointer.newPath;
    cube.className = "cube";

    cube.innerHTML = `<img id="x-image" class="x-image" src="../asset/x-icon.svg" alt="x"/>
                            <img id="cursor-image" class="cursor-view" src="${cursorUrl}" alt="cursor"/>`

    cube.addEventListener('mouseover', (event) => {
        cube.querySelector('#cursor-image').src = pointerUrl;
    })

    cube.addEventListener('mouseout', (event) => {
        cube.querySelector('#cursor-image').src = cursorUrl;
    })

    cube.addEventListener('click', async (event) => {
        const resizedUrl = await getResizedUrl(cursorUrl, pointerUrl);
        const resizeView = sizeDotContainerOff;
        chrome.storage.local.set({"obj_cursor_url" : resizedUrl})
        chrome.storage.local.set({"default_url" : {"urlCursor" : cursorUrl, "urlPointer" : pointerUrl}})
        if (resizeView.style.display === "flex") {
            resizeView.style.display = "none";
            sizeDotContainer.style.display = "flex";
        }
        disableTrying();
        changeCursor(resizedUrl.urlCursor)
        changePointer(resizedUrl.urlPointer)
    })

    cube.querySelector('#x-image').addEventListener('click', event => {
        document.getElementById('delete-img').src = cursorUrl;
        document.getElementById('button-no').addEventListener('click' , event => {
            document.getElementById('delete-cursor').style.display = "none";
        })
        const buttonYes = document.getElementById('button-yes');
        const clone = buttonYes.cloneNode(true);

        clone.addEventListener('click' , () => {
            chrome.runtime.sendMessage({type: "DELETE", cursorId: item.id}, async function (response) {
                if (response === "ok") {
                    const topCubeArray = document.getElementsByClassName("cube-container-inner-welcome");
                    Array.from(topCubeArray).forEach((cube, index) => {
                        if (cube.id === item.id.toString()) {
                            cube.querySelector('.v').style.display = "none";
                            cube.querySelector('.add-button-welcome').style.background = 'linear-gradient(269.42deg, #006EDD 0%, #004585 100%)';
                            cube.querySelector('.image-add-welcome').src = '../asset/ADD.svg';
                            const clone = cube.cloneNode(true);
                            clone.querySelector('.add-button-welcome').addEventListener('click', bindingDataToClickListener.bind(null, item, clone), {once : true})
                            clone.querySelector('.try-button-welcome').addEventListener('click', async (event) => {
                                await onClickTry(event, item, clone, index)
                            })
                            clone.id = cube.id;
                            cube.parentNode.replaceChild(clone, cube);
                        }
                    })
                    const resizeView = document.getElementById("size-dot-container");
                    if (resizeView.style.display === "flex") {
                        resizeView.style.display = "none";
                        document.getElementById("size-dot-container-off").style.display = "flex";
                    }
                    chrome.storage.local.set({"default_url" : {"urlCursor" : "", "urlPointer" : ""}})
                    chrome.storage.local.set({"obj_cursor_url" : ""})
                    disableCursor()
                    disablePointer()
                    container.removeChild(cube);
                }
            });
            document.getElementById('delete-cursor').style.display = "none";
        })
        buttonYes.parentNode.replaceChild(clone,buttonYes)
        document.getElementById('delete-cursor').style.display = "flex";

    })

    container.appendChild(cube)
}
