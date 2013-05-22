/**
 * Copyright (c) 2013 Felipe Brandão. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */
/*Code below is based on toats example*/
/*
   Grays out or [whatever the opposite of graying out is called] the option
   field.
   */
function ghost(isDeactivated) {
    options.style.color = isDeactivated ? 'graytext' : 'black';
    var elts = options.elements;
    for( var i = 0; i < elts.length ; i++ ){
        if( elts[i].name == 'isActivated' ) continue;
        elts[i].disabled = isDeactivated;
    }
}

function getWatchLinks(){
    var watchlinks = null;
    if( localStorage.watchlinks ){
        watchlinks = JSON.parse( localStorage.watchlinks );
    }else{
        watchlinks = {};
    }
    return watchlinks;
}

//Adds a watch link to local storage
function addLink(){
    var hnlink = options.newlink.value;

    //Link validadtion!
    if( hnlink.match(/^[0-9]+$/) ){
        hnlink = "https://news.ycombinator.com/item?id=" + hnlink;
    }else if( !hnlink.match( /^https:\/\/news\.ycombinator\.com\/item\?id=/ ) ){
        alert( "You must provide a valid HN Discussion link!" );
        options.newlink.focus();
        return;
    }

    //remove the post id for referencing
    var postid = /=([0-9]+)/.exec( hnlink )[1];

    var watchlinks = getWatchLinks();
    //add the link to be watched
    watchlinks[postid] = {
        link:hnlink,
        title:getPostTitle(hnlink),
        count:getCommentCount(hnlink)
    };
    localStorage.watchlinks = JSON.stringify( watchlinks );
}

function updateLinkTable( localStorage ){
    var watchlinks = null;
    if( localStorage.watchlinks ){
        watchlinks = JSON.parse( localStorage.watchlinks );
    }else{
        watchlinks = {};
    }
    var postid;
    for( postid in watchlinks ){
        var link = watchlinks[postid].link;
        var title = watchlinks[postid].title;
        var tr = linktable.insertRow();
        var trid = "tr_" + postid;
        tr.id = trid;
        var td;
        td = tr.insertCell();
        td.innerHTML = "<button>remove watch</button>"; //last cell
        td.querySelector('button').onclick = (function(idref){
            return function(){ removeWatch(idref) };
        })(trid);
        td = tr.insertCell();
        td.innerHTML = title;
        td = tr.insertCell();
        td.innerHTML = "<a href='LINK' target='_blank'>LINK</a>".replace( /LINK/g , link );
    }
}


//Removes the link from watch list
function removeWatch(trid){
    var postid = trid.replace("tr_","");
    var watchlinks = getWatchLinks();
    //removes the link
    delete watchlinks[postid];
    //save the modified watch list
    localStorage.watchlinks = JSON.stringify( watchlinks );
    //removes the tr
    linktable.childNodes[1].removeChild( document.getElementById( trid ) );
}

/*Code below is based on the toast example*/
window.addEventListener('load', function() {
    // Initialize the option controls.
    options.isActivated.checked = JSON.parse(localStorage.isActivated);
    // The display activation.
    options.frequency.value = localStorage.frequency;
    // The display frequency, in minutes.

    if (!options.isActivated.checked) { ghost(true); }

    // Set the display activation and frequency.
    options.isActivated.onchange = function() {
        localStorage.isActivated = options.isActivated.checked;
        ghost(!options.isActivated.checked);
    };

    options.frequency.onchange = function() {
        if( options.frequency.value < 15 ){
            alert( "Min refresh interval is 15 minutes!" );
        }else{
            localStorage.frequency = options.frequency.value;
        }
            localStorage.frequency = options.frequency.value;
    };

    options.addlink.onclick = function(){
        addLink( localStorage );
    }

    updateLinkTable( localStorage );
});
