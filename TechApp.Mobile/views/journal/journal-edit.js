TechApp.JournalEdit = function(params, viewInfo) {
    "use strict";

    var id = params.id,
        isNew = (id === undefined),
        isSplitLayout = viewInfo.layoutController.name === "split",
        journal = new TechApp.JournalViewModel(),
        isReady = $.Deferred();

    function load() {
        return TechApp.db.Journal.byKey(id, { expand: ["ControlPoint"] }).done(function(data) {
            journal.fromJS(data);
        });
    }

    function update() {
        TechApp.db.Journal.update(id, journal.toJS()).done(function() {
            TechApp.app.back();
        });
    }

    function insert() {
        TechApp.db.Journal.insert(journal.toJS()).done(function(values, newId) {
            TechApp.app.navigate({ view: "JournalDetails", id: newId }, { target: "current" });
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
            journal.clear();
            isReady.resolve();
        }
    }

    return {
        journal: journal,
        controlpointSource: {
            store: TechApp.db.ControlPoint,
            map: function(data) {
                return new TechApp.ControlPointViewModel(data);
            }
        },
        handleSave: handleSave,
        handleCancel: handleCancel,
        viewShowing: handleViewShowing,
        isReady: isReady.promise()
    };
};