module EventPush.Handlers {


    export function registerDataGridReload(bus: Bus) {
        $('div.grid[data-refresh-event-*]').each(function (index, elem) {
            var attributes = elem.attributes;
            var matches: RefreshEventMessage[] = $
                .map(attributes, (attribute) => matchEvent(attribute, attributes));

            matches
                .filter((e) => e != null)
                .forEach((e) => registerGridRefreshHandler(elem, e.eventName, bus));


        });
    }

    function registerGridRefreshHandler(elem: Element, eventName: string, bus: Bus) {
        bus.registerHandler(eventName, (_) => {
            var $elem: any = $(elem);
            $elem.grid('refreshbinding');
        });
    }
} 