TechApp.Journal = function(params, viewInfo) {
    "use strict";

    var shouldReload = false,
        openCreateViewAsRoot = viewInfo.layoutController.name === "split",
        isReady = $.Deferred(),
        dataSourceObservable = ko.observable(),
        dataSource;

    function handleJournalModification() {
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
        TechApp.db.Journal.off("modified", handleJournalModification);
    }

    function refreshList() {
        shouldReload = false;
        dataSource.pageIndex(0);
        dataSource.load();
    }

    dataSource = new DevExpress.data.DataSource({
        store: TechApp.db.Journal,
        map: function(item) {
            return new TechApp.JournalViewModel(item);
        }
    });

    TechApp.db.Journal.on("modified", handleJournalModification);

    return {
        isReady: isReady.promise(),
        dataSource: dataSourceObservable,
        refreshList: refreshList,
        viewShowing: handleViewShowing,
        viewDisposing: handleViewDisposing,
        openCreateViewAsRoot: openCreateViewAsRoot
    };   
};