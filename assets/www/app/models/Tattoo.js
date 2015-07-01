
app.models.Tattoo =  Ext.regModel('app.models.Tattoo', {
    fields: [
		{name: 'word', type: 'string'},
		{name: 'fontId', type: 'int'},
		{name: 'status', type: 'int'},
		{name: 'message', type: 'string'},
		{name: 'imageUrl', type: 'string'},
        {name: 'prevId', type: 'int'},
		{name: 'nextId', type: 'int'}
    ]
    
});



app.models.tattooRenderTempl = new Ext.Template(
    '<div id="tt_block">',
        '<p>{word}</p>',
        '<img src="{imgUrl}" alt="Tattoo Image"/>',
    '</div>',
    {
        compiled: true
    }
);




