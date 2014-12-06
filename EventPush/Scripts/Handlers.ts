module EventPush.Handlers {

    export function registerChildActionRefresh(bus: Bus) {
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

                    bus.registerHandler(item.value, refreshHandler(url.value, elem,message));
                }
            }
        });
    }


    function refreshHandler(url: string, element: Element,message:string): Handler {
        return (event) => {
            $(element).load(url);
            toastr.info(message);
        };
    }
} 