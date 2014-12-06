using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Mvc.Html;

namespace EventPush
{
    public static class HtmlExtensions
    {

        private static IEnumerable<string> ToEventNames(this IEnumerable<NotificiationRegistration> eventTypes)
        {
            var eventData = eventTypes
                .Select(x => x.EventType.Name)
                .Select(x => string.Format(@"data-refresh-event-{0}=""{0}""", x))
                ;

            return eventData;
        }
        private static IEnumerable<string> ToEventMessages(this IEnumerable<NotificiationRegistration> eventTypes)
        {
            var eventMessage = eventTypes
                .Where(x => !string.IsNullOrEmpty(x.Message))
                .Select(x => string.Format(@"data-refresh-message-{0}=""{1}""", x.EventType.Name, x.Message))
                ;

            return eventMessage;
        }

        public static EventRefreshActionBuilder EventRefreshAction(this HtmlHelper helper, string action, string controller = null, object routeValues = null)
        {
            var urlHelper = new UrlHelper(helper.ViewContext.RequestContext);

            var url = urlHelper.Action(action, controller, routeValues);
            var content = helper.Action(action, controller, routeValues);

            return new EventRefreshActionBuilder(url, content, helper.ViewContext.GetNotifications());
        }

        public class EventRefreshActionBuilder : IHtmlString
        {
            private readonly string _url;
            private readonly IHtmlString _content;
            private readonly List<Type> _eventTypes;
            private readonly IEnumerable<NotificiationRegistration> _notifications;

            public EventRefreshActionBuilder(string url, IHtmlString content, IEnumerable<NotificiationRegistration> notifications)
            {
                _url = url;
                _content = content;
                _notifications = notifications;
                _eventTypes = new List<Type>();
            }

            public EventRefreshActionBuilder WithEvent<TEvent>()
            {
                return WithEvent(typeof(TEvent));
            }
            public EventRefreshActionBuilder WithEvent(Type eventType)
            {
                _eventTypes.Add(eventType);

                return this;
            }
            public EventRefreshActionBuilder WithEvents(params Type[] eventTypes)
            {
                _eventTypes.AddRange(eventTypes);

                return this;
            }

            public string ToHtmlString()
            {
                var avaliableTypes = _notifications
                    //.Where(x => eventTypes.Contains(x.EventType))
                     .ToList();


                return ASP.EventRefresh
                    .Action(_url, _content, avaliableTypes.ToEventNames(), avaliableTypes.ToEventMessages())
                    .ToHtmlString();
            }
        }
    }
}