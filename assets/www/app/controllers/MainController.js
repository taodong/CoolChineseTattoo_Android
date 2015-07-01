app.controllers.MainController = new Ext.Controller({

    getTattoo: function(options) {
		
		var word = options.word;
        
        var fontId = options.fontId;
        
        console.log('word: ' + word + ' font id: ' + fontId);
		
		
        app.views.SingleTattooView.requestTattoo(word, fontId);
			
        app.views.viewport.setActiveItem(
            app.views.SingleTattooView, options.animation
        );
		
	},
    
    navHome: function(options) {
        app.views.viewport.setActiveItem(
            app.views.WelcomeView, options.animation
        );
    }
});