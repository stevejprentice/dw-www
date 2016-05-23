/// <reference path="../../typings/browser.d.ts" />
'use strict';

(function() {
    var content = document.querySelector('#content');
    
    // "middleware"
    page('*', function(ctx,  next){
        if (ctx.init || ctx.hash) {
            next();
        }
        else {
            content.classList.add('transition');
            setTimeout(function(){
                $(document).scrollTop(0);
                content.classList.remove('transition');
                next();
            }, 300);
        }
    });
    
    // base pages
    page('/', index);
    page('/contact', contact);
    page('/about', about);
    
    // redirects
    page('/index', '/');
    
    //
    
    // catch all
    page('*', notFound);
    
    // initialize
    page();
    
    //
    //  ROUTING FUNCTIONS
    //
    function index() {
        get('/views/home.html');
    }
    
    function contact() {
        get('/views/contact.html');
    }
    
    function about() {
        get('/views/about.html');
    }
    
    function notFound() {
        get('/views/404.html');
    }
    
    //
    //  HELPER
    //
    function get(url) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url,true);
        xhr.onreadystatechange = function() {
            if(this.readyState !== 4) return null;  // error handling
            if(this.status !== 200) {
                // error handling
            }
            content.innerHTML = this.responseText;
        }  
        xhr.send();
    }
    
    // 
    //  NAVIGATION MENU
    //
    function toggleMenu() {
        $('#siteNav').toggleClass('show-nav');
        $('.nav-toggle').toggleClass('open');
    }
    
    function closeMenu() {
        $('.nav-toggle').removeClass('open');
        $('nav.site').removeClass('show-nav');
    }
    
    $('.nav-toggle').click(toggleMenu);
    $('nav.site a').click(closeMenu);
})();