jQuery.urlParam = function (name) {
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
        return null;
    } else {
        return results[1] || 0;
    }
}
jQuery(document).ready(function () {
    jQuery('#search-icon').hover(function () {
        jQuery('#searchBarBackground').animate({height: '30px'});
        jQuery('#search-container').animate({height: '30px'}, function () {
            jQuery('#search-container').css('overflow', 'initial');
        });
        jQuery('#search-icon').animate({opacity: '0.0'});
        return false;
    });
    jQuery(document).on("click", "a.closeBtn", function () {
        jQuery('#searchBarBackground').animate({height: '0px'});
        jQuery('#search-container').animate({height: '0px'}, function () {
            jQuery('#search-container').css('overflow', '');
        });
        jQuery('#search-icon').animate({opacity: '1.0'});
        return false;
    });
    jQuery(document).mouseup(function (e) {
        var $search = jQuery('#form-search');
        if (!$search.is(e.target) && $search.has(e.target).length === 0) {
            jQuery('#searchBarBackground').animate({height: '0px'});
            jQuery('#search-container').animate({height: '0px'}, function () {
                jQuery('#search-container').css('overflow', '');
            });
            jQuery('#search-icon').animate({opacity: '1.0'});
            return false;
        }
    });
});
jQuery(document).ready(function () {
    jQuery(document).on('click', '#page-scroll-arrow', function () {
        jQuery('html,body').animate({scrollTop: window.innerHeight + window.pageYOffset}, 1000);
    });
    jQuery(document).scroll(function () {
        var footerY = jQuery('#footer').offset().top;
        if (window.pageYOffset >= footerY - window.innerHeight) {
            var topWindow = window.pageYOffset - (footerY - window.innerHeight);
            var position = 1 - (topWindow / window.innerHeight);
            jQuery('#page-scroll-arrow').css('opacity', position);
        } else {
            jQuery('#page-scroll-arrow').css('opacity', '');
        }
        if (window.pageYOffset >= footerY && jQuery('#page-scroll-arrow').is(':visible')) {
            jQuery('#page-scroll-arrow').hide();
        } else {
            jQuery('#page-scroll-arrow').show();
        }
    });
});
jQuery(document).on("click", "#site-info-link", function (event) {
    event.preventDefault();
    jQuery('#siteInfo').slideToggle();
});
jQuery(document).ready(function () {
    if (jQuery.urlParam('cm') == '1') {
        jQuery('body').append('<a href="javascript: void(0)" id="fade"></a>');
        jQuery('#fade, #popUpThankYou').css({'filter': 'alpha(opacity=80)'}).fadeIn();
    }
});
jQuery(document).ready(function () {
    if (jQuery.urlParam('cm') == 'info') {
        jQuery('body').append('<a href="javascript: void(0)" id="fade"></a>');
        jQuery('#fade, #popUpEcigThankYou').css({'filter': 'alpha(opacity=80)'}).fadeIn();
    }
});
jQuery(document).on("click", "#vf-notification", function () {
    jQuery('body').append('<a href="javascript: void(0)" id="fade"></a>');
    if (window.mobileResponsive) {
        mobileResponsive.noScroll(1);
    }
    jQuery('#fade, #popUpVFNotification').css({'filter': 'alpha(opacity=80)'}).fadeIn();
    return false;
});
jQuery(document).on("click", "#popUpVFNotification a.popUpClose, #fade", function () {
    if (window.mobileResponsive) {
        mobileResponsive.noScroll(0);
    }
    jQuery('#fade, .popup_block').fadeOut(function () {
        jQuery('#fade').remove();
    });
    return false;
});
jQuery(document).ready(function () {
    if (jQuery('#holidayShipping')) {
        var today = new Date();
        var day = Date.parse(today);
        var priority = Date.parse('December 19, 2014 12:00:00');
        var express = Date.parse('December 22, 2014 12:00:00');
        var overnight = Date.parse('December 23, 2014 12:00:00');
        if (day >= priority) {
            jQuery('#priorityShipping').addClass('past');
        }
        if (day >= express) {
            jQuery('#twoDayExpress').addClass('past');
        }
        if (day >= overnight) {
            jQuery('#holidayShipping').remove();
        }
    }
});