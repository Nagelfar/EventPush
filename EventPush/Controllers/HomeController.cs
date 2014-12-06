﻿using EventPush.Events;
using EventPush.Hubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace EventPush.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        public ActionResult FireEvent()
        {
            PushNotificationHub.PushEvent(new FooEvent()
            {
                Foo = "bar",
                Bar = "foo"
            });

            return Content("OK");
        }
        public ActionResult FireBar()
        {
            PushNotificationHub.PushEvent(new BarEvent()
            {
                FooBar = "foobar"
            });

            return Content("OK");
        }
        public ActionResult Action()
        {
            return View();
        }
        public ActionResult RedirectBackToAction()
        {
            this.AddNotification<FooEvent>();
            this.AddNotification<BarEvent>("Das ist das Bar-Event");

            return RedirectToAction("Action");
        }

        public ActionResult ChildAction()
        {
            return Content(DateTime.Now.ToString());
        }
    }
}