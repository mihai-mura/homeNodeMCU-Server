# NodeJS MQTT Server for ESP8266 devices

## MQTT topics

1.  Proxmox (client-id: NodeMCU-Proxmox)

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

2.  Main Light (client-id: NodeMCU-MainLight)

    -sent by nodeMcu

        main-light/nodeMCU-on   true | false

    -sent by server

        main-light/control   power | night-mode | brightness-up | brightness-down | switch-temp | timer | cold | warm
