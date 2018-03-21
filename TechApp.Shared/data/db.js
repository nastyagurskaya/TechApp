/// <reference path="../js/jquery-3.1.0.min.js" />
/// <reference path="../js/knockout-3.4.0.js" />
/// <reference path="../js/dx.all.js" />

(function() {
    var isWinJS = "WinJS" in window;
    var endpointSelector = new DevExpress.EndpointSelector(TechApp.config.endpoints);
    var serviceConfig = $.extend(true, {}, TechApp.config.services, {
        db: {
            url: endpointSelector.urlFor("db"),
            version: 4,

            // To enable JSONP support, uncomment the following line
            //jsonp: !isWinJS,

            // To allow cookies and HTTP authentication with CORS, uncomment the following line
            // withCredentials: true,

            beforeSend: handleBeforeSend,
            errorHandler: handleServiceError
        }
    });

    function handleBeforeSend(props) {
        if(TechApp.authentication.isAuthenticated())
            props.headers["Authorization"] = "Bearer " + TechApp.authentication.getCredentials().token;
    }

    function handleServiceError(error) {
        if(error.httpStatus == 401) {
            TechApp.authorizeError();
            return;
        }
        if(isWinJS) {
            try {
                new Windows.UI.Popups.MessageDialog(error.message).showAsync();
            } catch(e) {
                // Another dialog is shown
            }
        } else {
            alert(error.message);
        }
    }

    // Enable partial CORS support for IE < 10    
    $.support.cors = true;
    
    TechApp.db = new DevExpress.data.ODataContext(serviceConfig.db);

}());
