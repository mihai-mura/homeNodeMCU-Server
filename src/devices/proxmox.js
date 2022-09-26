import { MqttServClient } from '../../server.js';
import { updateProxmoxGHOnline, updateProxmoxGHState } from '../googleHome/googleHome.js';
import sendProxmoxMobileNotif from '../services/proxmoxMobileApp.js';

const ProxmoxMessageHandler = async (topic, message) => {
	const subtopic = topic.slice(topic.indexOf('/') + 1);
	switch (subtopic) {
		case 'nodeMCU-on':
			console.log('Proxmox connected');
			updateProxmoxGHOnline(true);
			break;
		case 'event':
			console.log(`Proxmox: ${message}`);
			switch (message) {
				case 'server_on':
					sendProxmoxMobileNotif('Server Online');
					updateProxmoxGHState(true);
					break;
				case 'server_off':
					sendProxmoxMobileNotif('Server Offline');
					updateProxmoxGHState(false);
					break;
				case 'boot_error':
					sendProxmoxMobileNotif('Server Boot Error');
					updateProxmoxGHState(false);
					break;
				default:
					break;
			}
			break;
		case 'expo-token':
			console.log(`Proxmox ExpoToken: ${message}`);
			break;
	}
};

export const ProxmoxGHHandler = (state) => {
	if (state) {
		MqttServClient.publish('proxmox/on', 'power');
	}
};

export default ProxmoxMessageHandler;
