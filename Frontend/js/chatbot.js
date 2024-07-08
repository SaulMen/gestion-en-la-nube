

//Funcion para enviar mensajes al chatbot
document.addEventListener("DOMContentLoaded", function () {
    const messageInput = document.getElementById("message-input");
    const sendButton = document.getElementById("send-button");
    const messagesContainer = document.getElementById("messages-container");

    sendButton.addEventListener("click", function () {
        const messageText = messageInput.value.trim();
        if (messageText !== "") {
            sendMessage(messageText);
            //Consulta API Chatbot
            fetch('http://18.118.153.195:3000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: messageText
                })
            })
                .then(response => {
                    if (response.ok) {
                        return response.json(); // Parsea la respuesta como JSON
                    } else {
                        throw new Error('Error al obtener descripcion de imagen');
                    }
                })
                .then(data => {
                    const respusta1 = data.res1; // Accede la primera respuesta "data"
                    const respusta2 = data.res2; // Accede a la segunda respuesta "data"
                    console.log('===========================')
                    console.log('Respuesta 1: ', respusta1);
                    console.log('Respuesta 2: ', respusta2);
                    
                    if (respusta1 == null) {
                        console.log('===========================')
                        console.log('Respuesta 1: ', data[0].res1);
                        console.log('Respuesta 2: ', data[1].res2);
                        reciveMessege(data[0].res1);
                        reciveMessege(data[1].res2);
                    }else{
                        reciveMessege(respusta1);
                    }

                })
                .catch(error => {
                    console.error('Error:', error);
                });

            messageInput.value = "";
        }
    });

    function sendMessage(messageText) {
        const messageElement = document.createElement("div");
        messageElement.textContent = messageText;
        messageElement.classList.add("message", "sent");
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function reciveMessege(messageText) {
        const messageElement = document.createElement("div");
        messageElement.textContent = messageText;
        messageElement.classList.add("message", "received");
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
});
