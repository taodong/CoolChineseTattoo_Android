app.views.Viewport = Ext.extend(Ext.Panel, {

		fullscreen: true,
		layout: 'card',
		cardSwitchAnimation: 'slide',
		initComponent: function() {
			Ext.apply(app.views, {
				WelcomeView: new app.views.WelcomeView(),
                SingleTattooView: new app.views.SingleTattooView() 
            });
								
			Ext.apply(this, {
				items: [
					app.views.WelcomeView,
                    app.views.SingleTattooView
				]
			});
			
			app.views.Viewport.superclass.initComponent.apply(this, arguments);
							
		}
});
