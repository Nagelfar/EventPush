using EventPush.Events;
using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace EventPush.Hubs
{
    public class PushNotificationHub : Hub
    {
        //public void PushEvent<T>(T @event) where T : class
        //{
        //    this.Clients.All.reciveEvent(typeof(T).Name, @event);
        //}
        public static void PushEvent<T>(IIdentity identity, T @event) where T : class,IEvent
        {
            var context= GlobalHost.ConnectionManager.GetHubContext<PushNotificationHub>();

            context.Clients.Group(identity.Name).reciveEvent(typeof(T).Name, @event);
        }

        public override System.Threading.Tasks.Task OnConnected()
        {
            string name = Context.User.Identity.Name;

            Groups.Add(Context.ConnectionId, name);

            return base.OnConnected();
        }
    }
}