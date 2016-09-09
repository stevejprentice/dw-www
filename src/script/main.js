(function() {
    'use strict';
    window.DW = { };

    DW.posts = '';
    DW.talks = '';

    DW.displayPosts = 
        function(postType) {
            
            function showPosts(listSelector, posts) {
                $(listSelector).empty();

                for(let i = 0; i < 5 && i < posts.length; i++) {
                    let currPost = posts[i];
                    let content = [];
                    content.push('<li>');
                    content.push('<a class="post" href="' + currPost.permalink + '">');

                    content.push('<article class="sidebar">');
                    content.push('<div>' + moment(currPost.date).format('YYYY') + '</div>');
                    content.push('<div>' + moment(currPost.date).format('MMM') + '</div>');
                    content.push('<div>' + moment(currPost.date).format('DD') + '</div>');
                    content.push('</article>');

                    content.push('<article class="content">');

                    content.push('<h4>');
                    content.push(currPost.title);
                    content.push('</h4>');

                    if(currPost.tags && currPost.tags.length > 0) {
                        content.push('<h6 class="subtitle">');
                        content.push('Tagged with ');
                        currPost.tags.forEach(function(tag, index, arr) {
                            content.push('<span>');
                            content.push(tag.name);
                            if(index !== arr.length-1) {
                                content.push(', ');
                            }
                            content.push(' ');
                            content.push('</span>');
                        }, this);

                        content.push('</h6>');
                    }

                    content.push('</article>');
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

    DW.displayTalks = 
        function() {
            
            function showTalks(listSelector, talks) {
                $(listSelector).empty();

                for(let i = 0; i < 5 && i < talks.length; i++) {
                    let currTalk = talks[i];
                    let content = [];
                    content.push('<li>');
                    content.push('<a class="post" href="' + currTalk.eventUrl + '">');

                    content.push('<article class="sidebar">');
                    content.push('<div>' + moment(currTalk.date).format('YYYY') + '</div>');
                    content.push('<div>' + moment(currTalk.date).format('MMM') + '</div>');
                    content.push('<div>' + moment(currTalk.date).format('DD') + '</div>');
                    content.push('</article>');

                    content.push('<article class="content">');

                    content.push('<h4>');
                    content.push(currTalk.title);
                    content.push('</h4>');

                    content.push('<h6 class="subtitle">');
                    content.push(currTalk.event);
                    content.push('</h6>');

                    content.push('</article>');
                    content.push('</a>');
                    content.push('</li>');

                    $(listSelector).append(content.join(''));
                }
            }

            function displayNoTalkMessage(listSelector) {
                $(listSelector).empty();

                $(listSelector).append('<li>' + 'There are currently no talks available.' + '</li>');
            }

            let techPostsSelector = '#talkList';
            if(DW.talks.length > 0) {
                showTalks(techPostsSelector, DW.talks);
            }
            else {
                displayNoTalkMessage(techPostsSelector);
            }
        }

    DW.storePosts = 
        function(posts) {
            DW.posts = [];

            posts.forEach(function(post) {
                if(post.excerpt && post.excerpt.length > 250) {
                    post.excerpt = post.excerpt.slice(0,250) + '...';
                }
                
                DW.posts.push(post);
            }, this);
        }
    
    DW.storeTalks = 
        function(talks) {
            DW.talks = [];

            talks.forEach(function(talk) {
                if(talk.excerpt && talk.excerpt.length > 250) {
                    talk.excerpt = talk.excerpt.slice(0,250) + '...';
                }
                
                DW.talks.push(talk);
            }, this);
        }

    DW.getPosts = 
        function(postType) {
            // if no post data
            if(DW.talks === '') {
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

    DW.getTalks =
        function() {
            // if no post data
            if(DW.talks === '') {
                // get post and store it
                $.getJSON('https://raw.githubusercontent.com/davidwesst/dw-talks/master/_data/talks.json')
                    .done((data)=> {
                        DW.storeTalks(data.talks);
                    })
                    .fail(()=> {
                        DW.talks = 'error';
                        console.error('An error occured while retrieving talks');
                    })
                    .always(()=> {
                        DW.displayTalks();
                    })
            }
        }

    // initialization code
    $(document).ready(()=> {
        if(DW.posts === '') {
            DW.getPosts();
        }

        if(DW.talks === '') {
            DW.getTalks();
        }
    });
})();