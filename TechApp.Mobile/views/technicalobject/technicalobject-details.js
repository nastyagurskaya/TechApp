TechApp.TechnicalObjectDetails = function(params, viewInfo) {
    "use strict";

    var id = params.id,
        technicalobject = new TechApp.TechnicalObjectViewModel(),
        isReady = $.Deferred();

    function handleDelete() {
        DevExpress.ui.dialog.confirm("Are you sure you want to delete this item?", "Delete item").then(function(result) {
            if(result)
                handleConfirmDelete();
        });
    }

    function handleConfirmDelete() {        
        TechApp.db.TechnicalObjects.remove(id).done(function() {
            if(viewInfo.canBack) {
                TechApp.app.navigate("TechnicalObjects", { target: "back" });
            }
            else {
                TechApp.app.navigate("Blank", { target: "current" });
            }
        });
    }

    function handleViewShowing() {
        TechApp.db.TechnicalObjects.byKey(id, { expand: ["Journal"] }).done(function(data) {
            technicalobject.fromJS(data);
            isReady.resolve();
        });
    }

    return {
        id: id,
        technicalobject: technicalobject,
        handleDelete: handleDelete,        
        viewShowing: handleViewShowing,
        isReady: isReady.promise()
    };
};