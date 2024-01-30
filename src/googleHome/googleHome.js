import dotenv from "dotenv";
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { MainLightGHHandler } from "../devices/mainLight.js";
import { ProxmoxGHHandler } from "../devices/proxmox.js";
import ServiceAccount from "./home-d2c4b-firebase-adminsdk-1dq33-07cc2c5425.json" assert { type: "json" };

dotenv.config();

initializeApp({ credential: cert(ServiceAccount) });
const db = getFirestore();

const MainLightDoc = db.collection("users").doc("mihai").collection("devices").doc("1vu4");
const ProxmoxDoc = db.collection("users").doc("mihai").collection("devices").doc("q1x");

//* observers and actions

//proxmox
ProxmoxDoc.onSnapshot(
	docSnapshot => {
		const state = docSnapshot.data()?.states?.on;
		ProxmoxGHHandler(state);
	},
	err => {
		console.log(`Firebase encountered error: ${err}`);
	}
);

export const updateProxmoxGHState = async state => {
	await ProxmoxDoc.update({ "states.on": state });
};

export const updateProxmoxGHOnline = async status => {
	await ProxmoxDoc.update({ "states.online": status });
};

//main-light
MainLightDoc.onSnapshot(
	docSnapshot => {
		const state = docSnapshot.data()?.states?.on;
		const brightness = docSnapshot.data()?.states?.brightness;
		MainLightGHHandler(state, brightness);
	},
	err => {
		console.log(`Firebase encountered error: ${err}`);
	}
);

export const updateMainLightGHState = async state => {
	await MainLightDoc.update({ "states.on": state });
};

export const updateMainLightGHOnline = async online => {
	await MainLightDoc.update({ "states.online": online });
};
