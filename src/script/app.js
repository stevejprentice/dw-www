/// <reference path="../../typings/browser.d.ts" />
'use strict';

(function() {
    // base pages
    page('/', index);
    page('/contact', contact);
    
    // redirects
    page('/index', '/');
    
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
            if(this.readyState !== 4) return null;
            if(this.status !== 200) {
                
            }
            document.querySelector('#main p').innerHTML = this.responseText;
        }  
        xhr.send();
    }
    
})();