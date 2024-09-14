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
    
    const apiUrl = `https://adarshmishra84-mistralapi${Math.floor(Math.random() * (5 - 2 + 1)) + 2}.hf.space/ask?question="${userQuery}"`;
    fetch(apiUrl)
        .then(response => {
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
        botRole=event.getElementsByClassName("botRole")[0].innerText;
    }
    localStorage.setItem("botDesc", botRole);
    document.getElementById('userInput').value = botRole;
    getQAnswer(true);
}