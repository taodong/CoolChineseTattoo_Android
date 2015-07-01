app.views.SingleTattooView = Ext.extend(Ext.Panel, {
    
        fullscreen: true,
        /*
        monitorOrientation: true,
        listeners: {
            orientationchange : {
                fn: this.onOrientationChange
            }
        },
        */
                          
        dockedItems: [{
                dock : 'top',
                xtype: 'toolbar',
                title: 'Chinese Tattoo Maker',
                items: [
                    {xtype: 'spacer'},
                    {
                        iconCls: 'home',
                        iconMask: true,
                        ui: 'light',
                        listeners: {
                            'tap': function() {
                                Ext.dispatch({
                                    controller: app.controllers.MainController,
                                    action: 'navHome',
                                    animation: {type: 'slide', direction: 'right'}
                                });

                            }
                        }
                    }
                ]
            },
                         
            {
                id: 'bottomToolbar',
                dock: 'bottom',
                xtype: 'toolbar',
                ui   : 'light',
                layout:{ pack: 'center' },
                items: [
                    {
                        id: 'mebtn',
                        text : 'More Classic',
                        ui: 'back',
                        listeners: {
                            'tap': function() {
                            
                                var tattoo = app.views.SingleTattooView.data;
                                var nfont = tattoo.get('prevId');
                                var qw = tattoo.get('word');
                                Ext.dispatch({
                                    controller: app.controllers.MainController,
                                    word: qw,
                                    fontId: nfont,
                                    action: 'getTattoo',
                                    animation: {type: 'slide', direction: 'left'}
                                });
                            }
                        }
                    },
                    
                    {
                        id: 'infobtn',
                        iconCls: 'info',
                        iconMask: true,
                        ui: 'plain',
                        listeners: {
                            'tap': function() {
                                var tattoo = app.views.SingleTattooView.data;
                                var msg = tattoo.get('message');
                                if (msg) {
                                     Ext.Msg.alert('Info', msg, Ext.emptyFn);
                                }
                                else {
                                
                                    Ext.Msg.alert('Unverified', 'Unverified translation by a third party translator.', Ext.emptyFn);
                                }
                            }
                        }
                    },
                    
                    {
                        id: 'warnbtn',
                        iconCls: 'warning_black',
                        hidden: true,
                        iconMask: true,
                        ui: 'plain',
                        listeners: {
                            'tap': function() {
                                var tattoo = app.views.SingleTattooView.data;
                                var msg = tattoo.get('message');
                                Ext.Msg.alert('Warning', message, Ext.emptyFn);
                            }
                        }
                    },
                    
                    {
                        iconCls: 'download',
                        iconMask: true,
                        ui: 'plain',
                        listeners: {
                            'tap': function() {
                            	var loadMask = new Ext.LoadMask(Ext.getBody(), {msg:"Downloading image..."});
                            	 app.views.SingleTattooView.loadingMask = loadMask;
                                 app.views.SingleTattooView.loadingMask.show();
                            	
                                var tt = app.views.SingleTattooView.data;
                                var imgUrl = tt.get('imageUrl');
                                var word = tt.get('word');
                                var font = tt.get('fontId');
                                
                                console.log('Download image from ' + imgUrl);
                               
                                window.plugins.ImageDownload.downloadfromUrl(
                                    [imgUrl],
                                    function(result) {
                                    	app.views.SingleTattooView.loadingMask.hide();
                                        Ext.Msg.alert('Success', "Image has been saved to /sdcard/download Folder", Ext.emptyFn);
                                        
                                    },
                                    function(error) {
                                    	app.views.SingleTattooView.loadingMask.hide();
                                        Ext.Msg.alert('Error', "Download Failed. You can try again later.", Ext.emptyFn);
                                    }
                                );
                                
                                var dloadUrl = CTHConfig.server + CTHConfig.downloadImg + '/' + escape(word) + '/' + font;
                                
                                jQuery.get(dloadUrl);
                            }
                        }
                    },
                    
                    {
                        id: 'mpbtn',
                        text : 'More Passion',
                        ui: 'forward',
                        listeners: {
                            'tap': function() {
                                var tattoo = app.views.SingleTattooView.data;
                                var nfont = tattoo.get('nextId');
                                var qw = tattoo.get('word');
                                Ext.dispatch({
                                    controller: app.controllers.MainController,
                                    word: qw,
                                    fontId: nfont,
                                    action: 'getTattoo',
                                    animation: {type: 'slide', direction: 'left'}
                                });
                            }
                        }
                    }

                ]
            }/*,
            
                   
            {
                id: 'myAdmobToolbar',
                xtype: 'panel',
                dock: 'bottom',
                height: 52,
                weight: '100%',
                html: '<iframe src="adverts.html" width="100%" height="52" frameBorder="0" scrolling="yes"></iframe>'
 
            }
            
            {
                xtype: 'component',
                contentEl : 'adsense',
                dock : 'bottom',
                height: 50,
                width: '100%'
            }
            */   
                   
        ],
        
        
                
        initComponent: function() {
		
            app.views.WelcomeView.superclass.initComponent.apply(this, arguments);
            
            
		
        },
        
        requestTattoo: function(word, fontId) {
            app.views.SingleTattooView.update('');
            var myMask = new Ext.LoadMask(Ext.getBody(), {msg:"Loading image..."});
            app.views.SingleTattooView.loadingMask = myMask;
            app.views.SingleTattooView.loadingMask.show();
            
            var url = CTHConfig.server + CTHConfig.loadTattoo + '/' + escape(word) + '/' + fontId;
            
            console.log('Query URL: ' + url);
            
                        
            jQuery.getJSON(url, function(data) {
                // console.log('JSON object: ' + JSON.stringify(data.sample));
                var tattoo = new app.models.Tattoo(data.sample);
                                
                var imgUrl = tattoo.get('imageUrl');
                                
                // Enable/Disable buttons
                var cid = tattoo.get('fontId');
                var pid = tattoo.get('prevId');
                var nid = tattoo.get('nextId');
                
                // console.log('IDs: [' + cid + '|' + pid + '|' + nid + ']');
                
                var bottomBar = app.views.SingleTattooView.getDockedComponent('bottomToolbar');
                
                                
                var eleButton = bottomBar.getComponent('mebtn');
                var pasButton = bottomBar.getComponent('mpbtn');
                
                eleButton.enable();
                pasButton.enable();
                
                if (cid == pid) {
                    // console.log('disable elegent button');
                   eleButton.disable();
                }
                
                if (cid == nid) {
                    // console.log('disable passion button');
                    pasButton.disable();
                }
                
                // Check ambiguious meaning
                var cstatus = tattoo.get('status');
                var infoButton = bottomBar.getComponent('infobtn');
                var warnButton = bottomBar.getComponent('warnbtn');
                
                if (cstatus == -1) {
                    console.log('Change info icon to warning');
                    infoButton.hide();
                    warnButton.show();
                }
                else {
                    infoButton.show();
                    warnButton.hide();
                }
                
                app.views.SingleTattooView.data = tattoo;
                
                app.views.SingleTattooView.verifyRemoteImage(imgUrl, CTHConfig.imageQueryTime - 1, app.views.SingleTattooView.displayTattoo, this);
                                
            }).error(
                function() {
                    app.views.SingleTattooView.loadingMask.hide();
                    Ext.Msg.alert('Error', "Your word can't be translated. Please check the spell or try it later.", Ext.emptyFn);
                }
            );
            
            // console.log('After Ajax call.');
        
        },
        
        verifyRemoteImage: function(imgUrl, count, callback, scope) {
            jQuery.ajax({
                url:imgUrl,
                type:'HEAD',
                success: function(){
                        callback.call(scope, true);
                },
                error:function(){
                    var retryCount = count - 1;
                    console.log("Image is not ready yet, retry time remains " + count);
                    if (count > 0) {
                        setTimeout(
                            function(){
                                app.views.SingleTattooView.verifyRemoteImage(imgUrl, retryCount, callback, scope);
                            }, 
                        1000);
					
                    }
                    else {
                        callback.call(scope, false);
                    }
		
                }
            });
        },
        
        displayTattoo: function(exist) {
       
            if (exist) {
                var tt = app.views.SingleTattooView.data;
                var imgUrl = tt.get('imageUrl');
                var theWord = tt.get('word');
                var htmlSeg = app.models.tattooRenderTempl.apply({word: theWord, imgUrl: imgUrl});
                // console.log('html generated by template: ' + htmlSeg);
                app.views.SingleTattooView.update(htmlSeg);
               
            }
            else {
                
                Ext.Msg.alert('Error', 'Tattoo image is not ready for this font, try other style or come back later.', Ext.emptyFn);
            }
            app.views.SingleTattooView.loadingMask.hide();
        }
        
        /*,
        
        onOrientationChange: function(orientation, w, h) {
            
            console.log('orientation change to ' + orientation);
            
            if(Ext.Viewport.orientation == 'portrait'){

                app.views.SingleTattooView.getDockedItems()[1].show();  

            }
            else{
                app.views.SingleTattooView.getDockedItems()[1].hide();
            
            }
        }*/
        
});


