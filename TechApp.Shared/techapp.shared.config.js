// NOTE object below must be a valid JSON
window.TechApp = $.extend(true, window.TechApp, {
    "config": {
        "endpoints": {
            "db": {
                "local": "http://localhost:58170/odata/",
                "production": "http://localhost:58170/odata/"
            },
            "authentication": {
                "local": "http://localhost:58170/",
                "production": "http://localhost:58170/"
            }
        },
        "services": {
            "db": {
                "entities": {
                    "ControlPoint": { 
                        "key": "Id", 
                        "keyType": "Int32" 
                    },
                    "Journal": { 
                        "key": "Id", 
                        "keyType": "Int32" 
                    },
                    "TechnicalObjects": { 
                        "key": "Id", 
                        "keyType": "Int32" 
                    }
                }
            }
        }
    }
});
