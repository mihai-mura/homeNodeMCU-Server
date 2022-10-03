import dotenv from 'dotenv';
import Aedes from 'aedes';
import { createServer } from 'aedes-server-factory';
import mqtt from 'mqtt';
import ProxmoxMessageHandler from './src/devices/proxmox.js';
import MainLightMessageHandler from './src/devices/mainLight.js';
import { updateMainLightGHOnline, updateProxmoxGHOnline } from './src/googleHome/googleHome.js';

dotenv.config();

//mqtt aedes server
const aedes = new Aedes();

aedes.authenticate = (client, username, password, callback) => {
	if (password) {
		password = Buffer.from(password, 'base64').toString();
		if (username === process.env.MQTT_USERNAME && password === process.env.MQTT_PASSWORD) {
			return callback(null, true);
		}
		const error = new Error('Authentication Failed!! Invalid user credentials.');
		console.log('Error ! Authentication failed.');
		return callback(error, false);
	} else {
		const error = new Error('No password provided!');
		return callback(error, false);
	}
};
const MQTTserver = createServer(aedes);
const MQTTWSserver = createServer(aedes, { ws: true });

MQTTserver.listen(process.env.MQTT_PORT, () => {
	console.log(`Aedes MQTT server listening on port ${process.env.MQTT_PORT}`);
});

MQTTWSserver.listen(process.env.MQTT_WS_PORT, () => {
	console.log(`Aedes MQTT WS server listening on port ${process.env.MQTT_WS_PORT}`);
});

//mqtt client
export const MqttServClient = mqtt.connect(`mqtt://localhost:${process.env.MQTT_PORT}`, {
	username: process.env.MQTT_USERNAME,
	password: process.env.MQTT_PASSWORD,
});

MqttServClient.on('connect', () => {
	MqttServClient.subscribe('proxmox/#');
	MqttServClient.subscribe('main-light/#');
});

MqttServClient.on('message', (topic, payload) => {
	if (topic.includes('proxmox')) {
		ProxmoxMessageHandler(topic, payload.toString());
	} else if (topic.includes('main-light')) {
		MainLightMessageHandler(topic, payload.toString());
	}
});

aedes.on('clientDisconnect', (client) => {
	switch (client.id) {
		case 'NodeMCU-Proxmox':
			console.log('Proxmox disconnected');
			updateProxmoxGHOnline(false);
			break;
		case 'NodeMCU-MainLight':
			console.log('MainLight disconnected');
			updateMainLightGHOnline(false);
			break;
	}
});

//* MQTT topics
/*
1. Proxmox (client-id: NodeMCU-Proxmox)
    -sent by nodeMcu
        proxmox/nodeMCU-on   true | false  
        proxmox/state {
            ping: ----,
            rssi: ----,
            proxmoxState: online | offline | waiting | error
        }
        proxmox/event  server_on | server_off | boot_error
    -sent by server
        proxmox/on
    -extra
        proxmox/expo-token
2. Main Light (client-id: NodeMCU-MainLight)
    -sent by nodeMcu
        main-light/nodeMCU-on   true | false
    -sent by server
        main-light/control   power | night-mode | brightness-up | brightness-down | switch-temp | timer | cold | warm

*/
