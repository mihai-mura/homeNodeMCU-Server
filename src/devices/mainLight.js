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

let prevStateMainLight = false;
let prevBrightnessMainLight = false; //false <= 50 | true > 50
export const MainLightGHHandler = (state, brightness) => {
	if (state !== prevStateMainLight) {
		console.log(`Firebase MainLight State: ${state}`);
		prevStateMainLight = state;
		MqttServClient.publish('main-light/control', 'power');
	}
	if ((brightness > 50 && !prevBrightnessMainLight) || (brightness <= 50 && prevBrightnessMainLight)) {
		console.log(`Firebase MainLight Brightness: ${brightness > 50 ? 'High' : 'Low'}`);
		prevBrightnessMainLight = !prevBrightnessMainLight;
		if (brightness > 50) {
			for (let i = 0; i < 50; i++) {
				setTimeout(() => {
					MqttServClient.publish('main-light/control', 'brightness-up');
				}, 200);
			}
		} else {
			for (let i = 0; i < 50; i++) {
				setTimeout(() => {
					MqttServClient.publish('main-light/control', 'brightness-down');
				}, 200);
			}
		}
	}
};

export default MainLightMessageHandler;
