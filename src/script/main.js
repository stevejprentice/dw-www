(function() {
    'use strict';
    window.DW = { };

    DW.postData = '';

    DW.displayPosts = 
        ()=> {
            alert('displaying post...');
        }

    DW.getPosts = 
        (postType)=> {
            // if no post data
            if(DW.postData === '') {
                // get post and store it
                $.getJSON('https://raw.githubusercontent.com/davidwesst/dw-blog/gh-pages/content.json')
                    .done((data)=> {
                        DW.postData = data;
                    })
                    .fail(()=> {
                        DW.postData = 'error';
                    })
                    .always(()=> {
                        DW.displayPosts();
                    })
            }
        }
})();