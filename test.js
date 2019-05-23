v4 = require("./index.js");
mqtt = require("mqtt");

var preSignedUrl = v4.generate_signv4_mqtt("a3f3ep261pa8dz-ats.iot.ap-northeast-1.amazonaws.com", "ap-northeast-1", "your access key id", "your secret access key");

port = 443
topic = 'testtopic'
i = 0

var client = mqtt.connect(preSignedUrl,
    {
        connectTimeout: 5 * 1000,
        port: port,
    })

client.on('connect', function () {
    client.subscribe(topic, function (err) {
        if (!err) {
            client.publish(topic, 'Hello mqtt')
        }
    })
})

client.on('message', function (topic, message) {
    console.log(message.toString())
    i = i + 1
    client.publish(topic, 'Hello mqtt ' + String(i))
})