TechApp.JournalDetails = function(params, viewInfo) {
    "use strict";

    var id = params.id,
        journal = new TechApp.JournalViewModel(),
        isReady = $.Deferred();

    function handleDelete() {
        DevExpress.ui.dialog.confirm("Are you sure you want to delete this item?", "Delete item").then(function(result) {
            if(result)
                handleConfirmDelete();
        });
    }

    function handleConfirmDelete() {        
        TechApp.db.Journal.remove(id).done(function() {
            if(viewInfo.canBack) {
                TechApp.app.navigate("Journal", { target: "back" });
            }
            else {
                TechApp.app.navigate("Blank", { target: "current" });
            }
        });
    }

    function handleViewShowing() {
        TechApp.db.Journal.byKey(id, { expand: ["ControlPoint"] }).done(function(data) {
            journal.fromJS(data);
            isReady.resolve();
        });
    }

    return {
        id: id,
        journal: journal,
        handleDelete: handleDelete,        
        viewShowing: handleViewShowing,
        isReady: isReady.promise()
    };
};