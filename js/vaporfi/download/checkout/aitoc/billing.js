var AitBilling=Class.create(AitAddress,{guestCaptcha:null,registerCaptcha:null,passwordContainerId:null,initRegister:function(checkboxId,passwordContainerId)
{this.onPasswordUpdate=this.reupdate.bindAsEventListener(this);if($(passwordContainerId)){this.passwordContainerId=passwordContainerId;}
if($(checkboxId))
{$(checkboxId).observe('click',this.onRegisterChange.bind(this,checkboxId));}
this.initEvents(this.passwordContainerId);},initCaptcha:function(guestCaptchaId,registerCaptchaId,captchaMethod)
{if($(guestCaptchaId)){this.guestCaptcha=$(guestCaptchaId);this.initEvents(guestCaptchaId);}else{this.guestCaptchaId=false;}
if($(registerCaptchaId)){this.registerCaptcha=$(registerCaptchaId);this.initEvents(registerCaptchaId);}else{this.registerCaptchaId=false;}
this.setCaptchaMethod(captchaMethod);},onRegisterChange:function(checkboxId,event)
{this.setEnable(this.passwordContainerId,$(checkboxId).checked);if($(checkboxId).checked){Element.show(this.passwordContainerId);var method='register';this.setCaptchaMethod(true);var request=new Ajax.Request(this.urls.saveMethodUrl,{method:'post',parameters:{method:method}});}else{Element.hide(this.passwordContainerId);var method='guest';this.setCaptchaMethod(false);var request=new Ajax.Request(this.urls.saveMethodUrl,{method:'post',onComplete:this.onPasswordUpdate,parameters:{method:method}});}},setEnable:function(containerId,bEnable)
{if($(containerId))
{if(bEnable)
{$(containerId).select('input').invoke('enable');}else{$(containerId).select('input').invoke('disable');}}},setCaptchaMethod:function(show_req)
{if(this.guestCaptcha){if(show_req){this.guestCaptcha.hide();this.guestCaptcha.next().hide();}else{this.guestCaptcha.show();this.guestCaptcha.next().show();}}
if(this.registerCaptcha){if(show_req){this.registerCaptcha.show();this.registerCaptcha.next().show();}else{this.registerCaptcha.hide();this.registerCaptcha.next().hide();}}},stepErrorHandler:function(stepResponse)
{this.clearCaptcha(stepResponse);},stepErrorResolveHandler:function(stepResponse)
{if(typeof(stepResponse.hide_captcha)!='undefined'){var el=$(stepResponse.hide_captcha);if(el){el.hide();el.next().hide();if(el.id==this.guestCaptcha.id){this.guestCaptcha=false;}else{this.registerCaptcha=false;}}}
this.clearCaptcha(stepResponse);},initVirtualUpdate:function()
{Event.observe(window,'load',this.update.bind(this));},reupdate:function()
{this.getCheckout().getStep('billing').update();}});