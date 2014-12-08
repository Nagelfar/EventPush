module EventPush.Handlers {

    export function registerChildActionRefresh(bus: Bus) {
        var initialMessage = "";

        $('div[data-refresh-action]').each(function (index, elem) {

            var attributes = elem.attributes;

            var matches: RefreshEventMessage[] = $
                .map(attributes, (attribute) => matchEvent(attribute, attributes));
            matches
                .filter((er) => er != null)
                .map((er) => new ChildActionRefreshTrigger(elem, er))
                .filter((er) => er.hasValidUrl(attributes))
                .forEach((er) => er.registerHandler(bus));

            if (attributes["data-refresh-message"])
                initialMessage = attributes["data-refresh-message"].value;
        });

        if (initialMessage) {
            toastr.info(initialMessage);
        }
    }

   export function matchEvent(currentAttribute: Attr, attributes: NamedNodeMap): RefreshEventMessage {
        if (currentAttribute && currentAttribute.name.toLowerCase().indexOf('data-refresh-event-') >= 0) {
            var eventMessage = RefreshEventMessage.Parse(currentAttribute, attributes);
            return eventMessage;
        }
        return null;
    }

    export class RefreshEventMessage {
        constructor(public attribute: Attr, public eventName: string, public message: string) {
        }

        public static Parse(attribute: Attr, attributes: NamedNodeMap): RefreshEventMessage {
            var eventName = attribute.value;
            var message = RefreshEventMessage.extractMessage(eventName, attributes);
            return new RefreshEventMessage(attribute, eventName, message);
        }

        private static extractMessage(eventName: string, attributes: NamedNodeMap): string {
            var messageElement = attributes["data-refresh-message-" + eventName.toLowerCase()];

            var message = "Daten werden geladen!";
            if (messageElement && messageElement.value)
                message = messageElement.value;

            return message;
        }
    }

    class ChildActionRefreshTrigger {
        urlLink: string;

        constructor(private elem: Element, private eventMessage: RefreshEventMessage) {
        }

        public hasValidUrl(attributes: NamedNodeMap): boolean {
            var url = attributes["data-refresh-action"];

            if (!url) {
                console.log("Cannot register a refresh handler for " + this.eventMessage.eventName + " with an empty url!");
                return false;
            }
            this.urlLink = url.value;
            return true;
        }

        public registerHandler(bus: Bus) {
            var handler = refreshHandler(this.urlLink, this.elem, this.eventMessage.message);

            bus.registerHandler(this.eventMessage.eventName, handler);
        }
    }


    function refreshHandler(url: string, element: Element, message: string): Handler {
        return (event) => {
            $(element).load(url);
            if (message)
                toastr.info(message);
        };
    }
} 