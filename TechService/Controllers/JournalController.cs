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
    builder.EntitySet<ControlPoint>("ControlPoint");
    builder.EntitySet<TechnicalObjects>("TechnicalObjects");
    config.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    [Authorize]
    public class JournalController : ODataController
    {
        private TechDatabaseEntities db = new TechDatabaseEntities();

        // GET: odata/Journal
        [EnableQuery]
        public IQueryable<Journal> GetJournal()
        {
            return db.Journal;
        }

        // GET: odata/Journal(5)
        [EnableQuery]
        public SingleResult<Journal> GetJournal([FromODataUri] Int32 key)
        {
            return SingleResult.Create(db.Journal.Where(journal => journal.Id == key));
        }

        // POST: odata/Journal
        public IHttpActionResult Post(Journal journal)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Journal.Add(journal);
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

            return Created(journal);
        }

        // PATCH: odata/Journal(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] Int32 key, Delta<Journal> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Journal journal = db.Journal.Find(key);
            if (journal == null)
            {
                return NotFound();
            }

            patch.Patch(journal);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!JournalExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(journal);
        }

        // DELETE: odata/Journal(5)
        public IHttpActionResult Delete([FromODataUri] Int32 key)
        {
            Journal journal = db.Journal.Find(key);
            if (journal == null)
            {
                return NotFound();
            }

            db.Journal.Remove(journal);
            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!JournalExists(key))
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

        // GET: odata/Journal(5)/ControlPoint
        [EnableQuery]
        public SingleResult<ControlPoint> GetControlPoint([FromODataUri] Int32 key)
        {
            return SingleResult.Create(db.Journal.Where(m => m.Id == key).Select(m => m.ControlPoint));
        }

        // GET: odata/Journal(5)/TechnicalObjects
        [EnableQuery]
        public IQueryable<TechnicalObjects> GetTechnicalObjects([FromODataUri] Int32 key)
        {
            return db.Journal.Where(m => m.Id == key).SelectMany(m => m.TechnicalObjects);
        }


        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool JournalExists(Int32 key)
        {
            return db.Journal.Count(e => e.Id == key) > 0;
        }
    }
}
