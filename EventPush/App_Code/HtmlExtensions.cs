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
        public static IHtmlString EventRefreshAction(this HtmlHelper helper, Type[] eventTypes, string action, string controller = null, object routeValues = null)
        {
            var urlHelper = new UrlHelper(helper.ViewContext.RequestContext);

            var avaliableTypes = helper.ViewContext.GetNotifications()
                //.Where(x => eventTypes.Contains(x.EventType))
                .ToList();

            var url = urlHelper.Action(action, controller, routeValues);
            var content = helper.Action(action, controller, routeValues);

            return ASP.EventRefresh.Action(url, content, avaliableTypes.ToEventNames(),avaliableTypes.ToEventMessages());
        }

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


        public static IHtmlString EventRefreshAction<TEvent>(this HtmlHelper helper, string action, string controller = null, object routeValues = null)
        {
            return helper.EventRefreshAction(new[] { typeof(TEvent) }, action, controller, routeValues);
        }
        public static IHtmlString EventRefreshAction<TEvent1, TEvent2>(this HtmlHelper helper, string action, string controller = null, object routeValues = null)
        {
            return helper.EventRefreshAction(new[] { typeof(TEvent1), typeof(TEvent2) }, action, controller, routeValues);
        }
        public static IHtmlString EventRefreshAction<TEvent1, TEvent2, TEvent3>(this HtmlHelper helper, string action, string controller = null, object routeValues = null)
        {
            return helper.EventRefreshAction(new[] { typeof(TEvent1), typeof(TEvent2), typeof(TEvent3) }, action, controller, routeValues);
        }
        public static IHtmlString EventRefreshAction<TEvent1, TEvent2, TEvent3, TEvent4>(this HtmlHelper helper, string action, string controller = null, object routeValues = null)
        {
            return helper.EventRefreshAction(new[] { typeof(TEvent1), typeof(TEvent2), typeof(TEvent3), typeof(TEvent4) }, action, controller, routeValues);
        }
    }
}