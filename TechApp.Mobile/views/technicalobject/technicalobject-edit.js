TechApp.TechnicalObjectEdit = function(params, viewInfo) {
    "use strict";

    var id = params.id,
        isNew = (id === undefined),
        isSplitLayout = viewInfo.layoutController.name === "split",
        technicalobject = new TechApp.TechnicalObjectViewModel(),
        isReady = $.Deferred();

    function load() {
        return TechApp.db.TechnicalObjects.byKey(id, { expand: ["Journal"] }).done(function(data) {
            technicalobject.fromJS(data);
        });
    }

    function update() {
        TechApp.db.TechnicalObjects.update(id, technicalobject.toJS()).done(function() {
            TechApp.app.back();
        });
    }

    function insert() {
        TechApp.db.TechnicalObjects.insert(technicalobject.toJS()).done(function(values, newId) {
            TechApp.app.navigate({ view: "TechnicalObjectDetails", id: newId }, { target: "current" });
        });
    }

    function handleSave() {
        if(isNew)
            insert();
        else
            update();
    }

    function handleCancel() {
        if(!isNew) {
            TechApp.app.back();
        }
        else {
            if(isSplitLayout) {
                TechApp.app.navigate("Blank", { target: "current" });
            }
            else {
                TechApp.app.back();
            }
        }
    }

    function handleViewShowing() {
        if(!isNew)
            load().done(function() {
                isReady.resolve();
            });
        else {
            technicalobject.clear();
            isReady.resolve();
        }
    }

    return {
        technicalobject: technicalobject,
        journalSource: {
            store: TechApp.db.Journal,
            map: function(data) {
                return new TechApp.JournalViewModel(data);
            }
        },
        handleSave: handleSave,
        handleCancel: handleCancel,
        viewShowing: handleViewShowing,
        isReady: isReady.promise()
    };
};