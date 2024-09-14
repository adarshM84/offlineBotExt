var i = 0;
var botMessage = "";
var speed = 10;

function typeWriter() {
    document.getElementById("botResponse" + parseInt(localStorage.getItem("qId"))).innerHTML = convertBackticksToCodeBlock(botMessage);
    scrollDown("chat");
}

function convertBackticksToCodeBlock(text) {
    // Replace triple backticks with HTML <pre><code> tags
    return text
        .replace(/```([\s\S]*?)```/g, '<code class="align-middle">$1</code>'); // Handles multiline code blocks
}


function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function addMessage(userQ, botAn, msgType,ansDivNo=parseInt(localStorage.getItem("qId"))) {
    if (msgType == "question") {
        localStorage.setItem("qId", parseInt(localStorage.getItem("qId")) + 1)
        var chatRow = document.createElement("div");
        chatRow.className = "chatRow my-3";
        chatRow.id = "chatRow" + parseInt(localStorage.getItem("qId"));

        var userQDiv = document.createElement("div");
        userQDiv.className = "userQuery d-flex justify-content-start";
        userQDiv.innerHTML = userQ;

        var botAnDiv = document.createElement("div");
        botAnDiv.className = "botResponse d-flex justify-content-start";
        botAnDiv.id = "botResponseDiv" + parseInt(localStorage.getItem("qId"));

        var botAnEl = document.createElement("p");
        botAnEl.id = "botResponse" + parseInt(localStorage.getItem("qId"));
        botAnEl.innerHTML = '<span class="mt-1 coustomSpinner">Loading</span> <span class="spinner-grow spinner-grow-sm mt-2" role="status" aria-hidden="true"></span><span class="spinner-grow spinner-grow-sm mt-2" role="status" aria-hidden="true"></span><span class="spinner-grow spinner-grow-sm mt-2" role="status" aria-hidden="true"></span>';
        botAnDiv.appendChild(botAnEl);

        var divSvgList = document.createElement("div");
        divSvgList.className = "responseSvg"
        divSvgList.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-clipboard2-fill reactSvg" viewBox="0 0 16 16" onclick="copyResponse(' + parseInt(localStorage.getItem("qId")) + ')" id="copy' + parseInt(localStorage.getItem("qId")) + '"><path d="M9.5 0a.5.5 0 0 1 .5.5.5.5 0 0 0 .5.5.5.5 0 0 1 .5.5V2a.5.5 0 0 1-.5.5h-5A.5.5 0 0 1 5 2v-.5a.5.5 0 0 1 .5-.5.5.5 0 0 0 .5-.5.5.5 0 0 1 .5-.5z"/><path d="M3.5 1h.585A1.5 1.5 0 0 0 4 1.5V2a1.5 1.5 0 0 0 1.5 1.5h5A1.5 1.5 0 0 0 12 2v-.5q-.001-.264-.085-.5h.585A1.5 1.5 0 0 1 14 2.5v12a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-12A1.5 1.5 0 0 1 3.5 1"/><title>Copy Response</title>    </svg>                                                                                  <svg id="copied' + parseInt(localStorage.getItem("qId")) + '" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-clipboard-check-fill reactSvg" viewBox="0 0 16 16" style="display:none"><path d="M6.5 0A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0zm3 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5z"/><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1A2.5 2.5 0 0 1 9.5 5h-3A2.5 2.5 0 0 1 4 2.5zm6.854 7.354-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708.708"/><title>Copied</title></svg> '


        chatRow.appendChild(userQDiv);
        chatRow.appendChild(botAnDiv);
        chatRow.appendChild(divSvgList);

        document.getElementById("chat").appendChild(chatRow);
        return parseInt(localStorage.getItem("qId"));
    } else if (msgType == "answer") {
        // document.getElementById("botResponse" + ansDivNo).innerHTML = "";
        if(document.getElementById("botResponse" + ansDivNo).innerHTML.search("coustomSpinner")!=-1){
            document.getElementById("botResponse" + ansDivNo).innerHTML = "";
            botMessage="";
        }
        botMessage += botAn;
        document.getElementById("botResponse" + ansDivNo).setAttribute("style", "white-space: pre-line;");
        typeWriter("chat");
    }
    scrollDown("chat");
}

function copyResponse(divId, copied = false) {
    if (navigator.clipboard) {
        if (!copied) {
            window.navigator.clipboard.writeText(document.getElementById("chatRow" + divId).getElementsByTagName("div")[1].textContent);
            document.getElementById("copy" + divId).setAttribute("style", "display:none");
            document.getElementById("copied" + divId).setAttribute("style", "display:initial");
            setTimeout(copyResponse, 2000, divId, copied = true)
        } else {
            document.getElementById("copy" + divId).setAttribute("style", "display:initial");
            document.getElementById("copied" + divId).setAttribute("style", "display:none");
        }
    } else {
        // Clipboard API is not supported
        console.error('Clipboard API is not supported in this browser');
    }
}


function addWelcomeMessage(flag) {
    if (flag) {
        document.getElementById('welcomeDiv').hidden = false
    } else document.getElementById('welcomeDiv').hidden = true
}

function showMessage(msgType, elementId, msg) {
    if (msgType == "success") {
        if (document.getElementById(elementId).classList.contains('text-danger')) document.getElementById(elementId).classList.remove("text-danger");
        document.getElementById(elementId).classList.add("text-success");
        document.getElementById(elementId).innerHTML = msg;
    }
    else if (msgType == "error") {
        if (document.getElementById(elementId).classList.contains('text-success')) document.getElementById(elementId).classList.remove("text-success");
        document.getElementById(elementId).classList.add("text-danger");
        document.getElementById(elementId).innerHTML = msg;
    }
}

function callByEnter(event, functionName) {
    if (event.key == "Enter") {
        switch (functionName) {
            case "getQAnswer":
                getQAnswer();
                break;
            default:
        }
    }
}

function copyData(value) {
    navigator.clipboard.writeText(value)
}

function openModal(modalBtnId){
    document.getElementById(modalBtnId).click();
}