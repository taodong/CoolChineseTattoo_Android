Ext.data.ProxyMgr.registerType('app.models.LocalDB', Ext.extend(Ext.data.LocalStorageProxy, {

    /**
     * @cfg {String} version
     * database version. If different than current, use updatedb event to update database
     */
    dbVersion: '1.0',

    /**
     * @cfg {String} dbName
     * Name of database
     */
    dbName: 'CTH_626',

    /**
     * @cfg {String} dbDescription
     * Description of the database
     */
    dbDescription: 'Local DB for CTH Config',

    /**
     * @cfg {String} dbSize
     * Max storage size in bytes
     */
    dbSize: 5*1024*1024,
    
    
    /**
     * @private
     * db object
     */
    db: undefined,
    
    /**
     * @private
     * used to monitor initial data insertion. A helper to know when all data is in. Helps fight asynchronous nature of idb. 
     */
	initialDataCount: 0,

	/**
     * @private
     * Trigger that tells that proxy is currently inserting initial data
     */
	insertingInitialData: false,
    
    
    /**
     * Creates the proxy, throws an error if local storage is not supported in the current browser.
     * @param {Object} config (optional) Config object.
     */
    constructor: function(config) {
        Ext.data.WebStorageProxy.superclass.constructor.apply(this,arguments);

        this.initialize();
    },
    
  
    /**
     * @private
     * Sets up the Proxy by opening database and creating table if necessary
     */
    initialize: function() {
        var me = this,
            db;

        me.db = db = openDatabase(me.dbName, me.dbVersion, me.dbDescription, me.dbSize);

        //take care of the table
        db.transaction(function(tx) {
            
            
            var query = 'SELECT * FROM usr_preference LIMIT 1';
            var args = [];
            var createTable = function() {
                var query = 'create table if not exists usr_preference (id integer not null primary key autoincrement, propName text not null, propValue text not null)';
               
                tx.executeSql(query,
                          args,
                          Ext.createDelegate(me.addInitialData, me),  //on success
                          Ext.createDelegate(me.onError, me));        // on error
            }
            
            tx.executeSql(query, args, Ext.emptyFn, createTable);

        });
    },
    
    /**
     * Add initial data if set at {@link #initialData}
     */
    addInitialData: function() {
        console.log('Populate initial data');
        var initialData = [{propName:'favorite_font', propValue: 1}];
        this.addData(initialData);
    },
    
    /**
     * Add data when needed
     * Also add initial data if set at {@link #initialData}
     * @param {Array/Ext.data.Store} newData Data to add as array of objects or a store instance. Optional
     * @param {Boolean} clearFirst Clear existing data first
     */
	addData: function(newData, clearFirst) {
		var me = this,
            model = 'app.models.UserPref',
		    data = newData;

        //clear objectStore first
        if (clearFirst===true){
            me.clear();
            me.addData(data);
            return;
        }

        if (Ext.isObject(data) && data.isStore===true) {
            data = me.getDataFromStore(data);
        }

		me.initialDataCount = data.length;
		me.insertingInitialData = true;

		Ext.each(data, function(entry) {
			Ext.ModelMgr.create(entry, model).save();
		})
	},
    
    /**
     * Destroys all records stored in the proxy 
     */
    clear: function(callback, scope) {
        var me = this;

        me.db.transaction(function(tx){
            var query = 'DELETE FROM usr_preference';
            var args = [];
            if (Ext.debug) {
                console.log(query, args);
            }
            tx.executeSql(query,
                args,
                Ext.emptyFn,  //on success
                Ext.createDelegate(me.onError, me));        // on error
        });

        return true;
    },
    
    
    /**
     * Universal error reporter for debugging purposes
	 * @param {Object} err Error object.
     */
    onError: function(err, e) {
        var error = (e && e.message) || err;
        console.log('Database operation failed. ' + error);

    },
    
    //inherit docs
    create: function(operation, callback, scope) {
    
        console.log('calling LocalDB create method.');
        
        var records = operation.records,
            length  = records.length,
            id, record, i;

        operation.setStarted();

        for (i = 0; i < length; i++) {
            record = records[i];
            this.setRecord(record);
        }

        operation.setCompleted();
        operation.setSuccessful();

        if (typeof callback == 'function') {
            callback.call(scope || this, operation);
        }
    },
    
    //inherit docs
    read: function(operation, callback, scope) {
        console.log('calling LocalDB read method.');
        
        var records = [],
            me      = this,
            Model = app.models.UserPref,
            onSuccess = function(tx,rs) {
                var len = rs.rows.length,
                    i=0,
                    item;
                for (; i<len;i++) {
                    item = rs.rows.item(i);
                    // 'app.models.UserPref'
                    records.push(new Model(item, item.id));
                }
                
                console.log('Retrieved total ' + len + ' records');
                
                operation.resultSet = new Ext.data.ResultSet({
                    records: records,
                    total: records.length,
                    loaded: true
                });	
                
                operation.setCompleted();
                operation.setSuccessful();
            
                if (typeof callback == 'function') {
                    callback.call(scope || this, operation);
                }

            };
            
            me.db.transaction(function(tx, rs){
                var query = 'SELECT id, propName, propValue FROM usr_preference';
                var args = [];
            
                tx.executeSql(query,
                    args,
                    onSuccess,  //on success
                    Ext.createDelegate(me.onError, me));        // on error
            });

    },
    
    //inherit docs
    update: function(operation, callback, scope) {
        console.log('calling LocalDB update method.');
        
        var records = operation.records,
            length  = records.length,
            record, id, i;

        operation.setStarted();

        for (i = 0; i < length; i++) {
            record = records[i];
            this.updateRecord(record);
        }
        operation.setCompleted();
        operation.setSuccessful();

        if (typeof callback == 'function') {
            callback.call(scope || this, operation);
        }
    },
    
     //inherit
    destroy: function(operation, callback, scope) {
        console.log('calling LocalDB destroy method.');
        
        var records = operation.records;

        // Do nothing for this app
        /*
        for (i = 0; i < length; i++) {
            
        }
        */

        operation.setCompleted();
        operation.setSuccessful();

        if (typeof callback == 'function') {
            callback.call(scope || this, operation);
        }
    },


    
    /**
     * Saves the given record in the Proxy.
     * @param {Ext.data.Model} record The model instance
     */
    setRecord: function(record) {
        var me = this,
            rawData = record.data,
            args = [],
            onSuccess = Ext.emptyFn;

        //extract data to be inserted
        
        args.push(rawData.propName);
        args.push(rawData.propValue);
       

        me.db.transaction(function(tx){
            var query = 'insert into usr_preference (propName, propValue) values (?, ?)';
           
            tx.executeSql(query,
                args,
                onSuccess,  //on success
                Ext.createDelegate(me.onError, me));        // on error
        });

        return true;
    },
    
    /**
     * Updates the given record.
     * @param {Ext.data.Model} record The model instance
     */
   
    updateRecord: function(record) {
        var me = this,
            newData = record.data,
            values = [],
            onSuccess = function(tx,rs) {
                //add new record if id doesn't exist
                if (!rs.rowsAffected) me.setRecord(record);
            };

        values.push(newData.propValue);
        values.push(newData.id);

         me.db.transaction(function(tx){
            var query = 'UPDATE usr_preference SET propValue = ? WHERE id = ?';
            var args = values;
            
            tx.executeSql(query,
                args,
                onSuccess,  //on success
                Ext.createDelegate(me.setRecord, me, [record]));        // on error
        });

        return true;
    },
    

        
    /**
    * Get data from store. Usually from Server proxy.
    * Useful if caching data data that don't change much (e.g. for comboboxes)
    * Used at {@link #addData}
    * @private
    * @param {Ext.data.Store} store Store instance
    * @return {Array} Array of raw data
    */
    getDataFromStore: function(store) {
        var data = [];
        store.each(function(item) {
            data.push(item.data)
        });
        return data;
    }
}));