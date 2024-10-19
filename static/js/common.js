var i = 0;
var botMessage = "";
var speed = 10;

function typeWriter() {
    document.getElementById("botResponse" + parseInt(localStorage.getItem("qId"))).textContent = botMessage;
    scrollDown("chat");
}

function convertBackticksToCodeBlock(text) {
    return text
        .replace(/```sql([\s\S]*?)```/g, '<code class="align-middle">$1</code>'); // Handles multiline code blocks
}

function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function addMessage(userQ, botAn, msgType, ansDivNo = parseInt(localStorage.getItem("qId"))) {
    if (msgType == "question") {
        localStorage.setItem("qId", parseInt(localStorage.getItem("qId")) + 1)
        var chatRow = document.createElement("div");
        chatRow.className = "chatRow my-3";
        chatRow.id = "chatRow" + parseInt(localStorage.getItem("qId"));
        chatRow.setAttribute("style", "white-space: pre-line;");

        var userQDiv = document.createElement("div");
        userQDiv.className = "userQuery d-flex justify-content-start";
        userQDiv.textContent = userQ;//Set Question

        var botAnDiv = document.createElement("div");
        botAnDiv.className = "botResponse d-flex justify-content-start";
        botAnDiv.id = "botResponseDiv" + parseInt(localStorage.getItem("qId"));

        var botAnEl = document.createElement("p");
        botAnEl.id = "botResponse" + parseInt(localStorage.getItem("qId"));
        botAnEl.setAttribute("style", "width:100% !important;")
        // botAnEl.innerHTML = '<span class="mt-1 coustomSpinner">Loading</span> <span class="spinner-grow spinner-grow-sm mt-2" role="status" aria-hidden="true"></span><span class="spinner-grow spinner-grow-sm mt-2" role="status" aria-hidden="true"></span><span class="spinner-grow spinner-grow-sm mt-2" role="status" aria-hidden="true"></span>';
        botAnEl.innerHTML = '<p class="card-text placeholder-glow coustomSpinner"> <span class="placeholder col-7"></span> <span class="placeholder col-4"></span> <span class="placeholder col-4"></span> <span class="placeholder col-6"></span> <span class="placeholder col-8"></span> </p> </div> ';
        botAnDiv.appendChild(botAnEl);

        var divSvgList = document.createElement("div");
        divSvgList.className = "responseSvg"
        divSvgList.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-clipboard2-fill reactSvg copyResponse" viewBox="0 0 16 16"  id="copy' + parseInt(localStorage.getItem("qId")) + '"><path id="' + parseInt(localStorage.getItem("qId")) + '" d="M9.5 0a.5.5 0 0 1 .5.5.5.5 0 0 0 .5.5.5.5 0 0 1 .5.5V2a.5.5 0 0 1-.5.5h-5A.5.5 0 0 1 5 2v-.5a.5.5 0 0 1 .5-.5.5.5 0 0 0 .5-.5.5.5 0 0 1 .5-.5z"/><path id="' + parseInt(localStorage.getItem("qId")) + '" d="M3.5 1h.585A1.5 1.5 0 0 0 4 1.5V2a1.5 1.5 0 0 0 1.5 1.5h5A1.5 1.5 0 0 0 12 2v-.5q-.001-.264-.085-.5h.585A1.5 1.5 0 0 1 14 2.5v12a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-12A1.5 1.5 0 0 1 3.5 1"/><title>Copy Response</title>    </svg>                                                                                  <svg id="copied' + parseInt(localStorage.getItem("qId")) + '" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-clipboard-check-fill reactSvg" viewBox="0 0 16 16" style="display:none"><path d="M6.5 0A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0zm3 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5z"/><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1A2.5 2.5 0 0 1 9.5 5h-3A2.5 2.5 0 0 1 4 2.5zm6.854 7.354-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708.708"/><title>Copied</title></svg> '

        chatRow.appendChild(userQDiv);
        chatRow.appendChild(botAnDiv);
        chatRow.appendChild(divSvgList);
        divSvgList.addEventListener("click", function (event) { copyResponse(event.target.id) })


        document.getElementById("chat").appendChild(chatRow);
        return parseInt(localStorage.getItem("qId"));
    } else if (msgType == "answer") {
        // document.getElementById("botResponse" + ansDivNo).innerHTML = "";
        if (document.getElementById("botResponse" + ansDivNo).innerHTML.search("coustomSpinner") != -1) {
            document.getElementById("botResponse" + ansDivNo).innerHTML = "";
            botMessage = "";
        }
        botMessage += botAn;
        document.getElementById("botResponse" + ansDivNo).setAttribute("style", "white-space: pre-line;");
        typeWriter("chat");
    }
    scrollDown("chat");
}

function copyResponse(divId, copied = false) {
    if (divId.includes("copy")) divId = divId.substr(0, 4);//To handle copy id of svg

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


function showElement(elementId,flag) {
    document.getElementById(elementId).hidden = !flag;
    // if (flag) {
    //     document.getElementById(elementId).hidden = false
    // } else document.getElementById(elementId).hidden = true
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

function openModal(modalBtnId) {
    document.getElementById(modalBtnId).click();
}

function setMessage(elemId, msg, isError) {
    document.getElementById(elemId).innerHTML = msg;
    var messageCss = isError ? "color:red;" : "color:green;";
    document.getElementById(elemId).setAttribute("style", messageCss);
}


function loadModalTableData(modalInfo) {
    // modalInfo = modalInfo.filter(tmpInfo => tmpInfo.downloaded);
    modalInfo.sort((a, b) => { return b.downloaded - a.downloaded; });
    var tableInstance = document.getElementById("modalTableBody");
    tableInstance.innerHTML = "";

    for (i = 0; i < modalInfo.length; i++) {
        var tmpTr = document.createElement("tr");

        var tmpThSr = document.createElement("td");
        tmpThSr.innerHTML = (i + 1);
        tmpThSr.classList.add("backgroundLightWhite");
        tmpThSr.scope = "row";

        var tmpThName = document.createElement("td");
        tmpThName.innerHTML = modalInfo[i].name;
        tmpThName.classList.add("backgroundLightWhite");

        var tmpThSize = document.createElement("td");
        tmpThSize.innerHTML = modalInfo[i].size;
        tmpThSize.classList.add("backgroundLightWhite");

        var tmpThAction = document.createElement("td");
        tmpThAction.classList.add("backgroundLightWhite");

        const downloadButton = document.createElement('button');
        downloadButton.type = 'button';
        downloadButton.hidden = modalInfo[i].downloaded;
        downloadButton.classList.add("customBtn", "customBtn-primary","mx-1", "button--neumorphic");

        downloadButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-cloud-arrow-down-fill" viewBox="0 0 16 16">
  <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2m2.354 6.854-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 9.293V5.5a.5.5 0 0 1 1 0v3.793l1.146-1.147a.5.5 0 0 1 .708.708"/>
</svg>`;
//         const infoButton = document.createElement('button');
//         infoButton.type = 'button';
//         infoButton.classList.add('btn', 'btn-sm', 'mx-1', 'btn-outline-warning');
//         infoButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-info-circle-fill" viewBox="0 0 16 16">
//   <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2"/>
// </svg>`

        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.hidden = !modalInfo[i].downloaded;
        deleteButton.classList.add("customBtn", "customBtn-danger","mx-1", "button--neumorphic");
        deleteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash2-fill" viewBox="0 0 16 16">
  <path d="M2.037 3.225A.7.7 0 0 1 2 3c0-1.105 2.686-2 6-2s6 .895 6 2a.7.7 0 0 1-.037.225l-1.684 10.104A2 2 0 0 1 10.305 15H5.694a2 2 0 0 1-1.973-1.671zm9.89-.69C10.966 2.214 9.578 2 8 2c-1.58 0-2.968.215-3.926.534-.477.16-.795.327-.975.466.18.14.498.307.975.466C5.032 3.786 6.42 4 8 4s2.967-.215 3.926-.534c.477-.16.795-.327.975-.466-.18-.14-.498-.307-.975-.466z"/>
</svg>`

        // tmpThAction.appendChild(infoButton);
        tmpThAction.appendChild(downloadButton);
        tmpThAction.appendChild(deleteButton);

        var tmpThDownload = document.createElement("td");
        tmpThDownload.classList.add("backgroundLightWhite");
        var tmpSpan = document.createElement("span")
        tmpSpan.classList.add("badge","text-black");
        tmpSpan.classList.add(modalInfo[i].downloaded ? ("customBtn-primary") : ("customBtn-danger"));
        tmpSpan.innerHTML = modalInfo[i].downloaded ? "DOWNLOADED" : "PENDING";
        tmpThDownload.appendChild(tmpSpan);

        tmpTr.appendChild(tmpThSr);
        tmpTr.appendChild(tmpThName);
        tmpTr.appendChild(tmpThSize);
        tmpTr.appendChild(tmpThAction);
        tmpTr.appendChild(tmpThDownload);

        tableInstance.appendChild(tmpTr);
    }

}

function setDownloadModalList(presentModal) {
    for (i = 0; i < presentModal.length; i++) {
        for (j = 0; j < downloadModalList.length; j++) {
            if (downloadModalList[j].name == presentModal[i].name) {
                downloadModalList[j].downloaded = true;
            }
        }
    }
    loadModalTableData(downloadModalList);
}

function setModalSettingsList() {
    if (!localStorage.getItem("ollamaPort") || localStorage.getItem("ollamaPort") == "null" || localStorage.getItem("ollamaPort").length == 0) {
        localStorage.setItem("ollamaPort", "11434");
    }

    var hostAddress = localStorage.getItem("hostAddress");
    var ollamaPort = localStorage.getItem("ollamaPort");
    var useEmoji = localStorage.getItem("useEmoji") == "true" ? true : false;

    document.getElementById("useEmogi").checked = useEmoji;
    document.getElementById("ollamaPort").value = ollamaPort;
    // localStorage.setItem("ollamaPort", "123")

    const apiUrl = `http://${hostAddress}:${ollamaPort}/api/tags`;

    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((response) => response.json())
        .then((data) => {
            var modelsList = data.models;
            var modelSelect = document.getElementById("modalList");
            modelSelect.innerHTML="";
            modelSelect.innerHTML = "<option disabled selected>Select Modal</option>";
            for (i = 0; i < modelsList.length; i++) {
                // console.log(modelsList[i])
                var tmpOption = document.createElement("option");
                tmpOption.value = modelsList[i].name;
                tmpOption.innerHTML = modelsList[i].name + " " + modelsList[i].details.parameter_size;

                var selectedModal = localStorage.getItem("ollamaModal");
                if (!selectedModal || selectedModal == "null" || selectedModal.length == 0) {
                    tmpOption.selected = true;
                }
                if (selectedModal == modelsList[i].name) {
                    tmpOption.selected = true;
                }

                modelSelect.appendChild(tmpOption)
            }
            setMessage("settingsMessage", "<img class='customIcon' src='static/images/verify.gif' />Modal loaded successfully", 0);
            setMessage("downloadMessage", "<img class='customIcon' src='static/images/verify.gif' />Modal loaded successfully", 0);
            // console.log(data.models)
            if (data.models.length > 0) setDownloadModalList(data.models);
            localStorage.setItem("ModalWorking", 1);
            showElement("modalErrorDiv",false);
            showElement("chatContainer",true);
        })
        .catch((error => {
            var modelSelect = document.getElementById("modalList");
            modelSelect.innerHTML="";
            setMessage("settingsMessage", "<img class='customIcon' src='static/images/cross.gif' />Unable to connect to ollama.Please check server running or not through below url.<br><a target='_blank' href='http://localhost:11434/api/tags'>http://localhost:11434/api/tags<a><br><span class='text-success'> To install or make of ollama server click <a href='https://github.com/ollama/ollama/tree/main#user-content-ollama'>here</a></span>", 1);
            setMessage("downloadMessage", "<img class='customIcon' src='static/images/cross.gif' />Not able to connect with modal.Please check in Modal Settings Section", 1);
            localStorage.setItem("ModalWorking", 0);
            showElement("modalErrorDiv",true);
            showElement("chatContainer",false);
            console.error('There was a problem with the fetch operation:', error);
        }));

}
