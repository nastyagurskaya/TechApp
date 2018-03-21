
(function() {
    var endpointSelector = new DevExpress.EndpointSelector(TechApp.config.endpoints);

    var serviceUrl = endpointSelector.urlFor("authentication");

    function isAuthenticated() {
        return getCredentials() != null;
    }

    function saveCredentials(data) {
        localStorage["dx-credentials"] = JSON.stringify(data);
    }

    function getCredentials() {
        if(localStorage["dx-credentials"])
            return JSON.parse(localStorage["dx-credentials"]);
        return null;
    }

    function clearCredentials() {
        localStorage["dx-credentials"] = null;
    }

    function login(username, password, onSuccess, onFail) {
        var loginData = {
            grant_type: 'password',
            username: username,
            password: password
        };
        return $.ajax({
            type: 'POST',
            url: this.serviceUrl + 'Token',
            data: loginData
        }).done(function(data) {
            saveCredentials({
                username: data.userName,
                token: data.access_token
            });
        });
    }

    function register(username, password, confirmpassword) {
        var loginData = {
            Email: username,
            Password: password,
            ConfirmPassword: confirmpassword
        };
        return $.ajax({
            type: 'POST',
            url: this.serviceUrl + 'Api/Account/Register',
            data: loginData
        });
    }

    function logout() {
        clearCredentials();
        $.ajax({
            type: 'POST',
            url: this.serviceUrl + 'Api/Account/Logout'
        });
    }

    TechApp.authentication = {
        serviceUrl: serviceUrl,
        isAuthenticated: isAuthenticated,
        getCredentials: getCredentials,
        register: register,
        login: login,
        logout: logout
    };

}());