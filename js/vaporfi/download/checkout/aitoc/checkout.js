var AitCheckout=Class.create();AitCheckout.prototype={_isDisabled:false,_statusChanged:false,initialize:function(form,urls)
{this.form=form;this.ajaxUpdateUrl=urls.ajaxUpdateUrl;this.failureUrl=urls.failureUrl;this.steps=[];this.sagepayTokenSuccess=false;this.runSaveAfterUpdate=false;this.valid=true;this.cache=[];$$('.checkout-types').each(function(container){$(container).select('button').each(function(btn){btn.onclick='';btn.observe('click',function(event){Effect.ScrollTo(this.form);}.bind(this))}.bind(this));}.bind(this));Ajax.Responders.register({onComplete:function(transport)
{if(0<Ajax.activeRequestCount)
{return false;}
if(this.runSaveAfterUpdate)
{if(typeof SuiteConfig!='undefined')
{document.fire('sagepay:submit');}else{review.save();}}}.bind(this)});},ajaxFailure:function(){window.location=this.failureUrl;},getForm:function()
{return this.form;},getValidator:function()
{return new Validation(this.form);},setStep:function(name,step)
{this.steps[name]=step;return this;},getStep:function(name)
{if(this.steps[name])
{return this.steps[name];}},disableCheckout:function(){this.setCheckoutStatus(true);},enableCheckout:function(){this.setCheckoutStatus(false);},setCheckoutStatus:function(status){if(this._isDisabled!=status){this._statusChanged=true;}
this._isDisabled=status;},isDisabled:function(){return this._isDisabled;},isStatusChanged:function(){return this._statusChanged;}}
if(Prototype.Browser.IE&&Prototype.Version.substr(0,3)=='1.6'){Object.extend(Selector.handlers,{unmark:function(nodes){for(var i=0,node;node=nodes[i];i++){node.removeAttribute('_countedByPrototype');if(node._countedByPrototype)node._countedByPrototype=false;}
return nodes;}});}