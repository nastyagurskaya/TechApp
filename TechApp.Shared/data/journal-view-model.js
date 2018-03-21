(function() {
    TechApp.JournalViewModel = function(data) {
            this.Id = ko.observable();
            this.ControlPoint = ko.observable();
            this.Date = ko.observable();
            this.ExecutorName = ko.observable();
            if(data)
                this.fromJS(data);
    };

    $.extend(TechApp.JournalViewModel.prototype, {
        toJS: function() {
            return {
                Id: this.Id(),
                ControlPointID: this.ControlPoint() ? this.ControlPoint().Id(): undefined,
                Date: this.Date(),
                ExecutorName: this.ExecutorName(),
            };
        },

        fromJS: function(data) {
            if(data) {
                this.Id(data.Id);
                if(data.ControlPoint)
                    this.ControlPoint(new TechApp.ControlPointViewModel(data.ControlPoint));
                this.Date(data.Date);
                this.ExecutorName(data.ExecutorName);
            }
        },

        clear: function() {
            this.Id(undefined);
            this.ControlPoint(new TechApp.ControlPointViewModel());
            this.Date(undefined);
            this.ExecutorName(undefined);
        }
    });
})();