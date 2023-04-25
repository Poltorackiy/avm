(function($) {
    $('.multilevel .dropdown-menu > *').on('mouseenter click', function(e) {
        var elem = $(this);
        elem.parent().find('.dropdown-menu').removeClass('show');
        let menu = elem.find('.dropdown-menu').first();
        
        if (menu.length) {
            menu.addClass('show');
            e.stopPropagation();
        }   
        
    }); 
    
    $('#TypeProject').on('click', function(e) {
        $('#toggle_me').removeClass('show');
    });  


    $('body').click( function() {
        $('.multilevel .dropdown-menu').removeClass('show');
    });


    
})(jQuery);

