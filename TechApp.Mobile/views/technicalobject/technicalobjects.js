TechApp.TechnicalObjects = function(params, viewInfo) {
    "use strict";

    var shouldReload = false,
        openCreateViewAsRoot = viewInfo.layoutController.name === "split",
        isReady = $.Deferred(),
        dataSourceObservable = ko.observable(),
        dataSource;

    function handleTechnicalObjectsModification() {
        shouldReload = true;
    }

    function handleViewShowing() {
        if(!dataSourceObservable()) {
            dataSourceObservable(dataSource);
            dataSource.load().always(function() {
                isReady.resolve();
            });
        }
        else if(shouldReload) {
            refreshList();
        }
    }

    function handleViewDisposing() {
        TechApp.db.TechnicalObjects.off("modified", handleTechnicalObjectsModification);
    }

    function refreshList() {
        shouldReload = false;
        dataSource.pageIndex(0);
        dataSource.load();
    }

    dataSource = new DevExpress.data.DataSource({
        store: TechApp.db.TechnicalObjects,
        map: function(item) {
            return new TechApp.TechnicalObjectViewModel(item);
        }
    });

    TechApp.db.TechnicalObjects.on("modified", handleTechnicalObjectsModification);

    return {
        isReady: isReady.promise(),
        dataSource: dataSourceObservable,
        refreshList: refreshList,
        viewShowing: handleViewShowing,
        viewDisposing: handleViewDisposing,
        openCreateViewAsRoot: openCreateViewAsRoot
    };   
};