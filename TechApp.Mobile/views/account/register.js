TechApp.Register = function(params) {
    "use strict";

    var username = ko.observable(''),
        password = ko.observable(''),
        passwordRetype = ko.observable(''),
        loadIndicatorVisible = ko.observable(false);

    function clear() {
        username('');
        password('');
        passwordRetype('');
    }

    function register() {
        loadIndicatorVisible(true);
        TechApp.authentication.register(username(), password(), passwordRetype())
            .done(handleSuccessful)
            .fail(handleFail)
            .always(function () {
                loadIndicatorVisible(false);
            });
    }

    function signin() {
        TechApp.app.back();
    }

    function handleSuccessful() {
        DevExpress.ui.notify('You have been registered successfully!', 'success', 3000);
        TechApp.app.back();
    }

    function handleFail(error) {
        var message = "";
        for(var state in error.responseJSON.ModelState) {
            message += error.responseJSON.ModelState[state][0];
        }
        DevExpress.ui.notify(message, 'error', 3000);
    }

    var viewModel = {
        username: username,
        password: password,
        passwordRetype: passwordRetype,
        loadIndicatorVisible: loadIndicatorVisible,
        registerClick: register,
        signinClick: signin
    };

    return viewModel;
};