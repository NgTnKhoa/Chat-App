import {w3cwebsocket} from "websocket";

const wsUrl: string = 'ws://140.238.54.136:8080/chat/chat';

export let ws: w3cwebsocket | null = null;

export const connectWebSocket = () => {
    ws = new w3cwebsocket(wsUrl);

    ws.onopen = () => {
        console.log('Server Connected');
    };
};

export function sendRequest(request: any) {
    if (ws && ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify(request));
    } else {
        console.log("WebSocket is not open, readyState is: ", ws?.readyState);
    }
}

export const closeWebSocket = () => {
    if (ws) {
        ws.close();
    }
};
