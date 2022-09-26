import { MqttServClient } from '../../server.js';

const NodeOn = false;

const MainLightState = {
	on: false,
};

const MainLightMessageHandler = async (topic, message) => {
	const subtopic = topic.slice(topic.indexOf('/') + 1);
	console.log(subtopic, message);
};

export const MainLightGHHandler = (state) => {};

export default MainLightMessageHandler;
