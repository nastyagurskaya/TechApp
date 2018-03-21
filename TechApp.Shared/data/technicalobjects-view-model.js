(function() {
    TechApp.TechnicalObjectViewModel = function(data) {
            this.Id = ko.observable();
            this.Journal = ko.observable();
            this.Name = ko.observable();
            if(data)
                this.fromJS(data);
    };

    $.extend(TechApp.TechnicalObjectViewModel.prototype, {
        toJS: function() {
            return {
                Id: this.Id(),
                JournalID: this.Journal() ? this.Journal().Id(): undefined,
                Name: this.Name(),
            };
        },

        fromJS: function(data) {
            if(data) {
                this.Id(data.Id);
                if(data.Journal)
                    this.Journal(new TechApp.JournalViewModel(data.Journal));
                this.Name(data.Name);
            }
        },

        clear: function() {
            this.Id(undefined);
            this.Journal(new TechApp.JournalViewModel());
            this.Name(undefined);
        }
    });
})();