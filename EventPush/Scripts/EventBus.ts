/// <reference path="typings/toastr/toastr.d.ts" />

module EventPush {

    export interface Handler {
        (any): void;
    }

    export class Bus {

        private _handlers: { [key: string]: Handler[]; }= {};

        constructor(private signalRConnection: SignalR) {
        }

        private connectEventSource(hub) {
            hub.client.reciveEvent =  (eventName:string, event) =>{
                var handlers = this.findHandlers(eventName);
                handlers.forEach(function (value) {
                    value(event);
                });
            };
        }

        public connect() {

            this.connectEventSource((<any>this.signalRConnection).pushNotificationHub);

            this.signalRConnection.hub
                .start()
                .done(function () {
                    toastr.info('SignalR Connected!');
                })
                .fail(function () {
                    toastr.error('Could not connect SignalR!');
                });
        }


        public registerHandler(eventName: string, handler: Handler)
        {           
            this.findHandlers(eventName).push(handler);
        }

        private findHandlers(eventName: string): Handler[]{
            if (!eventName)
                throw "Provide an event-name!";

            var name = eventName.replace(/"/g, "");
            if (!this._handlers[name])
                this._handlers[name] = [];

            return this._handlers[name];
        }
    }
}