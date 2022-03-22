function createUser() {
    return new Promise(async(resolve, reject) => {
        const response = await fetch('https://mycustomcursors.online/node/user',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({cursorsCollection: [], lastUsedCollection: []}),
            });

        const data = await response.json();

        resolve(data);
    });
}

function addCursor(userId, cursorId) {
    return new Promise( async(resolve, reject) => {
        const response = await fetch('https://mycustomcursors.online/node/cursor',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({userId: userId, collectionId: '61f0107fdf02797036b0807d', cursorId: cursorId}),
            });

        resolve(response);
    });
}

function deleteCursor(userId, cursorId) {
    return new Promise(async(resolve, reject) => {
        const response = await fetch('https://mycustomcursors.online/node/cursor',
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({userId: userId, cursorId: cursorId}),
            });

        console.log(response);
        resolve(response);
    });
}

function getTopCursors() {
    return new Promise(async(resolve, reject) => {
        const data = await fetch('https://mycustomcursors.online/node/collection/61f0107fdf02797036b0807d');
        const json = await data.json();

        resolve(json);
    });
}

function getUserCollection(userId) {
    return new Promise(async(resolve, reject) => {
        const data = await fetch('https://mycustomcursors.online/node/user/collection/' + userId);
        const json = await data.json();

        resolve(json);
    });
}

function updateUserCollection() {
    chrome.storage.local.get(['user_collection', 'user_Id_custom_cursors'], function(result) {
        if (result.user_Id_custom_cursors) getUserCollection(result.user_Id_custom_cursors).then(data => {
            chrome.storage.local.set({'user_collection': data});
        });
    });
}

updateUserCollection();

chrome.storage.local.get(['topCollection', 'cursor_size', 'extension_play', 'user_Id_custom_cursors', 'tryingUrl'], function(result) {
    if (!result.topCollection) getTopCursors().then(data => {
        chrome.storage.local.set({'topCollection': data.items});
    });
    if (!result.tryingUrl) {
        chrome.storage.local.set({"tryingUrl" : "off"})
    }
    if (!result.cursor_size) {
        chrome.storage.local.set({'cursor_size': 'three'});
    }
    if (!result.extension_play) {
        chrome.storage.local.set({'extension_play': 'on'});
    }
    if (!result.user_Id_custom_cursors) createUser().then(data => {
        chrome.storage.local.set({'user_Id_custom_cursors': data._id});
        chrome.runtime.setUninstallURL(`https://mycustomcursors.online/pool?userId=${data._id}`);
    });
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function(tab){
        if (tab.url.startsWith("chrome://") || tab.url.startsWith('https://chrome.google') || tab.url.startsWith("chrome://newtab")){
            chrome.storage.local.set({'isExtensionWorking': false});
        } else {
            chrome.storage.local.set({'isExtensionWorking': true});
        }
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tabInfo) => {
    if (changeInfo.url){
        if (changeInfo.url.startsWith("chrome://") || changeInfo.url.startsWith('https://chrome.google') || changeInfo.url.startsWith("chrome://newtab")){
            chrome.storage.local.set({'isExtensionWorking': false});
        } else {
            chrome.storage.local.set({'isExtensionWorking': true});
        }

    }
})

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === 'ADD') chrome.storage.local.get('user_Id_custom_cursors', async function(result) {
        console.log(result.user_Id_custom_cursors, request.cursorId);
        const response = await addCursor(result.user_Id_custom_cursors, request.cursorId);

        if (response.status === 200) {
            updateUserCollection();
            sendResponse('ok');
        }
        else sendResponse('error');
    });
    else if (request.type === 'REFRESH_COLLECTION'){
        updateUserCollection();
        sendResponse("");
    }
    else if (request.type === 'DELETE') chrome.storage.local.get('user_Id_custom_cursors', async function(result) {
        const response = await deleteCursor(result.user_Id_custom_cursors, request.cursorId);

        if (response.status === 200) {
            updateUserCollection();
            sendResponse('ok');
        }
        else sendResponse('error');
    });

    return true;
});

chrome.tabs.query({}, function(tabs) {
    tabs.forEach(tb => {
        const isMatch = !(tb.url.match("https://chrome.google.com") || tb.url.match('chrome://')|| tb.url.match("chrome-error://chromewebdata/") || tb.url.match("error://chromewebdata/") || tb.url.match("view-source:") || tb.url.match("file:///") || !tb.url.match("http://") && !tb.url.match("https://"))
        if (isMatch) {
            chrome.scripting.executeScript({target: {tabId: tb.id, allFrames: false}, files: ['js/ContentScript.js']});
        }
    });
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.tabs.create({
        url: 'https://mycustomcursors.online/',
    });
});
