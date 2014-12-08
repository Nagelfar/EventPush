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
        //private readonly static System.Web.Caching.Cache cache = new System.Web.Caching.Cache();
        private static ConnectionMapping<string> _userConnections = new ConnectionMapping<string>();
        //public void PushEvent<T>(T @event) where T : class
        //{
        //    this.Clients.All.reciveEvent(typeof(T).Name, @event);
        //}

        private static IHubContext FindContext()
        {
            return GlobalHost.ConnectionManager.GetHubContext<PushNotificationHub>();
        }

        //public static void RegisterCorrelationId(IIdentity identity, string correlationId)
        //{

        //    context.Clients.Group(identity.Name);
        //}

        public static void PushEvent<T>(IIdentity identity, T @event) where T : class,IEvent
        {
            FindContext().Clients.Group(identity.Name).reciveEvent(typeof(T).Name, @event);
        }

        public override System.Threading.Tasks.Task OnConnected()
        {
            string name = Context.User.Identity.Name;

            Groups.Add(Context.ConnectionId, name);

            _userConnections.Add(name, Context.ConnectionId);

            return base.OnConnected();
        }

        public override System.Threading.Tasks.Task OnDisconnected(bool stopCalled)
        {
            _userConnections.Remove(Context.User.Identity.Name, Context.ConnectionId);

            return base.OnDisconnected(stopCalled);
        }

        public class ConnectionMapping<T>
        {
            private readonly Dictionary<T, HashSet<string>> _connections =
                new Dictionary<T, HashSet<string>>();

            public int Count
            {
                get
                {
                    return _connections.Count;
                }
            }

            public void Add(T key, string connectionId)
            {
                lock (_connections)
                {
                    HashSet<string> connections;
                    if (!_connections.TryGetValue(key, out connections))
                    {
                        connections = new HashSet<string>();
                        _connections.Add(key, connections);
                    }

                    lock (connections)
                    {
                        connections.Add(connectionId);
                    }
                }
            }

            public IEnumerable<string> GetConnections(T key)
            {
                HashSet<string> connections;
                if (_connections.TryGetValue(key, out connections))
                {
                    return connections;
                }

                return Enumerable.Empty<string>();
            }

            public void Remove(T key, string connectionId)
            {
                lock (_connections)
                {
                    HashSet<string> connections;
                    if (!_connections.TryGetValue(key, out connections))
                    {
                        return;
                    }

                    lock (connections)
                    {
                        connections.Remove(connectionId);

                        if (connections.Count == 0)
                        {
                            _connections.Remove(key);
                        }
                    }
                }
            }
        }
    }

}