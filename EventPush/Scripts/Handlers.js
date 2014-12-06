var EventPush;
(function (EventPush) {
    (function (Handlers) {
        function registerChildActionRefresh(bus) {
            $('div[data-refresh-action]').each(function (index, elem) {
                var attributes = elem.attributes;
                for (var i = 0; i < attributes.length; i++) {
                    var attribute = attributes.item(i);
                    if (attribute.name.toLowerCase().indexOf('data-refresh-event-') >= 0) {
                        var url = elem.attributes["data-refresh-action"];

                        if (!url)
                            throw "Cannot register a refresh handler for " + attribute.name + " with an empty url!";

                        var messageElement = elem.attributes["data-refresh-message-" + attribute.value.toLowerCase()];

                        var message = "Daten werden geladen!";
                        if (messageElement && messageElement.value)
                            message = messageElement.value;

                        bus.registerHandler(attribute.value, refreshHandler(url.value, elem, message));
                    }
                }
            });
        }
        Handlers.registerChildActionRefresh = registerChildActionRefresh;

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
