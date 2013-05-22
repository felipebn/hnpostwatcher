
function getWatchLinks(){
    var watchlinks = null;
    if( localStorage.watchlinks ){
        watchlinks = JSON.parse( localStorage.watchlinks );
    }else{
        watchlinks = {};
    }
    return watchlinks;
}

//Do a request on the post link and grabs its title
function getPostTitle( link ){
    var result = "--";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", link , false);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            try{
                var hidden = document.body.appendChild(document.createElement("div"));
                hidden.style.display = "none";
                hidden.innerHTML = (/<body[^>]*>([\s\S]+)<\/body>/i).exec(xhr.responseText)[1];
                var title = hidden.querySelector('.title').innerText;
                result = title;
            }catch(e){
                result = "<em>Error loading link (parse)</em>";
            }
        }else{
            result = "<em>Error loading link (load)</em>";
        }
    }
    xhr.send();
    return result;
}
//Do a request on the post link and grabs the comment count
function getCommentCount( link ){
    var result = 0;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", link , false);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            try{
                var grepresult = /<td class="subtext">.*?([0-9]+) comments.*?<\/td>/.exec(xhr.responseText);
                if( grepresult == null ){
                    result = 0;
                }else{
                    result = parseInt( grepresult[1] );
                }
            }catch(e){
                console.debug(e);
                result = "<em>Error loading link (parse)</em>";
            }
        }else{
            result = "<em>Error loading link (load)</em>";
        }
    }
    xhr.send();
    return result;
}
