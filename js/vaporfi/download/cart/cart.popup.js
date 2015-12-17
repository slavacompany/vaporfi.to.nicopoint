
// ID.me Section
jQuery(document).ready(function() {
    jQuery(document).on("click", "#idme-discount", function () {
        jQuery('#idme-content').show();
        jQuery('#idme-discount').hide();
    });
});
// Popup Windows
jQuery(document).ready(function() {
    jQuery(document).on("click", "#previewGiftCard", function () {
        jQuery('body').append('<a href="javascript: void(0)" id="fade"></a>');
        if(window.mobileResponsive){mobileResponsive.noScroll(1);}
        jQuery('#fade, #popUpGiftCard').css({ 'filter': 'alpha(opacity=80)' }).fadeIn();
        return false;
    });
    jQuery(document).on("click", ".pop-up-link", function () {
        if(jQuery(this).parents('.icart-product-view').length > 0){
            if(mobileResponsive.detectResponsive()){
                jQuery('#popUp'+jQuery(this).attr('id')).show();
                jQuery('#MB_close').hide();
            }
            return false;
        }
        jQuery('body').append('<a href="javascript: void(0)" id="fade"></a>');
        if(window.mobileResponsive){mobileResponsive.noScroll(1);}
        jQuery('#fade').css({ 'filter': 'alpha(opacity=80)' }).fadeIn();
        jQuery('#popUp'+jQuery(this).attr('id')).css({ 'filter': 'alpha(opacity=80)' }).fadeIn();
        return false;
    });
    jQuery(document).on("click", "a.popUpClose, #fade", function () {
        if(jQuery(this).parents('.icart-product-view').length > 0){
            if(mobileResponsive.detectResponsive()){
                jQuery('.popup_block').hide();
                jQuery('#MB_close').show();
            }
            return false;
        }
        if(window.mobileResponsive){mobileResponsive.noScroll(0);}
        jQuery('#fade, #popUpGiftCard, .popup_block, .popup_block_img_compare').fadeOut(function () {
            jQuery('#fade').remove();
        });
        return false;
    });
});
/* iCart */
jQuery(document).ready(function() {
    //iCart
    if(window.iCart){
        iCart.overlay = true;
        iCart.overlayClose = true;
        iCart.title = 'Your';
        iCart.width = 790;
    }
    jQuery(document).on("mouseenter", ".icart-product-view .question-link", function(e){
        if(mobileResponsive.detectNotResponsive() || mobileResponsive.fullSiteView()){
            jQuery('#popUp'+jQuery(this).attr('id')).show();
            jQuery(this).removeAttr("title")
            var offset = jQuery(this).offset()
            var parentOffset = jQuery(this).closest('.icart-product-view').offset();
            var elx = offset.left - parentOffset.left;
            var ely = offset.top - parentOffset.top;
            jQuery('#popUp'+jQuery(this).attr('id')).css({'top':ely + 20,'left':elx - 190});
        }
    });
    jQuery(document).on("mouseleave", ".icart-product-view .question-link", function(e){
        if(mobileResponsive.detectNotResponsive() || mobileResponsive.fullSiteView()){
            jQuery('#popUp'+jQuery(this).attr('id')).hide();
            jQuery('#popUp'+jQuery(this).attr('id')).css({'top':'','left':'','display':''});
        }
    });
});