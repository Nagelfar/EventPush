var EventPush;
(function (EventPush) {
    (function (Handlers) {
        function registerChildActionRefresh(bus) {
            var initialMessage = "";

            $('div[data-refresh-action]').each(function (index, elem) {
                var dataRefresh = new DataRefresh(elem);
                var attributes = elem.attributes;

                var matches = $.map(attributes, function (attribute) {
                    return dataRefresh.isMatchingEvent(attribute);
                });
                matches.filter(function (er) {
                    return er != null;
                }).filter(function (er) {
                    return er.validateUrl();
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

        var DataRefresh = (function () {
            function DataRefresh(elem) {
                this.elem = elem;
            }
            DataRefresh.prototype.isMatchingEvent = function (attribute) {
                if (attribute && attribute.name.toLowerCase().indexOf('data-refresh-event-') >= 0) {
                    return new EventRefresh(this.elem, attribute);
                }
                return null;
            };
            return DataRefresh;
        })();

        var EventRefresh = (function () {
            function EventRefresh(elem, attribute) {
                this.elem = elem;
                this.attribute = attribute;
                this.attributes = elem.attributes;
            }
            EventRefresh.prototype.validateUrl = function () {
                var url = this.attributes["data-refresh-action"];

                if (!url)
                    throw "Cannot register a refresh handler for " + this.attribute.name + " with an empty url!";

                this.urlLink = url.value;
                return true;
            };

            EventRefresh.prototype.extractMessage = function () {
                var messageElement = this.attributes["data-refresh-message-" + this.attribute.value.toLowerCase()];

                var message = "Daten werden geladen!";
                if (messageElement && messageElement.value)
                    message = messageElement.value;

                return message;
            };

            EventRefresh.prototype.registerHandler = function (bus) {
                var message = this.extractMessage();

                bus.registerHandler(this.attribute.value, refreshHandler(this.urlLink, this.elem, message));
            };
            return EventRefresh;
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
//# sourceMappingURL=Handlers.js.map
