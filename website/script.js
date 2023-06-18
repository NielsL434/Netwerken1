const mqttname = "0998070";
const mqttpassword = "0998070";

const cliendID = Math.random().toString(16).substr(2, 8);

const options = {
    keepalive: 60,
    clientId: 'chatuser' + cliendID,
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000
    //username: mqttname,
    //password: mqttpassword
};

// Connect to the broker
var client  = mqtt.connect('ws://127.0.0.1:8383', options);

// Topic to publish to
const topic = "mqtt_chat";

client.on('connect', function () {
    console.log('Connected to broker.');
    client.subscribe(topic, function (err) {
        if (!err) {
            console.log('Subscribed to topic.');
        } else {
            console.log('Failed to subscribe to topic.' , err);
        }
    })
})

let lastSentMessage = null;

client.on('message', function (topic, message) {
    // When a message is received, append it to the chat box
    const chatBox = document.getElementById('chatBox');
    const messageElement = document.createElement('p');
    messageElement.innerText = message.toString();

    // Ignore if it is the last sent message
    if (message.toString() === lastSentMessage) {
        lastSentMessage = null;
        return;
    }
    
    // Set class as 'incoming' for incoming messages
    messageElement.className = 'incoming';

    chatBox.append(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to bottom
})

const sendButton = document.getElementById('sendButton');
const messageInput = document.getElementById('messageInput');

sendButton.addEventListener('click', function() {
    const message = cliendID + ': ' + messageInput.value;
    lastSentMessage = message;
    messageInput.value = ""; // Clear input field

    // Append outgoing message to the chatbox
    const chatBox = document.getElementById('chatBox');
    const messageElement = document.createElement('p');
    messageElement.innerText = message;
    messageElement.className = 'outgoing';
    chatBox.append(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;

    // Publish message to topic
    client.publish(topic, message);
});