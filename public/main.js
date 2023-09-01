const currentUser = "<%= user %>";

function appendChat(chat) {
    const chatNode = document.getElementById("chat");

    const newChat = document.createElement("div");
    const chatName = document.createElement("p");
    chatName.innerText = chat.user;
    chatName.setAttribute("class", "name");
    const chatMessage = document.createElement("p");
    chatMessage.innerText = chat.message;
    const chatTime = document.createElement("span");
    chatTime.innerText = chat.time;

    newChat.setAttribute("class", chat.user === currentUser ? "container" : "container darker");
    chatTime.setAttribute("class", chat.user === currentUser ? "time-right" : "time-left");

    [chatName, chatMessage, chatTime].forEach(node => newChat.appendChild(node));
    chatNode.appendChild(newChat);
}

function sendChat() {
    event.preventDefault();

    const chatForm = document.getElementById("chat-form");
    const chatMessage = chatForm.elements.message.value;

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'chat');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
        if (xhr.status === 201) {
            chatForm.elements.message.value = "";
        }
    };
    xhr.send(JSON.stringify({
        user: currentUser,
        message: chatMessage
    }));
}

function downloadChatHistory() {
    const chatNode = document.getElementById("chat");
    const chatMessages = chatNode.querySelectorAll(".container");
    let chatHistory = "";

    chatMessages.forEach(message => {
        const user = message.querySelector(".name").innerText;
        const messageText = message.querySelector("p:nth-child(2)").innerText;
        const time = message.querySelector("span").innerText;

        chatHistory += `[${time}] ${user}: ${messageText}\n`;
    });

    const blob = new Blob([chatHistory], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "chat-history.txt";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
}

const source = new EventSource("/stream");
source.addEventListener('chat', function (event) {
    const chat = JSON.parse(event.data);
    appendChat(chat);
}, false);

document.getElementById("end-chat").addEventListener("click", downloadChatHistory);
