var mqtt = require('mqtt');
var client;
exports.connect = ()=>{
    client = mqtt.connect('mqtt://35.238.218.12', {port:1883});
    client.on('connect', function () {
        client.subscribe('presence', function (err) {
            if (!err) {
                client.publish('presence', 'Hello mqtt')
            }
        })
    });
};


exports.publishMessage = (topic, message)=>{
  client.publish(topic, message);
};