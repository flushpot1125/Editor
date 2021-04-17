import { IpcMainEvent } from "electron";

import { IIPCHandler } from "../handlers/ipc";
import { GameServer } from "../tools/server";
import { IPCRequests, IPCResponses } from "../../shared/ipc";

export class StartWebServerIPC implements IIPCHandler {
	/**
	 * Defines the name of the channel to listen.
	 */
	public channel: string = IPCRequests.StartGameServer;
	/**
	 * Defines the handler called on the channel receives a message from the renderer process.
	 * @param event defines the reference to the IPC event.
     * @param path defines the path of the web server to serve files.
     * @param port defines the port of the server to listen.
	 */
	public handler(event: IpcMainEvent, path: string, port: number): void {
		GameServer.RunServer(path, port);
		event.sender.send(IPCResponses.StartGameServer);
	}
}

export class StartHttpsWebServerIPC implements IIPCHandler {
	/**
	 * Defines the name of the channel to listen.
	 */
	public channel: string = IPCRequests.StartGameHttpsServer;
	/**
	 * Defines the handler called on the channel receives a message from the renderer process.
	 * @param event defines the reference to the IPC event.
     * @param path defines the path of the web server to serve files.
     * @param port defines the port of the server to listen.
	 */
	public handler(event: IpcMainEvent, path: string, port: number): void {
		GameServer.RunHttpsServer(path, port);
		event.sender.send(IPCResponses.StartGameHttpsServer);
	}
}