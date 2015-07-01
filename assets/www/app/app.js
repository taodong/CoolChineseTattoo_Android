Ext.regApplication({
    name: 'app',
    
    launch: function() {
        this.launched = true;
        this.mainLaunch();
    },
    
    mainLaunch: function() {
		/*
        if (!device || !this.launched) { 
			alert('Device is not defined or application is already running.');
			return; 
		}
		*/
		
		this.views.viewport = new this.views.Viewport();
						
    }
	
		
});


Ext.Admobbar = Ext.extend(Ext.Toolbar, {
    // private
    isAdmobbar: true,
    
    
    /**
     * @cfg {number} height
     * The height of the element (defaults to <code>48</code>).
     */
    height: 48,

    /**
     * @cfg {number} width
     * The CSS class to apply to the titleEl (defaults to <code>'100%'</code>).
     */
    width: '100%',
    
    /**
     * @cfg {Object} layout
     * The CSS class to apply to the titleEl (defaults to <code>{type: 'hbox', align: 'center'}</code>).
     */
    layout:  {type: 'hbox', align: 'center'},
    
     /**
     * @cfg {String} adsLink
     * Admob generated page (defaults to <code>'adverts.html'</code>).
     */ 
    adsLink: 'adverts.html',
    
    renderSelectors: {fieldEl: '.x-admobbar'},
    
    
    renderTpl: ['<div class="x-admobbar">',
                    '<iframe src="<tpl if="adsLink">{adsLink}</tpl>" <tpl if="width"> width="{width}"</tpl> <tpl if="height"> height="{height}"</tpl> frameBorder="1" scrolling="no"></iframe>',
                '</div>'],
    
     
    initComponent : function() {
        
        /*
        Ext.applyIf(this.renderSelectors, {
            adsLink: this.adsLink,
            width: this.width,
            height: this.height
        });
        */
        
        Ext.Admobbar.superclass.initComponent.call(this);
    },
    
   
    /**
     * Initialized the renderData to be used when rendering the renderTpl.
     * @return {Object} Object with keys and values that are going to be applied to the renderTpl
     * @private
     */
    
    initRenderData: function() {
        
        return Ext.applyIf(Ext.Admobbar.superclass.initRenderData.call(this), {
            adsLink: this.adsLink,
            width: this.width,
            height: this.height,
        });
    }
       
    
});


Ext.reg('admobbar', Ext.Admobbar);