(function() {
    'use strict';
    window.DW = { };

    DW.rawData = '';
    DW.gameDevPosts = [];
    DW.techPosts = [];

    DW.displayPosts = 
        (postType)=> {
            
            function showPosts(listSelector, posts) {
                $(listSelector).empty();

                for(let i = 0; i < 5 && i <= posts.length; i++) {
                    let currPost = posts[i];
                    $(listSelector).append('<li><a href="' + currPost.permalink + '">' +  moment(currPost.date).format('MM/DD/YYYY') + ' | ' + currPost.title + '</a></li>');
                }
            }

            function displayNoPostMessage(listSelector) {
                $(listSelector).empty();

                $(listSelector).append('<li>' + 'There are currently no posts of this type.<br /><br /> Checkout <a href="https://blog.davidwesst.com">DW\'s blog</a> for other posts.' + '</li>');
            }

            // technology posts
            let techPostsSelector = '#techPosts';
            if(DW.techPosts.length > 0) {
                showPosts(techPostsSelector, DW.techPosts);
            }
            else {
                displayNoPostMessage(techPostsSelector);
            }

            // gamedev posts
            let gameDevPostSelector = '#gamedevPosts';
            if(DW.gameDevPosts.length > 0) {
                showPosts(gameDevPostSelector, DW.gameDevPosts);
            }
            else {
                displayNoPostMessage(gameDevPostSelector);
            }
        }

    DW.storePosts = 
        (posts)=> {
            DW.rawData = posts;

            DW.techPosts 
                = _.filter(posts, (post)=> {
                    return (post.categories && post.categories.length > 0 ? post.categories[0].name === 'development' : false);
                }); 

            DW.gameDevPosts 
                = _.filter(posts, (post)=> {
                    return (post.categories && post.categories.length > 0 ? post.categories[0].name === 'gamedev' : false);
                }); 
        }

    DW.getPosts = 
        (postType)=> {
            // if no post data
            if(DW.rawData === '') {
                // get post and store it
                $.getJSON('https://raw.githubusercontent.com/davidwesst/dw-blog/gh-pages/content.json')
                    .done((data)=> {
                        DW.storePosts(data.posts);
                    })
                    .fail(()=> {
                        DW.rawData = 'error';
                    })
                    .always(()=> {
                        DW.displayPosts();
                    })
            }
        }

    // initialization code
    $(document).scroll(()=> {
        if(DW.rawData === '') {
            DW.getPosts();
        }
    });
})();