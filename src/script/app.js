/// <reference path="../../typings/browser.d.ts" />
'use strict';

(function() {
    // setup single-page navigation
    page('/', index);
    page('/index', index);
    page('/contact', contact);
    page();
    
    function index() {
        alert('go to index');
    }
    
    function contact() {
        alert('go to contact');        
    }
    
})();