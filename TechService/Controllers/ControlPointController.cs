using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.ModelBinding;
using System.Web.OData;
using System.Web.OData.Query;
using System.Web.OData.Routing;


namespace TechService {
    /*
    The WebApiConfig class may require additional changes to add a route for this controller. Merge these statements into the Register method of the WebApiConfig class as applicable. Note that OData URLs are case sensitive.

    using System.Web.OData.Builder;
    using System.Web.OData.Extensions;
    using TechService;
    ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
    builder.EntitySet<Journal>("Journal");
    config.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    [Authorize]
    public class ControlPointController : ODataController
    {
        private TechDatabaseEntities db = new TechDatabaseEntities();

        // GET: odata/ControlPoint
        [EnableQuery]
        public IQueryable<ControlPoint> GetControlPoint()
        {
            return db.ControlPoint;
        }

        // GET: odata/ControlPoint(5)
        [EnableQuery]
        public SingleResult<ControlPoint> GetControlPoint([FromODataUri] Int32 key)
        {
            return SingleResult.Create(db.ControlPoint.Where(controlpoint => controlpoint.Id == key));
        }

        // POST: odata/ControlPoint
        public IHttpActionResult Post(ControlPoint controlpoint)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.ControlPoint.Add(controlpoint);
            try
            {
                db.SaveChanges();
            }
            catch (System.Data.Entity.Validation.DbEntityValidationException ex)
            {
                System.Text.StringBuilder sb = new System.Text.StringBuilder();
                foreach (var failure in ex.EntityValidationErrors)
                {
                    sb.AppendFormat("{0} failed validation\n", failure.Entry.Entity.GetType());
                    foreach (var error in failure.ValidationErrors)
                    {
                        sb.AppendFormat("- {0} : {1}", error.PropertyName, error.ErrorMessage);
                        sb.AppendLine();
                    }
                }
                throw new System.Data.Entity.Validation.DbEntityValidationException("Entity Validation Failed - errors follow:\n" + sb.ToString(), ex );
            }

            return Created(controlpoint);
        }

        // PATCH: odata/ControlPoint(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] Int32 key, Delta<ControlPoint> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            ControlPoint controlpoint = db.ControlPoint.Find(key);
            if (controlpoint == null)
            {
                return NotFound();
            }

            patch.Patch(controlpoint);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ControlPointExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(controlpoint);
        }

        // DELETE: odata/ControlPoint(5)
        public IHttpActionResult Delete([FromODataUri] Int32 key)
        {
            ControlPoint controlpoint = db.ControlPoint.Find(key);
            if (controlpoint == null)
            {
                return NotFound();
            }

            db.ControlPoint.Remove(controlpoint);
            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ControlPointExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/ControlPoint(5)/Journal
        [EnableQuery]
        public IQueryable<Journal> GetJournal([FromODataUri] Int32 key)
        {
            return db.ControlPoint.Where(m => m.Id == key).SelectMany(m => m.Journal);
        }


        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ControlPointExists(Int32 key)
        {
            return db.ControlPoint.Count(e => e.Id == key) > 0;
        }
    }
}
