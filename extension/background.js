/**
 * Copyright (c) 2013 Felipe Brandão. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */
//Check posts for updates and display a notification for the ones which are updated
function checkUpdates() {
    var watchlinks = getWatchLinks();;

    for( postid in watchlinks ){
        var link = watchlinks[postid].link;
        var title = watchlinks[postid].title;
        var count = watchlinks[postid].count;
        count = count ? count : 0;
        var updatedCount = getCommentCount( link );
        if( updatedCount > count ){
            var delta = updatedCount - count;
            var notification = window.webkitNotifications.createNotification(
                    'hn48.png',
                    'HN Post Updated',
                    title + " ("+ delta  +"new comments)"
                    );
            notification.onclick = function(){
                window.open(link);
            }
            notification.show();
            watchlinks[postid].count = updatedCount;
        }
    }
    localStorage.watchlinks = JSON.stringify( watchlinks );
}

/*Context Menu action*/
function addPostWatchOnClick( info , tab ){
    var hnlink = tab.url;
    var postTitle = tab.title;
    var rgx = /^https:\/\/news\.ycombinator\.com\/item\?id=/;
    //Link validadtion!
    if( !hnlink.match( rgx ) ){
        console.log( "Link not added: " + hnlink );
        return;
    }

    //grab post id for referencing
    var postid = /=([0-9]+)/.exec( hnlink )[1];

    var watchlinks = getWatchLinks();
    //will not add an existing post to be watched
    if( watchlinks[postid] != null ){
        //Post is already been watched, will remove it
        delete watchlinks[postid];
        localStorage.watchlinks = JSON.stringify( watchlinks );
        var notification = window.webkitNotifications.createNotification(
                'hn48.png',
                'HN Post Watch Removed',
                "NOT Watching post: " + postTitle 
                );
        notification.show();
        return;
    }

    //add the link to be watched with the initial comment count
    watchlinks[postid] = {
        link:hnlink,
        title:postTitle,
        count:getCommentCount(hnlink)
    };
    localStorage.watchlinks = JSON.stringify( watchlinks );

    var notification = window.webkitNotifications.createNotification(
            'hn48.png',
            'HN Post Added',
            "Watching post: " + postTitle 
            );
    notification.show();

}
chrome.contextMenus.create({
    "title": "Add/Remove HN Post Watch", 
    "contexts":["page"],
    "onclick": addPostWatchOnClick,
    "documentUrlPatterns": ["https://news.ycombinator.com/item?id=*"]
});

//load utils script
var scriptutilstag = document.createElement('script');
scriptutilstag.src="utils.js";
document.getElementsByTagName('body')[0].appendChild( scriptutilstag );

/*Code below is based on the Toast example*/
// Conditionally initialize the options.
if (!localStorage.isInitialized) {
    localStorage.isActivated = true;   // The display activation.
    localStorage.frequency = 1;        // The display frequency, in minutes.
    localStorage.isInitialized = true; // The option initialization.
}


// Test for notification support.
if (window.webkitNotifications) {
    var interval = 0; // The display interval, in minutes.

    setInterval(function() {
        interval++;

        if (
            JSON.parse(localStorage.isActivated) &&
            localStorage.frequency <= interval
           ) {
               checkUpdates();
               interval = 0;
           }
    }, 60000);
}
