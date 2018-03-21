TechApp.SignIn = function(params) {
    "use strict";

    var username = ko.observable(''),
        password = ko.observable(''),
        loadIndicatorVisible = ko.observable(false),
        returnUri = params.returnUri,
        stack = params.stack;

    function clear() {
        username('');
        password('');
    }

    function showProfileNavigationItem() {
        var profileItem = $.grep(TechApp.app.navigation, function(e) { return e.option().id == 'Profile' })[0];
        profileItem.option("visible", true);
    }

    function register() {
        TechApp.app.navigate('Register');
    }

    function login() {
        loadIndicatorVisible(true);
        TechApp.authentication.login(username(), password())
            .done(handleSuccessful)
            .fail(handleFail)
            .always(function () {
                loadIndicatorVisible(false);
            });
    }

    function handleSuccessful() {
        TechApp.app.viewCache.clear();
        TechApp.app.navigate(returnUri, { stack: stack, target: 'current' });
        showProfileNavigationItem();
        TechApp.isAuthorizing = false;
    }

    function handleFail(error) {
        DevExpress.ui.notify('Username and / or password incorrect', 'error', 3000);
    }

    var viewModel = {
        viewShown: function () {
            clear();
        },
        username: username,
        password: password,
        loadIndicatorVisible: loadIndicatorVisible,
        registerClick: register,
        loginClick: login
    };
    return viewModel;
};