using System;
using System.Net.Http.Headers;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.OData.Builder;
using System.Web.OData.Extensions;
using Microsoft.Owin.Security.OAuth;

namespace TechService {
    public static class WebApiConfig {
        public static void Register(HttpConfiguration config) {
            // Web API configuration and services
            // Configure Web API to use only bearer token authentication.
            config.SuppressDefaultHostAuthentication();
            config.Filters.Add(new HostAuthenticationFilter(OAuthDefaults.AuthenticationType));

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{action}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            config.SetTimeZoneInfo(TimeZoneInfo.Utc);

            ODataConventionModelBuilder builder = new ODataConventionModelBuilder();

            builder.EntitySet<ControlPoint>("ControlPoint");
            builder.EntityType<ControlPoint>().HasKey(entity => entity.Id);

            builder.EntitySet<Journal>("Journal");
            builder.EntityType<Journal>().HasKey(entity => entity.Id);
            builder.EntityType<Journal>().HasOptional<ControlPoint>(entity => entity.ControlPoint, (entity, tergetEntity) => entity.ControlPointID == tergetEntity.Id);

            builder.EntitySet<TechnicalObjects>("TechnicalObjects");
            builder.EntityType<TechnicalObjects>().HasKey(entity => entity.Id);
            builder.EntityType<TechnicalObjects>().HasOptional<Journal>(entity => entity.Journal, (entity, tergetEntity) => entity.JournalID == tergetEntity.Id);

            config.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());

            config.Formatters.JsonFormatter.SupportedMediaTypes.Add(new MediaTypeHeaderValue("text/html"));
        }
    }
}
