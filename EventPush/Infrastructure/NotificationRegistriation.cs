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
     
        public static NotificationRegistrationBuilder RegisterNotifications(this ControllerBase controller)
        {
            if (!controller.TempData.ContainsKey(TempDataKey))
                controller.TempData[TempDataKey] = new NotificationRegistrationBuilder();

            return controller.TempData[TempDataKey] as NotificationRegistrationBuilder;
        }

      
        public static Notifications GetNotifications(this ViewContext viewContext)
        {
            if (viewContext.TempData.ContainsKey(TempDataKey))
            {
                var notification = viewContext.TempData[TempDataKey] as NotificationRegistrationBuilder;
                if (notification != null)
                    return notification.Build();
            }
            return Notifications.Empty;
        }
    }
    public class NotificationRegistrationBuilder
    {
        private readonly List<NotificiationRegistration> _registrations = new List<NotificiationRegistration>();
        private string _initialMessage = "Die Daten werden in wenigen Augenblicken geladen";

        public NotificationRegistrationBuilder WithInitialMessage(string message)
        {
            _initialMessage = message;

            return this;
        }

        public NotificationRegistrationBuilder ForEvent<T>(string message = null) where T : class,IEvent
        {
            _registrations.Add(new NotificiationRegistration
            {
                Message = message,
                EventType = typeof(T)
            });

            return this;
        }

        internal Notifications Build()
        {
            return new Notifications(_initialMessage, _registrations);
        }
    }

    public class Notifications
    {
        public string InitialMessage { get; private set; }
        public IEnumerable<NotificiationRegistration> Registrations { get; private set; }

        public Notifications(string _initialMessage, IEnumerable<NotificiationRegistration> _registrations)
        {
            this.InitialMessage = _initialMessage;
            this.Registrations = _registrations;
        }


        public static Notifications Empty
        {
            get
            {
                return new Notifications("", Enumerable.Empty<NotificiationRegistration>());
            }
        }
    }
}