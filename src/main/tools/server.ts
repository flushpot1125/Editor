import { createServer } from "http-server";
import { Server } from "http";

import { Nullable } from "../../shared/types";
import fs from 'fs';
import { join } from "path";

import {app} from "electron";

export class GameServer {
    /**
     * Defines the current absolute path of the web server.
     */
    public static Path: Nullable<string> = null;
    /**
     * Defines the reference to the http server.
     */
    public static Server: Nullable<Server> = null;

    /**
     * Runs the server.
     * @param root the root url where to start the server and serve files.
     * @param port defines the port to listen.
     */
    public static RunServer(root: string, port: number): void {
        if (this.Server) { this.StopServer(); }

        this.Server = createServer({ root, cache: -1 });
        this.Server.listen(port/*, "localhost*/);

        this.Path = root;
    }

    //for trial
    private static url:string ="https://localhost";
        /**
     * Runs the https server.
     * @param root the root url where to start the server and serve files.
     * @param port defines the port to listen.
     */

    public static RunHttpsServer(root: string, port: number): void {

        root = this.url;
        root = "https://localhost";
        if (this.Server) { this.StopServer(); }
        this.Server = createServer( {root:this.url,cache:-1});
        //  const certAbsPath = join(Tools.GetAppPath(), "preview", "cert.pem");
        //  const keyAbsPath = join(Tools.GetAppPath(), "preview", "key.pem");
        //cert.pem and key.pem files are put on topdirectory/html/ directory.
        const certAbsPath = join(app.getAppPath(), "html", "cert.pem");
        const keyAbsPath = join(app.getAppPath(), "html", "key.pem");
        fs.lstatSync(certAbsPath);
        fs.lstatSync(keyAbsPath);
        this.Server.listen(port/*, "localhost*/);


        //this.Path = this.url;
        this.Path = root;

    }

    /**
     * Stops the server
     */
    public static async StopServer(): Promise<void> {
        if (!this.Server) { return; }

        await new Promise<void>((resolve, reject) => {
            this.Server!.close((err) => {
                if (err) { return reject(); }
                resolve();
            })
        });

        this.Path = null;
        this.Server = null;
    }
}