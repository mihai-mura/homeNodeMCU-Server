import { MqttServClient } from '../../server.js';
import { updateMainLightGHOnline } from '../googleHome/googleHome.js';

const MainLightMessageHandler = async (topic, message) => {
	const subtopic = topic.slice(topic.indexOf('/') + 1);
	switch (subtopic) {
		case 'nodeMCU-on':
			console.log('MainLight connected');
			updateMainLightGHOnline(true);
			break;
	}
};

export const MainLightGHHandler = (state) => {
	MqttServClient.publish('main-light/control', 'power');
};

export default MainLightMessageHandler;
