var Step=Class.create();Step.prototype={initialize:function(name,container,checkout,urls,options)
{this.name=name;this.container=container;this.checkout=checkout;this.urls=urls;this.isLoadWaiting=options.isLoadWaiting;this.isUpdateOnReload=options.isUpdateOnReload;this.doCheckErrors=options.doCheckErrors;this.cacheFields=(typeof options.cache!='undefined')?options.cache:[];this.reloadSteps=[];this.onChangeStepData=this.update.bindAsEventListener(this);this.onUpdateChild=this.onUpdateReloadStep.bindAsEventListener(this);this.onUpdate=this.onUpdateResponse.bindAsEventListener(this);this.authorizenetFieldIdsReviewStepCache=['authorizenet_directpost_cc_number','authorizenet_directpost_cc_type','authorizenet_directpost_expiration','authorizenet_directpost_expiration_yr'];if(this.name=='review')
{this.authorizenetFieldIdsReviewStepCache.each(function(cachedItem)
{if($(cachedItem))
{$(cachedItem).observe('change',(function(){this.onFieldChange($(cachedItem));}).bindAsEventListener(this));}
if(this.cacheFields.indexOf(cachedItem)<0)
{this.cacheFields.push(cachedItem);}}.bind(this));}
this.cfmTopContainer=this.name+'-aitcheckoutfields-top';this.cfmBottomContainer=this.name+'-aitcheckoutfields-bottom';this.cfmRegContainer=this.name+'-aitcheckoutfields-reg';[this.cfmTopContainer,this.cfmBottomContainer,this.cfmRegContainer].each(function(item){if($(item))
{$(item).select('input','select','textarea').each(function(input)
{if(input.type.toLowerCase()=='radio'||input.type.toLowerCase()=='checkbox'){Event.observe(input,'click',this.onChangeStepData.bind(this));}else{Event.observe(input,'change',this.onChangeStepData.bind(this));}}.bind(this));}}.bind(this));if(typeof this.getCheckout().cache[this.name]=='undefined')
{this.getCheckout().cache[this.name]=[];}
this.fillCachedFields();this.checkCachedFields();},onFieldChange:function(authorizeField)
{this.getCheckout().cache[this.name][authorizeField.id]=authorizeField.value;},getCheckout:function()
{return this.checkout;},setReloadSteps:function(steps)
{this.reloadSteps=steps;},addReloadSteps:function(steps)
{steps.each(function(step)
{if(this.reloadSteps.indexOf(step)<0)
{this.reloadSteps.push(step);}}.bind(this));},_canCacheElementValue:function(elementId)
{var result=false;this.cacheFields.each(function(cacheItem)
{if(elementId.search(cacheItem)>=0)
{result=true;}}.bind(this));return result;},update:function(event)
{if(event)
{var elem=Event.element(event);if($(elem.id))
{if(this._canCacheElementValue(elem.id))
{this.getCheckout().cache[this.name][elem.id]=elem.value;}
if((elem.type.toLowerCase()=='radio'))
{this.getCheckout().cache[this.name][elem.name]=elem.id;}
if(!Validation.validate(elem.id))
{return;}}}
var validator=new AitValidation(this.container);if(validator&&(validator.validate()||this.container=='checkout-step-shipping_method'))
{this.reloadSteps.each(function(stepName){this.getCheckout().getStep(stepName).loadWaiting();}.bind(this));var params=Form.serialize(this.getCheckout().getForm())+'&'+
Object.toQueryString({step:this.name,reload_steps:this.reloadSteps.join(',')});var request=new Ajax.Request(this.checkout.ajaxUpdateUrl,{method:'post',onComplete:this.onUpdateChild,onSuccess:this.onUpdate,parameters:params,onFailure:this.getCheckout().ajaxFailure.bind(this.getCheckout())});}},loadWaiting:function()
{if(this.isLoadWaiting&&$(this.name+'-waiting'))
{$(this.name+'-waiting').show();}},getContainer:function()
{return $(this.container);},onUpdateResponse:function(transport)
{if(transport&&transport.responseText){try{response=eval('('+ transport.responseText+')');}
catch(e){response={};}}
if(typeof(response.error)!='undefined'){var notice=$(this.name+'-notice');notice.addClassName('error-msg');notice.update(response.message);notice.show();this.clearCaptcha(response);this.getCheckout().setUpdatingNow(false);return false;}
for(var idx in response.update_section)
{var stepName=response.update_section[idx].name;var stepHtml=response.update_section[idx].html;var step=this.checkout.getStep(stepName);var stepContainer=step.getContainer();stepContainer.update(stepHtml);}
this.onUpdateResponseAfter(response);},clearCaptcha:function(response){if(typeof(response.captcha_image)!='undefined'){$(response.form_id).src=response.captcha_image;$('captcha_'+ response.form_id).value='';}},onUpdateReloadStep:function(transport)
{if(transport&&transport.responseText){try{response=eval('('+ transport.responseText+')');}
catch(e){response={};}}
for(var idx in response.update_section)
{var stepName=response.update_section[idx].name;var step=this.checkout.getStep(stepName);if(step.isUpdateOnReload)
{step.update();}}},onUpdateResponseAfter:function(response)
{var stepResponse=eval('response.'+ this.name);if(this.doCheckErrors||this.getCheckout().isStatusChanged())
{var notice=$(this.name+'-notice');var checkoutBtn=$('checkout-buttons-container').down('button');if(stepResponse.length!=0||this.getCheckout().isDisabled())
{if(stepResponse.error==0)
{notice.addClassName('success-msg');}else if(stepResponse.error==-1)
{notice.addClassName('error-msg');}else if(stepResponse.error==1)
{notice.addClassName('error-msg');}
checkoutBtn.disabled=true;checkoutBtn.addClassName('no-checkout');if(stepResponse.length!=0){notice.update(stepResponse.message);notice.show();this.stepErrorHandler(stepResponse);}}else{if(this.doCheckErrors){notice.hide();}
checkoutBtn.disabled=false;checkoutBtn.removeClassName('no-checkout');if(typeof(response['resolve_'+this.name])!='undefined'){var stepResolve=response['resolve_'+this.name];this.stepErrorResolveHandler(stepResolve);}}}},stepErrorHandler:function(stepResponse)
{},stepErrorResolveHandler:function(stepResponse)
{},initEvents:function(containerId)
{if($(containerId))
{$(containerId).select('input','select','textarea').each(function(input)
{if(input.type.toLowerCase()=='radio'||input.type.toLowerCase()=='checkbox')
{Event.observe(input,'click',this.onChangeStepData.bind(this));}
else{Event.observe(input,'change',this.onChangeStepData.bind(this));}}.bind(this));}},fillCachedFields:function()
{var fields=this.getCheckout().cache[this.name];for(var idx in fields)
{if(this._canCacheElementValue(idx))
{if(fields[idx])
{$(idx).value=fields[idx];}}}
if(!this.getCheckout().valid)
{var validator=new Validation(this.getCheckout().getForm());if(!validator.validate())
{this.getCheckout().valid=true;}}},checkCachedFields:function()
{var x=this.getCheckout().runSaveAfterUpdate;if(typeof this.getCheckout().cache[this.name]!='undefined')
{if(this.getContainer())
{this.getContainer().select('input[type=radio]').each(function(input){if(input.id==this.getCheckout().cache[this.name][input.name])
{input.checked='checked';if(input.onclick)
{var onclick=eval(input.onclick);onclick();}}else{if(typeof this.getCheckout().cache[this.name][input.name]!=='undefined')
{input.checked='';}}}.bind(this));if(!this.getCheckout().valid)
{var validator=new Validation(this.getCheckout().getForm());if(!validator.validate())
{this.getCheckout().valid=true;}}}}}}