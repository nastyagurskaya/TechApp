TechApp.ControlPointDetails = function(params, viewInfo) {
    "use strict";

    var id = params.id,
        controlpoint = new TechApp.ControlPointViewModel(),
        isReady = $.Deferred();

    function handleDelete() {
        DevExpress.ui.dialog.confirm("Are you sure you want to delete this item?", "Delete item").then(function(result) {
            if(result)
                handleConfirmDelete();
        });
    }

    function handleConfirmDelete() {        
        TechApp.db.ControlPoint.remove(id).done(function() {
            if(viewInfo.canBack) {
                TechApp.app.navigate("ControlPoint", { target: "back" });
            }
            else {
                TechApp.app.navigate("Blank", { target: "current" });
            }
        });
    }

    function handleViewShowing() {
        TechApp.db.ControlPoint.byKey(id).done(function(data) {
            controlpoint.fromJS(data);
            isReady.resolve();
        });
    }

    return {
        id: id,
        controlpoint: controlpoint,
        handleDelete: handleDelete,        
        viewShowing: handleViewShowing,
        isReady: isReady.promise()
    };
};