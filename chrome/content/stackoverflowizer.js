/**
 * StackOverflowizer
 *
 * Extension to always redirect to stackoverflow from pages that just copy the content, like efreedom
 * Code adapted from the original Chrome Extension by Peter Steinberger (http://petersteinberger.com)
 * Original source at https://github.com/steipete/stackoverflowerizer
 */
var stackOverflowizer = function () {

	return {
		init : function () {
			gBrowser.addEventListener("load", stackOverflowizer.run, true);
		}

		, run : function (event) {
		
            if (event.originalTarget.nodeName == '#document')
            {

                // domain of current tab
			    var dcTab = window.top.getBrowser().selectedBrowser.contentWindow.location.hostname;

                // Different handlers based on domain
                if(dcTab.indexOf('google')>-1)
                {
                    // Google - rewrite destination urls
                    stackOverflowizer.googleSr();
                }
                else if(dcTab.indexOf('efreedom')>-1)
                {
                    stackOverflowizer.efreedom();
                }
                // Common structure for these sites
                else if(dcTab.indexOf('answerspice')>-1 
                        || dcTab.indexOf('questionhub')>-1 
                        || dcTab.indexOf('comanswer.com')>-1)
                {
                    stackOverflowizer.basicSoLink();
                }
                else if(dcTab.indexOf('developerit.com')>-1)
                {
                    stackOverflowizer.developerit();
                }
            }
		}


        /**
         * Landed on Google SERPs, rewrite destination links
         */		
		, googleSr : function () {
            // Get all links and redirect where necessary
            var allLinks = content.document.getElementsByTagName("a"),
				foundLinks = 0;

			for (var i=0, il=allLinks.length; i<il; i++) {
				elm = allLinks[i];

                // translate *efreedom.com/Question/1-<id> to *stackoverflow.com/questions/<id>
                var re = /http:\/\/efreedom.com\/Question\/1-(\d+)/;
                elm.href = unescape(elm.href).replace(re, "http://stackoverflow.com/questions/$1");

                // translate *www.answerspice.com/c119/<id> to *stackoverflow.com/questions/<id>
                var re = /http:\/\/www.answerspice.com\/c119\/(\d+)/;
                elm.href = elm.href.replace(re, "http://stackoverflow.com/questions/$1");

                // translate *www.questionhub.com/StackOverflow/<id> to *stackoverflow.com/questions/<id>
                var re = /http:\/\/www.questionhub.com\/StackOverflow\/(\d+)/;
                elm.href = elm.href.replace(re, "http://stackoverflow.com/questions/$1");

                // stop google phoning home
                elm.removeEventListener('mousedown', window.rwt, false);
			}
		}
		
		
		// On an efreedom url, redirect to SO source
		, efreedom : function () {
	        var doc = window.top.getBrowser().selectedBrowser.contentWindow.document;
		    doc.location = doc.getElementById('hypQuestionCredit').href;

		}
		
		// Several sites use same structure for linking to original SO q
		, basicSoLink : function () {
		    var doc = window.top.getBrowser().selectedBrowser.contentWindow.document;
    		var soResults = doc.querySelectorAll('a[href^="http://stackoverflow.com/questions/"]');
            var h = soResults.item(0).href;
            doc.location = h;
		}
				
		// developerIT, not strictly SO but spammy nonetheless
		, developerit : function () {
		    var doc = window.top.getBrowser().selectedBrowser.contentWindow.document;
    		var soResults = doc.querySelectorAll('.readmore');
            var h = soResults.item(0).href;
            doc.location = h;
		}
	};
}();


window.addEventListener("load", stackOverflowizer.init, false);
