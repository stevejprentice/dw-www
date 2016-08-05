(function() {
    'use strict';
    window.DW = { };

    DW.posts = '';

    DW.displayPosts = 
        (postType)=> {
            
            function showPosts(listSelector, posts) {
                $(listSelector).empty();

                for(let i = 0; i < 5 && i <= posts.length; i++) {
                    let currPost = posts[i];
                    let content = [];
                    content.push('<li>');
                    content.push('<a class="post" href="' + currPost.permalink + '">');

                    content.push('<div class="date">');
                    content.push(moment(currPost.date).format('YYYY-MM-DD'));
                    content.push('</div>');

                    content.push('<div class="title">');
                    content.push(currPost.title);
                    content.push('</div>');

                    if(currPost.tags && currPost.tags.length > 0) {
                        content.push('<div class="tags">');

                        currPost.tags.forEach(function(tag, index, arr) {
                            content.push('<span>Tagged with ');
                            content.push(tag.name);
                            if(index !== arr.length-1) {
                                content.push(', ');
                            }
                            content.push(' ');
                            content.push('</span>');
                        }, this);

                        content.push('</div>');
                    }

                    content.push('<div class="excerpt">');
                    content.push(currPost.excerpt);
                    content.push('</div>');

                    content.push('</a>');
                    content.push('</li>');

                    $(listSelector).append(content.join(''));
                }
            }

            function displayNoPostMessage(listSelector) {
                $(listSelector).empty();

                $(listSelector).append('<li>' + 'There are currently no posts of this type.<br /><br /> Checkout <a href="https://blog.davidwesst.com">DW\'s blog</a> for other posts.' + '</li>');
            }

            let techPostsSelector = '#techPosts';
            if(DW.posts.length > 0) {
                showPosts(techPostsSelector, DW.posts);
            }
            else {
                displayNoPostMessage(techPostsSelector);
            }
        }

    DW.storePosts = 
        (posts)=> {
            DW.posts = [];

            posts.forEach(function(post) {
                if(post.excerpt && post.excerpt.length > 250) {
                    post.excerpt = post.excerpt.slice(0,250) + '...';
                }
                
                DW.posts.push(post);
            }, this);
        }

    DW.getPosts = 
        (postType)=> {
            // if no post data
            if(DW.posts === '') {
                // get post and store it
                $.getJSON('https://raw.githubusercontent.com/davidwesst/dw-blog/gh-pages/content.json')
                    .done((data)=> {
                        DW.storePosts(data.posts);
                    })
                    .fail(()=> {
                        DW.posts = 'error';
                        console.error('An error occured while retrieving blog posts');
                    })
                    .always(()=> {
                        DW.displayPosts();
                    })
            }
        }

    // initialization code
    $(document).ready(()=> {
        if(DW.posts === '') {
            DW.getPosts();
        }
    });
})();