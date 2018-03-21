$(function() {
    var startupView = "TechnicalObjects";

    // Uncomment the line below to disable platform-specific look and feel and to use the Generic theme for all devices
    // DevExpress.devices.current({ platform: "generic" });

    if(DevExpress.devices.real().platform === "win") {
        $("body").css("background-color", "#000");
    }

    var isDeviceReady = false,
        isViewShown = false;

    function hideSplashScreen() {
        if(isDeviceReady && isViewShown) {
            navigator.splashscreen.hide();
        }
    }

	if(document.addEventListener) {
		document.addEventListener("deviceready", function () {
			isDeviceReady = true;
			hideSplashScreen();
			document.addEventListener("backbutton", function () {
				DevExpress.processHardwareBackButton();
			}, false);
		}, false);
	}

    function onViewShown() {
        isViewShown = true;
        hideSplashScreen();
        TechApp.app.off("viewShown", onViewShown);
    }

    function onNavigatingBack(e) {
        if(e.isHardwareButton && !TechApp.app.canBack()) {
            e.cancel = true;
            exitApp();
        }
        if(TechApp.isAuthorizing)
            TechApp.isAuthorizing = false;
    }

    function exitApp() {
        switch (DevExpress.devices.real().platform) {
            case "android":
                navigator.app.exitApp();
                break;
            case "win":
                MSApp.terminateApp('');
                break;
        }
    }

    var layoutSet = DevExpress.framework.html.layoutSets[TechApp.config.layoutSet],
        navigation = TechApp.config.navigation;


    var emptyLayoutController = new DevExpress.framework.html.EmptyLayoutController();
    layoutSet.push({ controller: emptyLayoutController });

    if(TechApp.authentication.isAuthenticated()) {
        var profileItem = $.grep(navigation, function(e) { return e.id == 'Profile' })[0];
        profileItem.visible = true;
    }

    TechApp.app = new DevExpress.framework.html.HtmlApplication({
        namespace: TechApp,
        layoutSet: layoutSet,
        animationSet: DevExpress.framework.html.animationSets[TechApp.config.animationSet],
        navigation: navigation,
        commandMapping: TechApp.config.commandMapping,
        navigateToRootViewMode: "keepHistory",
        useViewTitleAsBackText: true
    });

    TechApp.app.on("resolveLayoutController", function (args) {
        var viewName = args.viewInfo.viewName;
        if (viewName === "SignIn" || viewName === "Register") {
            args.layoutController = emptyLayoutController;
        }
    });
    TechApp.authorizeError = function () {
        if(TechApp.isAuthorizing) return;

        TechApp.isAuthorizing = true;
        var currentUri = window.location.hash.replace(/#/, '');
        var currentStack = TechApp.app.navigationManager.currentStackKey;
        TechApp.app.navigate({ view: 'SignIn', returnUri: currentUri, stack: currentStack}, { target: 'current' });
        DevExpress.ui.notify('The server requires you to login', 'error', 3000);
    }
    $(window).on("unload", function() {
        TechApp.app.saveState();
    });

    TechApp.app.router.register(":view/:id", { view: startupView, id: undefined });
    TechApp.app.on("viewShown", onViewShown);
    TechApp.app.on("navigatingBack", onNavigatingBack);
    TechApp.app.navigate();
});