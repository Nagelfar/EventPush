module EventPush.Handlers {

    export function registerChildActionRefresh(bus: Bus) {
        var initialMessage = "";        

        $('div[data-refresh-action]').each(function (index, elem) {
            var dataRefresh = new ChildActionRefresh(elem);
            var attributes = elem.attributes;
           
            var matches: EventRefreshTrigger[] = $.map(attributes, (attribute) => dataRefresh.isMatchingEvent(attribute));
            matches
                .filter((er) => er != null)
                .filter((er) => er.hasValidUrl())
                .forEach((er) => er.registerHandler(bus));

            if (attributes["data-refresh-message"])
                initialMessage = attributes["data-refresh-message"].value;
        });

        if (initialMessage) {            
            toastr.info(initialMessage);            
        }
    }

    class ChildActionRefresh {
        constructor(private elem: Element) {
        }

        public isMatchingEvent(attribute: Attr): EventRefreshTrigger {
            if (attribute && attribute.name.toLowerCase().indexOf('data-refresh-event-') >= 0) {
                return new EventRefreshTrigger(this.elem, attribute);
            }
            return null;
        }

    }

    class EventRefreshTrigger {
        attributes: NamedNodeMap;
        urlLink: string;
        eventName: string;

        constructor(private elem: Element,  attribute: Attr) {
            this.attributes = elem.attributes;
            this.eventName = attribute.value;
        }
        public hasValidUrl():boolean {
            var url = this.attributes["data-refresh-action"];

            if (!url)
                throw "Cannot register a refresh handler for " + this.eventName + " with an empty url!";

            this.urlLink = url.value;
            return true;
        } 

        private extractMessage(): string {
            var messageElement = this.attributes["data-refresh-message-" + this.eventName.toLowerCase()];

            var message = "Daten werden geladen!";
            if (messageElement && messageElement.value)
                message = messageElement.value;

            return message;
        }

        public registerHandler(bus: Bus) {
            var message = this.extractMessage();

            bus.registerHandler(this.eventName, refreshHandler(this.urlLink, this.elem, message));
        }
    }


    function refreshHandler(url: string, element: Element, message: string): Handler {
        return (event) => {
            $(element).load(url);
            if(message)
                toastr.info(message);
        };
    }
} 