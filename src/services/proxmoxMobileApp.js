import { Expo } from 'expo-server-sdk';
const expo = new Expo();

const sendProxmoxMobileNotif = async (title) => {
	if (!Expo.isExpoPushToken(process.env.PROXMOX_EXPOAPP_TOKEN)) {
		console.error(`Push token ${process.env.PROXMOX_EXPOAPP_TOKEN} is not a valid Expo push token`);
		return;
	}

	await expo.sendPushNotificationsAsync([
		{
			to: process.env.PROXMOX_EXPOAPP_TOKEN,
			title: title,
			sound: 'default',
		},
	]);
};

export default sendProxmoxMobileNotif;
