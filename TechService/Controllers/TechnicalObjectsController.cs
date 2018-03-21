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
    public class TechnicalObjectsController : ODataController
    {
        private TechDatabaseEntities db = new TechDatabaseEntities();

        // GET: odata/TechnicalObjects
        [EnableQuery]
        public IQueryable<TechnicalObjects> GetTechnicalObjects()
        {
            return db.TechnicalObjects;
        }

        // GET: odata/TechnicalObjects(5)
        [EnableQuery]
        public SingleResult<TechnicalObjects> GetTechnicalObjects([FromODataUri] Int32 key)
        {
            return SingleResult.Create(db.TechnicalObjects.Where(technicalobjects => technicalobjects.Id == key));
        }

        // POST: odata/TechnicalObjects
        public IHttpActionResult Post(TechnicalObjects technicalobjects)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.TechnicalObjects.Add(technicalobjects);
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

            return Created(technicalobjects);
        }

        // PATCH: odata/TechnicalObjects(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] Int32 key, Delta<TechnicalObjects> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            TechnicalObjects technicalobjects = db.TechnicalObjects.Find(key);
            if (technicalobjects == null)
            {
                return NotFound();
            }

            patch.Patch(technicalobjects);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TechnicalObjectsExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(technicalobjects);
        }

        // DELETE: odata/TechnicalObjects(5)
        public IHttpActionResult Delete([FromODataUri] Int32 key)
        {
            TechnicalObjects technicalobjects = db.TechnicalObjects.Find(key);
            if (technicalobjects == null)
            {
                return NotFound();
            }

            db.TechnicalObjects.Remove(technicalobjects);
            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TechnicalObjectsExists(key))
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

        // GET: odata/TechnicalObjects(5)/Journal
        [EnableQuery]
        public SingleResult<Journal> GetJournal([FromODataUri] Int32 key)
        {
            return SingleResult.Create(db.TechnicalObjects.Where(m => m.Id == key).Select(m => m.Journal));
        }


        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool TechnicalObjectsExists(Int32 key)
        {
            return db.TechnicalObjects.Count(e => e.Id == key) > 0;
        }
    }
}
