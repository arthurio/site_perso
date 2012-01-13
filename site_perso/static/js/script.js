/* Author: Arthur Rio

*/

// remap jQuery to $
(function($){
})(window.jQuery);

//Begin Javascript
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
        updateIntro(data);
        updateFlags(data);
        updateNav(data);
        updateContact(data);
        updateResume(data);
        updateHome(data);
        updateTour(data);
        updateFooter(data);
    }

    function shake(html) {
        html.effect("shake", { times:3 }, 50);
    }

    function explode(html) {
        html.show("explode", 1000);
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

    POPUP = {
        show: function() {
            $('#main_container').addClass('overlay');
            $('#popup').fadeIn();
            $(document).bind('keydown', POPUP.hide);
        },
        hide: function(e) {
            if (e.keyCode == 27) {
                $('#popup .close_button').unbind('click');
                $(document).unbind('keydown', POPUP.hide);
                $('#main_container').removeClass('overlay');
                $('#popup').hide('clip',700);
            }
        },
        send: function() {
            $('#popup #sound').append('<embed src="/static/sound/send.wav" autostart="true" hidden="true" loop="false"/>');
            $('#main_container').removeClass('overlay');
            $('#popup').hide("drop", { direction: "right" }, 1000);
            setTimeout(removeEmbed,8000);
        },
        setContent: function(content) {
            $('#popup .content').html(content);
        }
    }


    function removeEmbed() {
        $('embed').remove();
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
        
        $('#popup .close_button').click(function(){
            cleanEmailForm();
            POPUP.hide();
        });

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

        $('form[name=mail] textarea').focus(function(){
            $(this).removeClass('empty error success');
            $('form[name=mail] img[name='+this.name+'].success').hide();
            $('form[name=mail] img[name='+this.name+'].error').hide();
            if (this.value == contact_fields[this.name]) {
                this.value='';
            }
        });

        $('form[name=mail] textarea').blur(function(){
            if (this.value == '') {
                this.value = contact_fields[this.name];
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

        var send_email_clicked = false;
        $('form[name=mail]').submit(function(){

            if (!send_email_clicked) {
                send_email_clicked = true;
                var action = $(this).attr('action');
                
                $.each(contact_fields, function(field,i) {
                    if (field == 'message') {
                        if ($('form[name=mail] textarea[name='+field+']').val() == contact_fields[field]){ 
                            $('form[name=mail] textarea[name='+field+']').val('');
                        }
                    } else {
                        if ($('form[name=mail] input[name='+field+']').val() == contact_fields[field]) {
                            $('form[name=mail] input[name='+field+']').val('');
                        }
                    }
                });
                

                $.post(action, $(this).serialize(),function(json) {
                    if (json.status == true) {
                        POPUP.send();
                        cleanEmailForm();
                    } else {

                        shake($('#popup'));
                        $.each(json.errors, function(error,i){
                            var field;
                            if (error == 'message') {
                                field = $('form[name=mail] textarea[name='+error+']');
                            } else {
                                field = $('form[name=mail] input[name='+error+']');
                            }
                            field.addClass('error');
                            if (field.val() == ""){
                                field.val(contact_fields[error]);
                                field.addClass('empty');
                            } else {
                                field.removeClass('empty');
                            }
                            field.removeClass('success');

                            $('form[name=mail] img[name='+error+'].success').hide();

                            $('form[name=mail] img[name='+error+'].error').mouseover(function(){
                                showNotification(error,json.errors[error][0]);
                            }).mouseout(function(){
                                hideNotification(error);
                            });

                            $('form[name=mail] img[name='+error+'].error').show()

                        });
                        send_email_clicked = false;
                    }
                }, "json");
            }

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

    // END NAV

    // CONTACT

    var contact_fields = {
        'first_name':$('form[name=mail] input[name=first_name]').val(),
        'last_name':$('form[name=mail] input[name=last_name]').val(),
        'email':$('form[name=mail] input[name=email]').val(),
        'message':$('form[name=mail] textarea[name=message]').text()
    }

    function updateContact(data) {
        $.each(contact_fields, function(field,i) {
            contact_fields[field] = data.contact[field];
            var input;
            if (field == 'message') {
                input = $('form[name=mail] textarea[name='+field+']');
            } else {
                input = $('form[name=mail] input[name='+field+']');
            }
            $('form[name=mail] img[name='+field+'].success').hide();
            $('form[name=mail] img[name='+field+'].error').hide();
            input.val(data.contact[field]);
            input.removeClass('error success');
            input.addClass('empty');
        });
    }

    function cleanEmailForm() {
        updateContact({'contact':contact_fields});
    }

    
// HOME
    $('#nav li[name=home]').click(function() {
        hideRight('home');
        showRight($('#home'));
    });
    $('#nav li[name=home]').click();

    function updateHome(data) {
        $('#bored').html(data.home.bored);
        $('#minutes').html(data.home.minutes);
        $('#take_tour h2').html(data.home.take_tour);
    }

    $('#take_tour').click(function() {
        hideRight('tour');
        showRight($('#tour'));
        slider.init();
        initArrows();
    });

// TOUR

    function updateTour(data) {
        $('#tour li').html(function(source){
            $(this).html(data.tour.menu[source]);
        });
        $('#tour_content h1').html(data.construction);
    }

    function initArrows() {
        $(document).bind('keydown', setArrowHover);
    }
    
    function setArrowHover(e) {
        if (e.keyCode == '39') {
            $('#tour #right_arrow').addClass('hover');
            setTimeout(removeArrowHover, 100);
        } else if (e.keyCode == '37') {
            $('#tour #left_arrow').addClass('hover');
            setTimeout(removeArrowHover, 100);
        }
    }

    function removeArrowHover() {
        $('#tour img').removeClass('hover');
    }

// FOOTER
    $('#footer').show('slide',{'direction':'down'},1000);

    function updateFooter(data) {
        $('#key_tour').html(data.key_notification.tour_move+'&nbsp;'+data.key_notification.tour);
        $('#key_popup').html(data.key_notification.contact_popup+'&nbsp;'+data.key_notification.contact);
    }

// RESUME
    $('#nav li[name=resume]').click(function() {
        hideRight('resume');
        showRight($('#resume'));
    });

    
    function updateResume(data) {
        $('#resume .pdf_container h1').html(data.pdf.title);
        $('#resume .pdf_container label[name=en]').html(data.pdf.en);
        $('#resume .pdf_container label[name=fr]').html(data.pdf.fr);
    }


// COMMON   

    var content = ['home','resume','tour'];
    function hideRight(element) {
        if (!$('#'+element).is(":visible")){
            for (id in content) {
                if ($('#'+content[id]).is(":visible")) {
                    $('#'+content[id]).hide('slide',{'direction':'right'},1000);
                }
            }
        }
        $(document).unbind('keydown', setArrowHover);
    }

    function showRight(element) {
        if (!element.is(":visible") || key_lock){
            element.show('slide',{'direction':'left'},1000);
            key_lock = false;
        }
    }

    function showLeft(element) {
        if (!element.is(":visible") || key_lock){
            element.show('slide',{'direction':'right'},1000);
            key_lock = false;
        }
    }

    function simpleHide(ids) {
        $.each(ids, function(i) {
            $('#'+ids[i]).hide();
        });
    }

});
