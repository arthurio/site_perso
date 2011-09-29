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
        loadData(fr_url);
    });

    $('#flag_en').click(function(){
        loadData(en_url);
    });

    function loadData(url) {
        $.getJSON(url, function(data){
            changeLang(data);
        });
    }

    function changeLang(data) {
        shake();
        updateIntro(data);
        updateFlags(data);
        updateNav(data);
    }

    function shake() {
        $('#body').effect("shake", { times:3 }, 50);
    }

    function updateIntro(data) {
        intro = data.intro;
    }

    function updateFlags(data) {
        $('#flag_text').html(data.lang);
    }

    function updateNav(data){
        $('#nav li[name=home]').html(data.nav[0]);
        $('#nav li[name=resume]').html(data.nav[1]);
    }

    $('#popup .close_button').click(function(){
        POPUP.hide();
    });

    POPUP = {
        show: function() {
            $('#body').addClass('overlay');
            $('#popup').fadeIn();
        },
        hide: function() {
            $('#body').removeClass('overlay');
            $('#popup').slideUp();
        },
        setContent: function(content) {
            $('#popup .content').html(content);
        }
    }


   setInterval(changeIntro, 7000);

   var previous = 0;

   changeIntro();

   function changeIntro() {
        var random = Math.floor(Math.random()*intro.length);
        if (random == previous) {
            random = (previous + 1) % intro.length;
        }
        previous = random;
        var intro_text = $('#banner .intro p');
        intro_text.fadeOut(1000,function(){
            intro_text.html(intro[random]);
            intro_text.fadeIn(3000);
        });
   }

   showParentheses();

   function showParentheses() {
       $('#banner .begining').fadeIn(3000);
       $('#banner .end').fadeIn(3000);
   }

   $('#banner #nav').slideDown(1000);


   $('#banner #nav li[name=contact]').click(function() {
        POPUP.setContent($('#contact'));
        $('#contact').show();
        POPUP.show();
    });


});

