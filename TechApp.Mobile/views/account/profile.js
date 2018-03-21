TechApp.Profile = function(params) {
    "use strict";

    var username = ko.observable('');

    var credentials = TechApp.authentication.getCredentials();
    if(credentials)
        username(credentials.username);

    function hideProfileNavigationItem() {
        var profileItem = $.grep(TechApp.app.navigation, function(e) { return e.option().id == 'Profile' })[0];
        profileItem.option("visible", false);
    }

    function logout() {
        TechApp.authentication.logout();
        TechApp.app.navigate('', { root: true });
        TechApp.app.viewCache.clear();
        hideProfileNavigationItem();
    }

    var viewModel = {
        username: username,
        logoutClick: logout
    };

    return viewModel;
};