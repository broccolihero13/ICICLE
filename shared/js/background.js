chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    switch(request.req){
      case 'get_templates':
        // TODO Cache this
        sendResponse({templates:templates});
        break;

      case 'load_user_css':
        chrome.tabs.insertCSS({file:'css/user_list_tweaks.css'},function(){
          sendResponse({message:'done inserting'});
        });
        break;
      case 'require_load_js':
        var files = request.files;
        var file_tasks = request.files.map(function(file) { return loadJS(file); });
        $.when.apply($, file_tasks).then(function() { sendResponse({message:'done inserting'}); });
        break;
      default:
        sendResponse({template: Handlebars.compile("")});
        break;
    }
    return true;
  }
);

function loadJS(file){
    var dfd = $.Deferred();
    chrome.tabs.executeScript({file:file},function(){
        dfd.resolve(file);
    });
    return dfd.promise();
}
//
// When the extension is installed or upgraded ...
//
//
chrome.runtime.onInstalled.addListener(function() {
  // Replace all rules ...
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    // With a new rule ...
	    chrome.declarativeContent.onPageChanged.addRules([
	      {
	        // That fires when a page's URL contains a 'g' ...
	        conditions: [
	          new chrome.declarativeContent.PageStateMatcher({
	            pageUrl: { 
                hostSuffix: '.instructure.com',
                //urlMatches: 'https:\/\/(?!(sisync|www))+\.instructure\.com.*'
              },
	          })
	        ],
	        // And shows the extension's page action.
	        actions: [ new chrome.declarativeContent.ShowPageAction() ]
	      }
	    ]);
	  });
});
