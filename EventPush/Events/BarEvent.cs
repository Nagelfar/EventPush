using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EventPush.Events
{
    public class BarEvent : IEvent
    {
        public string FooBar { get; set; }
    }
}