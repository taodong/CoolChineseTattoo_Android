app.models.UserPref =  Ext.regModel('app.models.UserPref', {
    fields: [
		{name: 'id', type: 'int'},
		{name: 'propName', type: 'string'},
		{name: 'propValue', type: 'string'}
    ],
    
    proxy: {type: 'app.models.LocalDB'}
    
});

app.stores.sysConfig = new Ext.data.Store({
	model: 'app.models.UserPref'
});