(function() {
    TechApp.ControlPointViewModel = function(data) {
            this.Id = ko.observable();
            this.ControlName = ko.observable();
            this.Value = ko.observable();
            if(data)
                this.fromJS(data);
    };

    $.extend(TechApp.ControlPointViewModel.prototype, {
        toJS: function() {
            return {
                Id: this.Id(),
                ControlName: this.ControlName(),
                Value: this.Value(),
            };
        },

        fromJS: function(data) {
            if(data) {
                this.Id(data.Id);
                this.ControlName(data.ControlName);
                this.Value(data.Value);
            }
        },

        clear: function() {
            this.Id(undefined);
            this.ControlName(undefined);
            this.Value(undefined);
        }
    });
})();