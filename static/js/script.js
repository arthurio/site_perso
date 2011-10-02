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
        updateContact(data);
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

    // POPUP

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

    // END POPUP


    // INTRO
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

    // END INTRO

    // NAV
    $('#banner #nav').slideDown(1000);


    $('#banner #nav li[name=contact]').click(function() {
        POPUP.setContent($('#contact'));
        $('#contact').show();
        POPUP.show();
    });

    // END NAV

    // CONTACT

    var contact_fields = {
        'first_name':$('form[name=mail] input[name=first_name]').val(),
        'last_name':$('form[name=mail] input[name=last_name]').val(),
        'email':$('form[name=mail] input[name=email]').val()
    }

    function updateContact(data) {

        $.each(contact_fields, function(field,i) {
            contact_fields[field] = data.contact[field];
            $('form[name=mail] input[name='+field+']').val(data.contact[field]);
        });
    }

    $('form[name=mail] input[type=text]').focus(function(){
        $(this).removeClass('empty error success');
        $('form[name=mail] img[name='+this.name+'].success').hide();
        $('form[name=mail] img[name='+this.name+'].error').hide();
        if (this.value == contact_fields[this.name]) {
            this.value='';
        }
    });

    $('form[name=mail] input[type=text]').blur(function(){
        if (this.value == '') {
            this.value=contact_fields[this.name];
            $(this).addClass('empty error');
            $(this).removeClass('success');
            $('form[name=mail] img[name='+this.name+'].success').hide();
            $('form[name=mail] img[name='+this.name+'].error').show();
            $('form[name=mail] img[name='+this.name+'].error').mouseover(function(){
                showNotification(this.name,field_required);
            }).mouseout(function(){
                hideNotification(this.name);
            });
        } else {
            $(this).addClass('success');
            $('form[name=mail] img[name='+this.name+'].success').show();
        }

    });

    $('form[name=mail]').submit(function(){
        var action = $(this).attr('action');
        
        $.each(contact_fields, function(field,i) {
            if ($('form[name=mail] input[name='+field+']').val() == contact_fields[field]) {
                $('form[name=mail] input[name='+field+']').val('');
            }
        });
       

        $.post(action, $(this).serialize(),function(json) {
            if (json.status == true) {
                console.log('ok');
            } else {
                $.each(json.errors, function(error,i){
                    $('form[name=mail] input[name='+error+']').addClass('error');
                    if ($('form[name=mail] input[name='+error+']') == ""){
                        $('form[name=mail] input[name='+error+']').val(contact_fields[error]);
                    } else {
                        $('form[name=mail] input[name='+error+']').addClass('empty');
                    }
                    $('form[name=mail] input[name='+error+']').removeClass('success');
                    $('form[name=mail] img[name='+error+'].success').hide();

                    $('form[name=mail] img[name='+error+'].error').mouseover(function(){
                        showNotification(error,json.errors[error][0]);
                    }).mouseout(function(){
                        hideNotification(error);
                    });

                    $('form[name=mail] img[name='+error+'].error').show();

                });
            }
        }, "json");

        return false;
    });

    function showNotification(name,message) {
        $('form[name=mail] div.error[name='+name+']').html(message);
        $('form[name=mail] div.error[name='+name+']').show();
    }

    function hideNotification(name){
        $('form[name=mail] div.error[name='+name+']').hide();
    }

});

