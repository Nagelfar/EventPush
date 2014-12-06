/// <reference path="typings/toastr/toastr.d.ts" />
var EventPush;
(function (EventPush) {
    var Bus = (function () {
        function Bus(connection) {
            this._handlers = {};
            this._signalRConnection = connection;
        }
        Bus.prototype.connectEventSource = function (hub) {
            var _this = this;
            hub.client.reciveEvent = function (eventName, event) {
                var handlers = _this.findHandlers(eventName);
                handlers.forEach(function (value) {
                    value(event);
                });
            };
        };

        Bus.prototype.connect = function () {
            this.connectEventSource(this._signalRConnection.pushNotificationHub);

            this._signalRConnection.hub.start().done(function () {
                toastr.info('SignalR Connected!');
            }).fail(function () {
                toastr.error('Could not connect SignalR!');
            });
        };

        Bus.prototype.registerHandler = function (eventName, handler) {
            this.findHandlers(eventName).push(handler);
        };

        Bus.prototype.findHandlers = function (eventName) {
            if (!eventName)
                throw "Provide an event-name!";

            var name = eventName.replace(/"/g, "");
            if (!this._handlers[name])
                this._handlers[name] = [];

            return this._handlers[name];
        };
        return Bus;
    })();
    EventPush.Bus = Bus;
})(EventPush || (EventPush = {}));
//# sourceMappingURL=EventBus.js.map
