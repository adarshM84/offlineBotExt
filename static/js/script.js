// Set Function

var rebuildRules = undefined;
if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.id) {
    rebuildRules = async function (domain) {
        const domains = [domain];
        /** @type {chrome.declarativeNetRequest.Rule[]} */
        const rules = [{
            id: 1,
            condition: {
                requestDomains: domains
            },
            action: {
                type: 'modifyHeaders',
                requestHeaders: [{
                    header: 'origin',
                    operation: 'set',
                    value: `http://${domain}`,
                }],
            },
        }];
        await chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: rules.map(r => r.id),
            addRules: rules,
        });
    }
}


function setHostAddress() {
    if (rebuildRules) {
        rebuildRules("localhost");
    }
}

const textarea = document.getElementById('userInput');
    
textarea.addEventListener('input', function () {
  this.style.height = 'auto';  // Reset height
  this.style.height = (this.scrollHeight <= 60 ? this.scrollHeight : 60) + 'px'; // Set height based on content or max-height
});

window.onload = () => {
    localStorage.setItem("hostAddress", "localhost");
    if (localStorage.getItem("ollamaPort") == null || localStorage.getItem("ollamaPort").length == 0) localStorage.setItem("ollamaPort", "11434");
    localStorage.setItem("botDesc", null);

    setHostAddress();

    // document.getElementById("userInput").addEventListener("keydown", function (event) {
    //     callByEnter(event, 'getQAnswer');
    // });

    document.getElementById("openSettingIcon").addEventListener("click", function (event) {
        openModal('openSettingModalBtn');
        setModalList();
    });
    
    document.getElementById("setCustomBotRole").addEventListener("click", function (event) {
        setRole(event, true, "coustomInput")
    });
    document.getElementById("send-button").addEventListener("click", function (event) {
        getQAnswer();
    });

    document.getElementById("opneIntroIcon").addEventListener("click", function (event) {
        openModal('openModalBtn')
    });
    document.getElementById("botImage").addEventListener("click", function (event) {
        openModal('openModalBtn')
    });

    var roleList = document.getElementsByClassName("setBotRole");
    for (i = 0; i < roleList.length; i++) {
        roleList[i].addEventListener("click", function (event) {
            setRole(event)
        });
    }

    var settingsList = document.getElementsByClassName("ollamaSettings");
    for (i = 0; i < settingsList.length; i++) {
        settingsList[i].addEventListener("change", function (event) {
            setSettings(event)
        });
    }
}

// Set Function End

function scrollDown(divId) {
    document.getElementById(divId).scrollBy(0, document.getElementById(divId).scrollHeight);
}

function setSettings(event){
    if(event.target.type=="checkbox"){
        localStorage.setItem("useEmoji",event.target.checked);
    }else if(event.target.type=="text"){
        localStorage.setItem("ollamaPort",event.target.value);
        if(event.target.value.trim().length == 0){
            alert("Please enter valid port");
            return;
        }
    }else if(event.target.type=="select-one"){
        if(event.target.value.trim().length == 0){
            alert("Please select modal");
            return;
        }
        localStorage.setItem("ollamaModal",event.target.value)
    }
    setModalList();
}

//Bot response
function getQAnswer(isRoleSet) {
    if (localStorage.getItem("qId") == 'NaN' || !localStorage.getItem("qId")) {
        localStorage.setItem("qId", 1)
    }
    var userQuery = document.getElementById('userInput').value.trim();
    if (userQuery.length == 0) {
        alert("Please enter question");
        return
    }
    const lastDivid = addMessage(userQuery, "", "question");
    var useEmoji="";

    if (isRoleSet) {
        if (localStorage.getItem("botDesc") != "null" && localStorage.getItem("botDesc").length > 0) {
            addMessage("", "Sure ;) .Please ask question.", "answer", lastDivid);
            document.getElementById('userInput').value = '';
            addWelcomeMessage(false);
            return;
        }
    }
    if (localStorage.getItem("useEmoji") != null && localStorage.getItem("useEmoji").length > 0) {
        if(localStorage.getItem("useEmoji") =="true") useEmoji = "Use Emoji In Response ";
    }
    if (localStorage.getItem("botDesc") != "null" && localStorage.getItem("botDesc").length > 0) {
        userQuery = (useEmoji.length >0 ? useEmoji +localStorage.getItem("botDesc") : localStorage.getItem("botDesc") )+ " User Question : " + userQuery;
    }else{
        userQuery = useEmoji.length >0 ? useEmoji +" User Question : " + userQuery : " User Question : " + userQuery;
    }

    console.log(userQuery)

    scrollDown("chat");

    var ollamaModal=localStorage.getItem("ollamaModal") ? localStorage.getItem("ollamaModal") :"llama3";
    const data = {
        model: ollamaModal,
        prompt: userQuery,
        stream: true
    };

    const apiUrl = `http://${localStorage.getItem("hostAddress")}:${localStorage.getItem("ollamaPort")}/api/generate`;
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            // console.log(response, "response");
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.body.getReader();
        }).then(reader => {
            let decoder = new TextDecoder();
            let buffer = ''; // Buffer to store incomplete JSON strings

            // Define recursive function to continuously fetch responses
            function readStream() {
                reader.read().then(({ done, value }) => {
                    if (done) {
                        // Process any remaining buffer at the end of stream
                        if (buffer !== '') {
                            processJSON(buffer);
                        }
                        return;
                    }

                    // Append the new chunk of data to the buffer
                    buffer += decoder.decode(value, { stream: true });

                    // Process complete JSON objects in the buffer
                    processBuffer();
                });
            }

            // Function to process the buffer and extract complete JSON objects
            function processBuffer() {
                let chunks = buffer.split('\n');
                buffer = '';

                // Process each chunk
                for (let i = 0; i < chunks.length - 1; i++) {
                    let chunk = chunks[i];
                    processJSON(chunk);
                }

                // Store the incomplete JSON for the next iteration
                buffer = chunks[chunks.length - 1];
            }

            // Function to parse and process a JSON object
            function processJSON(jsonString) {
                try {
                    let jsonData = JSON.parse(jsonString);
                    jsonData.response = jsonData.response.replace(/"/g, '');
                    console.log(jsonData.response)
                    addMessage("", jsonData.response, "answer", lastDivid);

                    // Check if the response indicates "done: true"
                    if (jsonData.done) {
                        addWelcomeMessage(false);
                    } else {
                        // Continue reading the stream
                        readStream();
                    }
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                }
            }

            // Start reading the stream
            readStream();
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            alert('Error:', error); // Display error if any
        });

    // Clear the input field
    document.getElementById('userInput').value = '';
};

function setRole(event, isCoustom = false, inputId = "") {
    var botRole = "";
    if (isCoustom) {
        botRole = document.getElementById(inputId).value.trim();
        if (botRole.length == 0) {
            alert("Enter valid role");
            return
        }
    } else {
        botRole = event.target.innerText;
    }
    localStorage.setItem("botDesc", botRole);
    document.getElementById('userInput').value = botRole;
    getQAnswer(true);
}