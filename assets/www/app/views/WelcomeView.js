app.views.WelcomeView = Ext.extend(Ext.form.FormPanel, {
    
        fullscreen: true,
        
        // layout: {type: 'hbox', align: 'top'},
                          
        dockedItems: [{
                dock : 'top',
                xtype: 'toolbar',
                title: 'Chinese Tattoo Maker'
            },
            
            {
                dock : 'top',
                xtype: 'toolbar',
                ui   : 'light',
                items: [
                    {
                        id: 'searchField',
                        xtype: 'searchfield',
                        name : 'querywords',
                        placeHolder: 'English Words',
                        maxLength: 20,
                        layout: {
                            type: 'fit',
                            align: 'left'
                        },
                        width: '70%',
                        listeners: {
                            keyup: function(thisField, e) {
                                //detect 'search' button
                                if (e.browserEvent.keyCode == 13) {
                                    var searchBar = app.views.WelcomeView.getDockedItems()[1];
                                    var qw = searchBar.getComponent('searchField').getValue();
                                    app.views.WelcomeView.submitSearch(qw);
                                }
                            }
                        }
                    },
                    {
                        id: 'searchBtn',
                        xtype: 'button',
                        text: 'search',
                        ui: 'light',
                        listeners: {
                            'tap': function() {
                                var searchBar = app.views.WelcomeView.getDockedItems()[1];
                                var qw = searchBar.getComponent('searchField').getValue();
                                app.views.WelcomeView.submitSearch(qw);                                            
                            }
                        }
                    }

                ]
            }
        ],
        
        data: hotList,
        
        tpl: new Ext.XTemplate(
                '<div id="words_blk">',
                    // '<h3>Popular Words</h3><br>',
                    '<ul>',
                        '<tpl for=".">',
                           '<tpl if="this.isOddIndex(xindex) == false">',
                                '<li>',
                                    '<a id="{word}" href="#">',
                                        '<img src="app/images/{img}" height="54" width="54"/>{word}',
                                    '</a>',
                                '</li>',
                            '</tpl>',
                            
                            '<tpl if="this.isOddIndex(xindex) == true">',
                                '<li>',
                                    '<a id="{word}" href="#">',
                                        '{word}<img src="app/images/{img}" height="54" width="54"/>',
                                    '</a>',
                                '</li>',
                            '</tpl>',
                            
                        '</tpl>',
                    '</ul>',
                '</div>',
                {
                    // XTemplate configuration:
                    compiled: true,
                    // member functions:
                    isOddIndex: function(index){
                        return index % 2 == 0;
                    }    
                }
             ),
        
        listeners: {
            body: {
                click: function(event, target) {
                    var qw = target.id;
                    
                    app.views.WelcomeView.submitSearch(qw);
                    
                },
                delegate: 'a'
            }
        },
        
        initComponent: function() {
            
                        
            app.views.WelcomeView.superclass.initComponent.apply(this, arguments);
           
        },
        
        submitSearch: function(qw) {
            
            
                                                            
            console.log('Querying word(s): ' + qw);
            
            var patt=/^[a-z\s]+$/i;
                        
            if (!qw) {
                Ext.Msg.alert('Error', 'Please input an English word.', Ext.emptyFn);

                return;
            } else if (!patt.test(qw)) {
                Ext.Msg.alert('Error', 'Please input a valid English word.', Ext.emptyFn);
                            
                return;
            }
                                                                        
            app.stores.sysConfig.load({
                scope: this,
                callback: function(records, operation, success) {
                               
                    var usrFontId = 0;
                                
                    for (var i = 0; i < records.length; i++) {
                        var sysconf = records[i].data;
                            
                        console.log('load data: ' + sysconf.id + '|' + sysconf.propName + '|' + sysconf.propValue);
                                    
                            if (sysconf.propName = 'favorite_font') {
                                usrFontId = sysconf.propValue;
                                break;
                            }
                            
                        }

                        console.log('User preferred font id is ' + usrFontId);
                                
                        Ext.dispatch({
                            controller: app.controllers.MainController,
                            word: qw,
                            fontId: usrFontId,
                            action: 'getTattoo',
                            animation: {type: 'slide', direction: 'left'}
                        });
                               
                }});

        }
});