var EventPush;
(function (EventPush) {
    (function (Handlers) {
        function registerDataGridReload(bus) {
            $('div.grid[data-refresh-event-*]').each(function (index, elem) {
                var attributes = elem.attributes;
                var matches = $.map(attributes, function (attribute) {
                    return Handlers.matchEvent(attribute, attributes);
                });

                matches.filter(function (e) {
                    return e != null;
                }).forEach(function (e) {
                    return registerGridRefreshHandler(elem, e.eventName, bus);
                });
            });
        }
        Handlers.registerDataGridReload = registerDataGridReload;

        function registerGridRefreshHandler(elem, eventName, bus) {
            bus.registerHandler(eventName, function (_) {
                var $elem = $(elem);
                $elem.grid('refreshbinding');
            });
        }
    })(EventPush.Handlers || (EventPush.Handlers = {}));
    var Handlers = EventPush.Handlers;
})(EventPush || (EventPush = {}));
//# sourceMappingURL=ReloadDataGrid.js.map
