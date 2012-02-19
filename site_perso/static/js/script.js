/* Author: Arthur Rio

*/

// remap jQuery to $
(function($){
})(window.jQuery);

//Begin Javascript
$(document).ready(function() {


    var fr_url = '/static/data/fr.json',
        en_url =  '/static/data/en.json',
        common_url = '/static/data/common.json',
        previous, send_email_clicked, tour,
        slide_tour, contact_fields, slider_init,
        common_content, key_lock = false;

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

    // COMMON   

    common_content = {
        home: ['left', 'right'],
        resume: ['right', 'left'],
        tour: ['right', 'left']
    };

    function hideId(id) {
        if (!$('#'+id).is(":visible")){
            $.each(common_content, function (key, value) {
                if ($('#'+key).is(":visible")) {
                    var direction = common_content[id][0] === value[0] ? value[1] : value[0];
                    $('#'+key).hide('slide', {'direction':direction},1000);
                }
            });
        }
        $(document).unbind('keydown', setArrowHover);
    }

    function showId(id) {
        if (!$('#'+id).is(":visible") || key_lock){
            $('#'+id).show('slide',{'direction':common_content[id][0]},1000);
            key_lock = false;
        }
    }

    // POPUP

    POPUP = {
        show: function() {
            $('#main_container').addClass('overlay');
            $('#popup').fadeIn();
            $(document).bind('keydown', POPUP.hide);
            $('#popup .close_button').bind('click', POPUP.hide);
        },
        hide: function(e) {
            if (typeof e != "undefined") {
                if (e.type == "click" || e.keyCode == 27) {
                    $('#popup .close_button').unbind('click');
                    $(document).unbind('keydown', POPUP.hide);
                    $('#main_container').removeClass('overlay');
                    $('#popup').hide('clip',700);
                }
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
    };


    function removeEmbed() {
        $('embed').remove();
    }

    // END POPUP


    // INTRO
    setInterval(changeIntro, 7000);

    previous = 0;

    changeIntro();

    function changeIntro() {
         var random = Math.floor(Math.random()*intro.length),
             intro_text;
         if (random == previous) {
             random = (previous + 1) % intro.length;
         }
         previous = random;
         intro_text = $('#banner .intro p');
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
            if (this.value === '') {
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
            if (this.value === '') {
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

        send_email_clicked = false;
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
                    if (json.status === true) {
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
                            if (field.val() === ""){
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

                            $('form[name=mail] img[name='+error+'].error').show();

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

    contact_fields = {
        'first_name':$('form[name=mail] input[name=first_name]').val(),
        'last_name':$('form[name=mail] input[name=last_name]').val(),
        'email':$('form[name=mail] input[name=email]').val(),
        'message':$('form[name=mail] textarea[name=message]').text()
    };

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
        $('#shortcuts').hide();
        hideId('home');
        key_lock = true;
        showId('home');
    });
    $('#nav li[name=home]').click();

    function updateHome(data) {
        $('#tired').html(data.home.tired);
        $('#minutes').html(data.home.minutes);
        $('#take_tour h2').html(data.home.take_tour);
    }

// TOUR

    slider_init = false;
    $('#take_tour').click(function() {
        $('#shortcuts').show();
        hideId('tour');
        key_lock = true;
        showId('tour');
        if (!slider_init) {
            slider.current = 1;
            slider.init();
            slider_init = true;
        }
        initArrows();
    });

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

    tour = {
        formation: {attribute: "tooltip", defaultPosition:"top", maxWidth: '255px', edgeOffset: 9},
        technologies: {attribute: "tooltip", maxWidth: '255px', edgeOffset: 0},
        international: {attribute: "tooltip", maxWidth: '255px', edgeOffset: 0},
        sports: {attribute: "tooltip", maxWidth: '255px', edgeOffset: 0}
    };

    function updateTour(data) {
        $('#tour li').html(function (source){
            $(this).html(data.tour.menu[source]);
        });
        $('#tour_content h1').html(data.construction);

        $.each(tour, function (key, value) {
            $('#'+key+' img').attr('tooltip', function() {
                return data.tour[key][$(this).attr('class').split(' ')[0]];
            });
            $('#'+key+' .data').attr('tooltip', function() {
                if (data.tour[key][$(this).attr('class').split(' ')[0]] != "undefined") {
                    return data.tour[key][$(this).attr('class').split(' ')[0]];
                }
            });

            bindTooltip(key, value);
        });
    }

    function bindTooltip(id, params) {
        $('#'+id+' img').tipTip(params);
        $('#'+id+' .data').tipTip(params);
    }

    function bindAllTooltip() {
        $.each(tour, function(key, value) {
            bindTooltip(key, value);
        });
    }

    // initialize the tooltips
    bindAllTooltip();

    // FORMATION

// FOOTER
//    $('#footer').show('slide',{'direction':'down'},1000);
    $('#footer').show();

    function updateFooter(data) {
        $('#key_tour').html(data.key_notification.tour_move);
    }

// RESUME
    $('#nav li[name=resume]').click(function() {
        $('#shortcuts').hide();
        hideId('resume');
        key_lock = true;
        showId('resume');
    });

    
    function updateResume(data) {
        $('#resume .pdf_container h1').html(data.pdf.title);
        $('#resume .pdf_container label[name=en]').html(data.pdf.en);
        $('#resume .pdf_container label[name=fr]').html(data.pdf.fr);
    }
});

/* for IE */
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(obj, start) {
         for (var i = (start || 0), j = this.length; i < j; i++) {
             if (this[i] === obj) { return i; }
         }
         return -1;
    };
}

