const mqttname = "0998070";
const mqttpassword = "0998070";

const options = {
    keepalive: 60,
    clientId: 'chatuser' + Math.random().toString(16).substr(2, 8),
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000,
    username: mqttname,
    password: mqttpassword
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
        }
    })
})

client.on('message', function (topic, message) {
    // When a message is received, append it to the chat box
    const chatBox = document.getElementById('chatBox');
    chatBox.innerHTML += `<p>${message.toString()}</p>`;
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to bottom
})

const sendButton = document.getElementById('sendButton');
const messageInput = document.getElementById('messageInput');

sendButton.addEventListener('click', function() {
    const message = messageInput.value;
    messageInput.value = ""; // Clear input field

    // Publish message to topic
    client.publish(topic, message);
});