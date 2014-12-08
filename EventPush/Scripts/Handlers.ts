module EventPush.Handlers {

    export function registerChildActionRefresh(bus: Bus) {
        var initialMessage = "";        

        $('div[data-refresh-action]').each(function (index, elem) {
            var dataRefresh = new DataRefresh(elem);
            var attributes = elem.attributes;
           
            var matches: EventRefresh[] = $.map(attributes, (attribute) => dataRefresh.isMatchingEvent(attribute));
            matches
                .filter((er) => er != null)
                .filter((er) => er.validateUrl())
                .forEach((er) => er.registerHandler(bus));

            if (attributes["data-refresh-message"])
                initialMessage = attributes["data-refresh-message"].value;
        });

        if (initialMessage) {            
            toastr.info(initialMessage);            
        }
    }

    class DataRefresh {
        constructor(private elem: Element) {
        }

        public isMatchingEvent(attribute: Attr): EventRefresh {
            if (attribute && attribute.name.toLowerCase().indexOf('data-refresh-event-') >= 0) {
                return new EventRefresh(this.elem, attribute);
            }
            return null;
        }

    }

    class EventRefresh {
        attributes: NamedNodeMap;
        urlLink: string;

        constructor(private elem: Element, private attribute: Attr) {
            this.attributes = elem.attributes;
        }
        public validateUrl():boolean {
            var url = this.attributes["data-refresh-action"];

            if (!url)
                throw "Cannot register a refresh handler for " + this.attribute.name + " with an empty url!";

            this.urlLink = url.value;
            return true;
        } 

        private extractMessage(): string {
            var messageElement = this.attributes["data-refresh-message-" + this.attribute.value.toLowerCase()];

            var message = "Daten werden geladen!";
            if (messageElement && messageElement.value)
                message = messageElement.value;

            return message;
        }

        public registerHandler(bus: Bus) {
            var message = this.extractMessage();

            bus.registerHandler(this.attribute.value, refreshHandler(this.urlLink, this.elem, message));
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