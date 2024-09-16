// Set Function

localStorage.setItem("botDesc", null)
var hostUrl="http://localhost:11434";
localStorage.setItem("hostAddress", hostUrl);

document.getElementById("userInput").addEventListener("keydown", function(event) {
    callByEnter(event, 'getQAnswer');
});

document.getElementById("openSettingIcon").addEventListener("click", function(event) {
    openModal('openSettingModalBtn');
});
document.getElementById("setCustomBotRole").addEventListener("click", function(event) {
    setRole(event,true,"coustomInput")
});
document.getElementById("send-button").addEventListener("click", function(event) {
    getQAnswer();
});

document.getElementById("opneIntroIcon").addEventListener("click", function(event) {
    openModal('openModalBtn')
});

let roleList=document.getElementsByClassName("setBotRole");
for(i=0;i<roleList.length;i++){
    roleList[i].addEventListener("click",function(event){
        setRole(event)
    });
}

// Set Function End

var rebuildRules = undefined;
if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.id) {
    rebuildRules = async function (domain) {
        alert(domain)
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

function scrollDown(divId) {
    document.getElementById(divId).scrollBy(0, document.getElementById(divId).scrollHeight);
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

    if(isRoleSet){
        if (localStorage.getItem("botDesc") != "null" && localStorage.getItem("botDesc").length>0) {
            userQuery=localStorage.getItem("botDesc");
            addMessage("", "Sure ;) .Please ask question.", "answer", lastDivid);
            document.getElementById('userInput').value = '';
            return;
        }
    }

    if (localStorage.getItem("botDesc") != "null" && localStorage.getItem("botDesc").length>0) {
        userQuery=localStorage.getItem("botDesc")+" User Response : "+userQuery;
    }

    const data = {
        model: 'llama3',
        prompt: userQuery,
        stream: true
    };
    
    const apiUrl = hostUrl+"/api/generate";
    console.log(apiUrl)
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => {
            const reader = response.body.getReader();

            return new ReadableStream({
                start(controller) {
                    function readStream() {
                        reader.read().then(({ done, value }) => {
                            if (done) {
                                controller.close();
                                return;
                            }
                            const chunkText = new TextDecoder().decode(value);
                            addMessage("", chunkText, "answer", lastDivid);

                            controller.enqueue(value);
                            readStream();
                        }).catch(error => {
                            console.error('Error reading data:', error);
                            controller.error(error);
                        });
                    }
                    readStream();
                }
            });
        })
        .then(stream => new Response(stream))
        .then(response => response.text())
        .then(data => {
            // addMessage("",data,"answer");
            addWelcomeMessage(false);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    // Clear the input field
    document.getElementById('userInput').value = '';
};

function setRole(event,isCoustom=false,inputId="") {
    var botRole="";
    if(isCoustom){
        botRole=document.getElementById(inputId).value.trim();
        if(botRole.length==0){
            alert("Enter valid role");
            return
        }
    }else{
        botRole=event.target.innerText;
    }
    localStorage.setItem("botDesc", botRole);
    document.getElementById('userInput').value = botRole;
    getQAnswer(true);
}