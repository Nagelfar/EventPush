var EventPush;
(function (EventPush) {
    (function (Handlers) {
        function registerChildActionRefresh(bus) {
            $('div[data-refresh-action]').each(function (index, elem) {
                var attributes = elem.attributes;
                for (var i = 0; i < attributes.length; i++) {
                    var item = attributes.item(i);
                    if (item.name.toLowerCase().indexOf('data-refresh-event-') >= 0) {
                        var url = elem.attributes["data-refresh-action"];
                        var messageElement = elem.attributes["data-refresh-message-" + item.name.toLowerCase()];

                        var message = "Daten werden geladen!";
                        if (messageElement && messageElement.value)
                            message = messageElement.value;

                        bus.registerHandler(item.value, refreshHandler(url.value, elem, message));
                    }
                }
            });
        }
        Handlers.registerChildActionRefresh = registerChildActionRefresh;

        function refreshHandler(url, element, message) {
            return function (event) {
                $(element).load(url);
                toastr.info(message);
            };
        }
    })(EventPush.Handlers || (EventPush.Handlers = {}));
    var Handlers = EventPush.Handlers;
})(EventPush || (EventPush = {}));
//# sourceMappingURL=Handlers.js.map
