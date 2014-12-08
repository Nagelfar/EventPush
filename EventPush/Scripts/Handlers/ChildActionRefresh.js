var EventPush;
(function (EventPush) {
    (function (Handlers) {
        function registerChildActionRefresh(bus) {
            var initialMessage = "";

            $('div[data-refresh-action]').each(function (index, elem) {
                var dataRefresh = new ChildActionRefresh(elem);
                var attributes = elem.attributes;

                var matches = $.map(attributes, function (attribute) {
                    return dataRefresh.isMatchingEvent(attribute);
                });
                matches.filter(function (er) {
                    return er != null;
                }).filter(function (er) {
                    return er.hasValidUrl();
                }).forEach(function (er) {
                    return er.registerHandler(bus);
                });

                if (attributes["data-refresh-message"])
                    initialMessage = attributes["data-refresh-message"].value;
            });

            if (initialMessage) {
                toastr.info(initialMessage);
            }
        }
        Handlers.registerChildActionRefresh = registerChildActionRefresh;

        var ChildActionRefresh = (function () {
            function ChildActionRefresh(elem) {
                this.elem = elem;
            }
            ChildActionRefresh.prototype.isMatchingEvent = function (attribute) {
                if (attribute && attribute.name.toLowerCase().indexOf('data-refresh-event-') >= 0) {
                    return new EventRefreshTrigger(this.elem, attribute);
                }
                return null;
            };
            return ChildActionRefresh;
        })();

        var EventRefreshTrigger = (function () {
            function EventRefreshTrigger(elem, attribute) {
                this.elem = elem;
                this.attributes = elem.attributes;
                this.eventName = attribute.value;
            }
            EventRefreshTrigger.prototype.hasValidUrl = function () {
                var url = this.attributes["data-refresh-action"];

                if (!url)
                    throw "Cannot register a refresh handler for " + this.eventName + " with an empty url!";

                this.urlLink = url.value;
                return true;
            };

            EventRefreshTrigger.prototype.extractMessage = function () {
                var messageElement = this.attributes["data-refresh-message-" + this.eventName.toLowerCase()];

                var message = "Daten werden geladen!";
                if (messageElement && messageElement.value)
                    message = messageElement.value;

                return message;
            };

            EventRefreshTrigger.prototype.registerHandler = function (bus) {
                var message = this.extractMessage();

                bus.registerHandler(this.eventName, refreshHandler(this.urlLink, this.elem, message));
            };
            return EventRefreshTrigger;
        })();

        function refreshHandler(url, element, message) {
            return function (event) {
                $(element).load(url);
                if (message)
                    toastr.info(message);
            };
        }
    })(EventPush.Handlers || (EventPush.Handlers = {}));
    var Handlers = EventPush.Handlers;
})(EventPush || (EventPush = {}));
//# sourceMappingURL=ChildActionRefresh.js.map
