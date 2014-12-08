var EventPush;
(function (EventPush) {
    (function (Handlers) {
        function registerChildActionRefresh(bus) {
            var initialMessage = "";

            $('div[data-refresh-action]').each(function (index, elem) {
                var attributes = elem.attributes;

                var matches = $.map(attributes, function (attribute) {
                    return matchEvent(attribute, attributes);
                });
                matches.filter(function (er) {
                    return er != null;
                }).map(function (er) {
                    return new ChildActionRefreshTrigger(elem, er);
                }).filter(function (er) {
                    return er.hasValidUrl(attributes);
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

        function matchEvent(currentAttribute, attributes) {
            if (currentAttribute && currentAttribute.name.toLowerCase().indexOf('data-refresh-event-') >= 0) {
                var eventMessage = RefreshEventMessage.Parse(currentAttribute, attributes);
                return eventMessage;
            }
            return null;
        }
        Handlers.matchEvent = matchEvent;

        var RefreshEventMessage = (function () {
            function RefreshEventMessage(attribute, eventName, message) {
                this.attribute = attribute;
                this.eventName = eventName;
                this.message = message;
            }
            RefreshEventMessage.Parse = function (attribute, attributes) {
                var eventName = attribute.value;
                var message = RefreshEventMessage.extractMessage(eventName, attributes);
                return new RefreshEventMessage(attribute, eventName, message);
            };

            RefreshEventMessage.extractMessage = function (eventName, attributes) {
                var messageElement = attributes["data-refresh-message-" + eventName.toLowerCase()];

                var message = "Daten werden geladen!";
                if (messageElement && messageElement.value)
                    message = messageElement.value;

                return message;
            };
            return RefreshEventMessage;
        })();
        Handlers.RefreshEventMessage = RefreshEventMessage;

        var ChildActionRefreshTrigger = (function () {
            function ChildActionRefreshTrigger(elem, eventMessage) {
                this.elem = elem;
                this.eventMessage = eventMessage;
            }
            ChildActionRefreshTrigger.prototype.hasValidUrl = function (attributes) {
                var url = attributes["data-refresh-action"];

                if (!url) {
                    console.log("Cannot register a refresh handler for " + this.eventMessage.eventName + " with an empty url!");
                    return false;
                }
                this.urlLink = url.value;
                return true;
            };

            ChildActionRefreshTrigger.prototype.registerHandler = function (bus) {
                var handler = refreshHandler(this.urlLink, this.elem, this.eventMessage.message);

                bus.registerHandler(this.eventMessage.eventName, handler);
            };
            return ChildActionRefreshTrigger;
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
