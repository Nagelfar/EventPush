using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EventPush.Events
{
    public class FooEvent:IEvent
    {
        public string Foo { get; set; }

        public string Bar { get; set; }
    }
}