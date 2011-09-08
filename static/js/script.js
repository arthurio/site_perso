/* Author: 

*/

// remap jQuery to $
(function($){
})(window.jQuery);


//Begin Core PunchTab Javascript
$(document).ready(function() {

var fr_url = '/static/data/fr.json';
var en_url =  '/static/data/en.json';
var common_url = '/static/data/common.json';

$('#flag_fr').click(function(){
    $.getJSON(fr_url, function(data){
        console.log('fr');
        $('#contact_button_title').html(data.contact_panel);
        $('#resume_button_title').html(data.resume_panel);
    });
});

$('#contact_panel_content img[name=contact_picture]').click(function() {
    var src = $('#contact_panel_content img[name=contact_picture]').attr('src');
    src = src.replace('.png', '_big.png');
    console.log(src);
    POPUP.setContent('<img src="'+src+'" width="100%"/>');
    POPUP.show();
});


$('#flag_en').click(function(){
    $.getJSON(en_url, function(data){
        console.log('en');
        $('#contact_button_title').html(data.contact_panel);
        $('#resume_button_title').html(data.resume_panel);
    });
});

$('#popup .close_button').click(function(){
    POPUP.hide();
});

    POPUP = {
        show: function() {
            $('#border_container').addClass('overlay');
            $('#popup').fadeIn();
        },
        hide: function() {
            $('#border_container').removeClass('overlay');
            $('#popup').slideUp();
        },
        setContent: function(content) {
            $('#popup .content').html(content);
        }
    }

});
