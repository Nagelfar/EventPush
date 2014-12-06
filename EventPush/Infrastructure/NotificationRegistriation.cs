using EventPush.Events;
using EventPush.Hubs;
using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace EventPush
{
    public class NotificiationRegistration
    {
        public Type EventType { get; set; }

        public string Message { get; set; }
    }
    public static class NotificationRegistriationExtension
    {
        private const string TempDataKey = "NotificationRegistration";
        public static void AddNotification<T>(this ControllerBase controller, string message = null) where T : class,IEvent
        {
            var registration = controller.TempData[TempDataKey] as IList<NotificiationRegistration> ?? new List<NotificiationRegistration>();

            registration.Add(new NotificiationRegistration
            {
                Message = message,
                EventType = typeof(T)
            });
           
            controller.TempData[TempDataKey] = registration;
        }

        public static IEnumerable<NotificiationRegistration> GetNotifications(this ViewContext viewContext)
        {
            return viewContext.TempData[TempDataKey] as IList<NotificiationRegistration> ?? new List<NotificiationRegistration>();
        }
    }
}