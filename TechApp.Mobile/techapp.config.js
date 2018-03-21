// NOTE object below must be a valid JSON
window.TechApp = $.extend(true, window.TechApp, {
    "config": {
        "layoutSet": "navbar",
        "animationSet": "default",
        "navigation": [
            //{
            //    "title": "Control Point",
            //    "onExecute": "#ControlPoint",
            //    "icon": "controlpoint"
            //},
            //{
            //    "title": "Journal",
            //    "onExecute": "#Journal",
            //    "icon": "journal"
            //},
            {
                "title": "Technical Objects",
                "onExecute": "#TechnicalObjects",
                "icon": "technicalobject"
            },
            {
                "title": "About",
                "onExecute": "#About",
                "icon": "info"
            },
            {
                "id": "Profile",
                "title": "Profile",
                "onExecute": "#Profile",
                "icon": "profile",
                "visible": false
            }
        ]
    }
});
