var responsiveSite=function(){};responsiveSite.prototype={icartResize:function(){if(this.detectResponsive()){if((jQuery(window).height()*.8)>jQuery('.icart-product-view').height()){jQuery('#MB_window').css('height','');jQuery('#MB_header').css('min-height','');}else{jQuery('#MB_window').attr('style','height:85%!important;');jQuery('#MB_header').css('min-height','initial');}}},readCookie:function(name){var nameEQ=name+"=";var ca=document.cookie.split(';');for(var i=0;i<ca.length;i++){var c=ca[i];while(c.charAt(0)==' ')c=c.substring(1,c.length);if(c.indexOf(nameEQ)==0)return c.substring(nameEQ.length,c.length);}
return null;},fullSiteView:function(){var pageview=this.readCookie('fullsite_view');if(jQuery.urlParam('fullsite_view')==0){return false;}else if(jQuery.urlParam('fullsite_view')==1){return true;}else if(pageview==1){return true;}else if(pageview==0){return false;}},summaryResize:function(){if(this.detectResponsive()){if((jQuery(window).height()*.9)>jQuery('#checkout-review-load').height()){jQuery('#onepageCartSummary').css('height','');}else{jQuery('#onepageCartSummary').css('height','85%');}}},noScroll:function(x){if(this.detectResponsive()){if(x===0){jQuery('html, body').removeClass('popup-noscroll');}else{jQuery('html, body').addClass('popup-noscroll');}}},detectMob:function(){if(navigator.userAgent.match(/Android/i)||navigator.userAgent.match(/webOS/i)||navigator.userAgent.match(/iPhone/i)||navigator.userAgent.match(/iPad/i)||navigator.userAgent.match(/iPod/i)||navigator.userAgent.match(/BlackBerry/i)||navigator.userAgent.match(/Windows Phone/i)){return true;}},detectWidth:function(){if(window.innerWidth<997){return true;}},detectResponsive:function(){if(this.detectWidth()&&!this.fullSiteView()){return true;}},detectNotResponsive:function(){if(!this.detectWidth()&&!this.fullSiteView()){return true;}}};var mobileResponsive=new responsiveSite();jQuery(document).ready(function(){jQuery(window).resize(function(){if(mobileResponsive.detectResponsive()){if(jQuery('#m-menu-btn').length==0){jQuery('body').addClass('responsive');jQuery('#topWrapper').prepend('<a href="javascript: void(0)" id="m-menu-btn" class="top-btn"></a>');jQuery('#topMenu').prepend('<a href="javascript: void(0)" id="menu-close-btn">Close</a>');jQuery('#checkoutMenu').prepend('<a href="javascript: void(0)" id="checkout-menu-close-btn"><span></span>Menu</a><a href="javascript: void(0)" id="checkout-menu-shop-btn"><span></span>Shop More</a>');jQuery('#onepageCartSummary').prepend('<a href="javascript: void(0)" class="onepageCartClose">Close</a>');jQuery('#onepageCartSummary .order-summary').prepend('<thead><tr><td colspan="2"><h3 id="review-order-title">Review Your Order</h3><div class="clear"></div></td></tr></thead>');jQuery('#top-link-cart').clone().prependTo('#topWrapper').addClass('top-btn').html(jQuery('#top-link-cart.top-btn .top-link-cart'));jQuery('#mainNav .parent>ul').before('<a href="javascript: void(0)" class="sub-nav-btn"></a>');jQuery('#mainNav .parent .sub ul').before('<a href="javascript: void(0)" class="child-nav-btn"></a>');jQuery('#my-account-title').append('<a href="javascript: void(0)" id="m-account-menu-btn"></a>');jQuery('#product-img-box .product-image').prepend('<div id="mobile-overlay"></div>');jQuery('#mainSlider .mainBannerImg img').each(function(){var mImg=jQuery(this).attr('src').replace('images/main_','images/mobile/main_');jQuery(this).attr('src',mImg);});jQuery('.imageFloatRight, .imageCenter').each(function(){var mWidth=jQuery(this).attr('width')+'px';jQuery(this).css({'max-width':mWidth});});jQuery('#fade').remove();jQuery('.popup_block').css({'display':''});jQuery('#popUpHDPOptions').css({'display':''}).append('<div class="boxBottom1">&nbsp;</div>');jQuery('#popUpHDPOptions #payment-button').after('<a href="javascript: void(0)" id="close-subscription-form" class="popUpClose grayButton">Cancel</a>');jQuery('#popUpClubOptions').css({'display':''}).append('<div class="boxBottom1">&nbsp;</div>');jQuery('#popUpClubOptions #step-4').after('<a href="javascript: void(0)" id="close-club-form" class="popUpClose grayButton">Cancel</a>');jQuery('#footerSupport').after('<a href="'+window.location.protocol+'//'+ window.location.hostname+ window.location.pathname+'?fullsite_view=1" id="full-site-view-link">Full Site</a>');jQuery('.pdf-fade').remove();jQuery('#popUpPdf .popup-content').html('');}
jQuery('#new-account-form-loading-wait').css({'width':jQuery(window).width()*.8});jQuery('#forgot-form-loading-wait').css({'width':(jQuery(window).width()*.9)*.9});jQuery('.checkout-left .please-wait').css({'width':jQuery(window).width()});jQuery('#onepageCartSummary .please-wait').css({'width':jQuery(window).width()*.9});mobileResponsive.icartResize();mobileResponsive.summaryResize();}else if(mobileResponsive.detectNotResponsive()){jQuery('body').removeClass('responsive');jQuery('html, body').removeClass('popup-noscroll mobile-menu-visible');jQuery('#m-menu-btn, #menu-close-btn, #menu-fade, .sub-nav-btn, .child-nav-btn, #top-link-cart.top-btn, #m-account-menu-btn, #checkout-menu-close-btn, #checkout-menu-shop-btn, #cart-fade, .onepageCartClose, #onepageCartSummary .order-summary thead, #popUpHDPOptions .boxBottom1, #close-subscription-form, #popUpClubOptions .boxBottom1, #close-club-form, #popUpLargeImage, .largeImageFade, #full-site-view-link, #mobile-overlay').remove();jQuery('#topMenuContainer, #mainNav .parent>ul, #mainNav .parent .sub ul, #onepageCartSummary, #MB_content .icart-product-view .popup_block').css({'display':''});jQuery('#topMenu').css({'left':''});jQuery('#mainSlider .mainBannerImg img').each(function(){var mImg=jQuery(this).attr('src').replace('images/mobile/main_','images/main_');jQuery(this).attr('src',mImg);});jQuery('.imageFloatRight, .imageCenter').css({'max-width':''});jQuery('#new-account-form-loading-wait, #forgot-form-loading-wait, .checkout-left .please-wait, #onepageCartSummary .please-wait').css({'width':''});jQuery('#onepageCartSummary, #MB_window').css('height','')
jQuery('#MB_header').css('min-height','');jQuery('#m-account-menu-btn').removeClass('active');jQuery('#my-account-nav, #boxContentHDPContainer, #boxContentClubContainer').css({'display':''});jQuery('#boxFlavorContainer .eliquid-container').scrollTop(0);}});if(mobileResponsive.fullSiteView()){jQuery('meta[name="viewport"], meta[name="apple-mobile-web-app-capable"]').remove();jQuery('#corporate-address').after('<a href="'+window.location.protocol+'//'+ window.location.hostname+ window.location.pathname+'?fullsite_view=0" id="mobile-site-view-link">Back to Mobile Site</a>');}
if(mobileResponsive.detectResponsive()){jQuery('body').addClass('responsive');jQuery('#topWrapper').prepend('<a href="javascript: void(0)" id="m-menu-btn" class="top-btn"></a>');jQuery('#topMenu').prepend('<a href="javascript: void(0)" id="menu-close-btn">Close</a>');jQuery('#checkoutMenu').prepend('<a href="javascript: void(0)" id="checkout-menu-close-btn"><span></span>Menu</a><a href="javascript: void(0)" id="checkout-menu-shop-btn"><span></span>Shop More</a>');jQuery('#onepageCartSummary').prepend('<a href="javascript: void(0)" class="onepageCartClose">Close</a>');jQuery('#onepageCartSummary .order-summary').prepend('<thead><tr><td colspan="2"><h3 id="review-order-title">Review Your Order</h3><div class="clear"></div></td></tr></thead>');jQuery('#top-link-cart').clone().prependTo('#topWrapper').addClass('top-btn').html(jQuery('#top-link-cart.top-btn .top-link-cart'));jQuery('#mainNav .parent>ul').before('<a href="javascript: void(0)" class="sub-nav-btn"></a>');jQuery('#mainNav .parent .sub>ul').before('<a href="javascript: void(0)" class="child-nav-btn"></a>');jQuery('#my-account-title').append('<a href="javascript: void(0)" id="m-account-menu-btn"></a>');jQuery('#product-img-box .product-image').prepend('<div id="mobile-overlay"></div>');jQuery('#mainSlider .mainBannerImg img').each(function(){var mImg=jQuery(this).attr('src').replace('images/main_','images/mobile/main_');jQuery(this).attr('src',mImg);});jQuery('.imageFloatRight, .imageCenter').each(function(){var mWidth=jQuery(this).attr('width')+'px';jQuery(this).css({'max-width':mWidth});});jQuery('#popUpHDPOptions').css({'display':''}).append('<div class="boxBottom1">&nbsp;</div>');jQuery('#popUpHDPOptions #payment-button').after('<a href="javascript: void(0)" id="close-subscription-form" class="popUpClose grayButton">Cancel</a>');jQuery('#popUpClubOptions').css({'display':''}).append('<div class="boxBottom1">&nbsp;</div>');jQuery('#popUpClubOptions #step-4').after('<a href="javascript: void(0)" id="close-club-form" class="popUpClose grayButton">Cancel</a>');jQuery('#new-account-form-loading-wait').css({'width':jQuery(window).width()*.8});jQuery('#forgot-form-loading-wait').css({'width':(jQuery(window).width()*.9)*.9});jQuery('.checkout-left .please-wait').css({'width':jQuery(window).width()});jQuery('#onepageCartSummary .please-wait').css({'width':jQuery(window).width()*.9});jQuery('#footerSupport').after('<a href="'+window.location.protocol+'//'+ window.location.hostname+ window.location.pathname+'?fullsite_view=1" id="full-site-view-link">Full Site</a>');}
jQuery(document).on("click","#m-menu-btn",function(){mobileResponsive.noScroll(1);jQuery('#topWrapper').append('<a href="javascript: void(0)" id="menu-fade"></a>');jQuery('html, body').addClass('mobile-menu-visible');jQuery('#topMenuContainer, #menu-fade').fadeIn(function(){jQuery('#topMenu, #checkoutMenu').animate({left:'0'});});return false;});jQuery(document).on("click","#menu-close-btn, #checkout-menu-close-btn, #menu-fade",function(){mobileResponsive.noScroll(0);jQuery('html, body').removeClass('mobile-menu-visible');jQuery('#topMenu, #checkoutMenu').animate({left:'-100%'},function(){jQuery('#topMenuContainer, #menu-fade').fadeOut(function(){jQuery('#menu-fade').remove();});});return false;});jQuery(document).on("click",".sub-nav-btn",function(){jQuery(this).toggleClass("active");jQuery(this).next().slideToggle("slow");jQuery('.sub-nav-btn').not(this).removeClass("active");jQuery('.sub-nav-btn').not(this).next().slideUp("slow");return false;});jQuery(document).on("click","#mainNav>.parent>a",function(event){if(mobileResponsive.detectResponsive()){event.preventDefault();jQuery(this).next().trigger('click');}else if(mobileResponsive.detectMob()&&mobileResponsive.fullSiteView()){event.preventDefault();}});jQuery(document).on("click",".child-nav-btn",function(){jQuery(this).toggleClass("active");jQuery(this).next().slideToggle("slow");jQuery('.child-nav-btn').not(this).removeClass("active");jQuery('.child-nav-btn').not(this).next().slideUp("slow");return false;});jQuery(document).on("click","#mainNav .parent>ul>.sub>a",function(event){if(mobileResponsive.detectResponsive()){event.preventDefault();jQuery(this).next().trigger('click');}});jQuery(document).on("click","#m-account-menu-btn",function(){jQuery('#m-account-menu-btn').toggleClass("active");jQuery('#my-account-nav').slideToggle("slow");return false;});jQuery(document).on("click","#my-account-title",function(){if(mobileResponsive.detectResponsive()){jQuery('#m-account-menu-btn').trigger('click');}});jQuery(document).on("click","#checkout-menu-shop-btn",function(){window.location.href=window.location.protocol+'//'+window.location.host+'/';jQuery('#m-account-menu-btn').toggleClass("active");jQuery('#my-account-nav').slideToggle("slow");return false;});jQuery(document).on("click","#m-cart-btn, #m-order-details",function(){mobileResponsive.noScroll(1);jQuery('body').append('<a href="javascript: void(0)" id="cart-fade"></a>');jQuery('#cart-fade, #onepageCartSummary').css({'filter':'alpha(opacity=80)'}).fadeIn();mobileResponsive.summaryResize();return false;});jQuery(document).on("click","a.onepageCartClose, #cart-fade",function(){mobileResponsive.noScroll(0);jQuery('#cart-fade, #onepageCartSummary').fadeOut(function(){jQuery('#cart-fade').remove();});return false;});jQuery(document).on("click","#hdpOptions",function(){if(mobileResponsive.detectResponsive()){jQuery('#boxContentHDPContainer').slideUp(function(){jQuery('#popUpHDPOptions').slideDown();jQuery('html,body').animate({scrollTop:jQuery('body')},500);jQuery('body').append('<a href="javascript: void(0)" id="fade"></a>');jQuery('.enrollhdp #fade, .checkout-onepage-success #fade').css({'display':'block'});});}else if(mobileResponsive.detectNotResponsive()||mobileResponsive.fullSiteView()){jQuery('body').append('<a href="javascript: void(0)" id="fade"></a>');jQuery('#fade , #popUpHDPOptions').css({'filter':'alpha(opacity=80)'}).fadeIn();return false;}});jQuery(document).on("click","#popUpHDPOptions a.popUpClose, #fade",function(){if(mobileResponsive.detectResponsive()){jQuery('#popUpHDPOptions').slideUp(function(){jQuery('#fade').remove();jQuery('#boxContentHDPContainer').slideDown();jQuery('html,body').animate({scrollTop:jQuery('body')},500);});}else if(mobileResponsive.detectNotResponsive()||mobileResponsive.fullSiteView()){jQuery('#fade, #popUpHDPOptions').fadeOut(function(){jQuery('#fade').remove();});return false;}});jQuery(document).on("click",'#MB_close',function(){});jQuery('a.hover').hover(function(e){if(mobileResponsive.detectNotResponsive()||mobileResponsive.fullSiteView()){var href=jQuery(this).attr('href');var el=jQuery(this).parent();jQuery('<img id="largeImage" src="'+ href+'" alt="image" />').appendTo(el);}},function(){jQuery('#largeImage').remove();});jQuery('a.hover').mousemove(function(e){if(mobileResponsive.detectNotResponsive()||mobileResponsive.fullSiteView()){var parentOffset=jQuery(this).parent().offset();var elx=e.pageX- parentOffset.left;var ely=e.pageY- parentOffset.top;jQuery('#largeImage').css({'top':ely+ 20,'left':elx- 300});}});jQuery('a.hover').click(function(e){if(mobileResponsive.detectResponsive()){e.preventDefault();var href=jQuery(this).attr('href');jQuery('body').append('<div id="popUpLargeImage" class="popup_block"><a href="javascript: void(0)" class="popUpClose">Close</a><div class="popup-content"><img src="'+href+'" /></div></div><a href="javascript: void(0)" id="fade" class="largeImageFade"></a>');jQuery('#fade , #popUpLargeImage').css({'filter':'alpha(opacity=80)'}).fadeIn();}else if(mobileResponsive.detectNotResponsive()||mobileResponsive.fullSiteView()){e.preventDefault();}});jQuery(document).on("click",".clubsubscription .enrollBtn, #clubOptions",function(){if(mobileResponsive.detectResponsive()){jQuery('#boxContentClubContainer').slideUp(function(){jQuery('#popUpClubOptions').slideDown();jQuery('html,body').animate({scrollTop:jQuery('body')},500);jQuery('body').append('<a href="javascript: void(0)" id="fade"></a>');jQuery('#fade').css({'display':'block'});});}else if(mobileResponsive.detectNotResponsive()||mobileResponsive.fullSiteView()){jQuery('body').append('<a href="javascript: void(0)" id="fade"></a>');jQuery('#fade, #popUpClubOptions').css({'filter':'alpha(opacity=80)'}).fadeIn();return false;}});jQuery(document).on("click",".clubsubscription a.popUpClose, #fade",function(){if(mobileResponsive.detectResponsive()){jQuery('#popUpClubOptions').slideUp(function(){jQuery('#fade').remove();jQuery('#boxContentClubContainer').slideDown();jQuery('html,body').animate({scrollTop:jQuery('body')},500);});}else if(mobileResponsive.detectNotResponsive()||mobileResponsive.fullSiteView()){jQuery('#fade, #popUpClubOptions').fadeOut(function(){jQuery('#fade').remove();});return false;}});});window.addEventListener("orientationchange",function(){mobileResponsive.icartResize();},false);