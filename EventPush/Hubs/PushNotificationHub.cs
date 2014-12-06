using EventPush.Events;
using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EventPush.Hubs
{
    public class PushNotificationHub : Hub
    {
        //public void PushEvent<T>(T @event) where T : class
        //{
        //    this.Clients.All.reciveEvent(typeof(T).Name, @event);
        //}
        public static void PushEvent<T>(T @event) where T : class,IEvent
        {
            GlobalHost.ConnectionManager.GetHubContext<PushNotificationHub>().Clients.All.reciveEvent(typeof(T).Name, @event);
        }
    }
}