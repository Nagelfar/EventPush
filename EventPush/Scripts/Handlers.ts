module EventPush.Handlers {

    export function registerChildActionRefresh(bus: Bus) {
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


    function refreshHandler(url: string, element: Element, message: string): Handler {
        return (event) => {
            $(element).load(url);
            if(message)
                toastr.info(message);
        };
    }
} 