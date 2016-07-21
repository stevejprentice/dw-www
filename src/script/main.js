(function() {
    'use strict';
    window.DW = { };

    DW.rawData = '';
    DW.gameDevPosts = [];
    DW.techPosts = [];

    DW.displayPosts = 
        ()=> {
            $('#techPosts, #gamedevPosts').empty();

            for(let i = 0; i < 5 && i <= DW.techPosts.length; i++) {
                let currPost = DW.techPosts[i];
                $('#techPosts').append('<li><a href="' + currPost.permalink + '">' + currPost.title + '</a></li>');
            }

            for(let i = 0; i < 5 && i <= DW.techPosts.length; i++) {
                let currPost = DW.gameDevPosts[i];
                $('#gamedevPosts').append('<li>' + currPost.title + '</li>');
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