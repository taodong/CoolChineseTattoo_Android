//
//  Image Download PhoneGap plugin for Android
//  ChineseTattoo
//
//  Created by Tao Dong on 12/4/12.
//  Copyright (c) 2012 daijt.com. All rights reserved.
//


var ImageDownload = function() {};

ImageDownload.prototype.downloadfromUrl = function(data, successCallback, failureCallback)  {
	return PhoneGap.exec(successCallback,    //Success callback from the plugin
							failureCallback,     //Error callback from the plugin
							'ImageDownload',  
							'downloadImage',    // Action
							data);       
}

PhoneGap.addConstructor(function() {

    PhoneGap.addPlugin("ImageDownload", new ImageDownload());

});