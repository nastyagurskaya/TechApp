TechApp.ControlPointEdit = function(params, viewInfo) {
    "use strict";

    var id = params.id,
        isNew = (id === undefined),
        isSplitLayout = viewInfo.layoutController.name === "split",
        controlpoint = new TechApp.ControlPointViewModel(),
        isReady = $.Deferred();

    function load() {
        return TechApp.db.ControlPoint.byKey(id).done(function(data) {
            controlpoint.fromJS(data);
        });
    }

    function update() {
        TechApp.db.ControlPoint.update(id, controlpoint.toJS()).done(function() {
            TechApp.app.back();
        });
    }

    function insert() {
        TechApp.db.ControlPoint.insert(controlpoint.toJS()).done(function(values, newId) {
            TechApp.app.navigate({ view: "ControlPointDetails", id: newId }, { target: "current" });
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
            controlpoint.clear();
            isReady.resolve();
        }
    }

    return {
        controlpoint: controlpoint,
        handleSave: handleSave,
        handleCancel: handleCancel,
        viewShowing: handleViewShowing,
        isReady: isReady.promise()
    };
};