/* Author: 

*/

// remap jQuery to $
(function($){
})(window.jQuery);


//Begin Core PunchTab Javascript
$(document).ready(function() {

//var fr_url = '/data/fr.json';
//var en_url =  '/data/en.json';
var common_url = '/static/data/common.json';

//var fr = $.getJson(fr_url);
//var en = $.getJson(en_url);
$.getJSON(common_url, function(data){
    $('#name').html(data.name.first+' '+data.name.last);
    $('#email').html(data.email);
    $('#body').show();
});

});
