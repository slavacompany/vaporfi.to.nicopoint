var AitShipping=Class.create(AitAddress,{initShipping:function(checkboxId)
{if($(checkboxId))
{$(checkboxId).observe('click',this.onChangeUseForShipping.bind(this,checkboxId));}
Event.observe(window,'load',this.onChangeUseForShipping.bind(this,checkboxId));},onChangeUseForShipping:function(checkboxId,event)
{if(typeof this.billingCurrentReloadSteps=="undefined"){this.billingCurrentReloadSteps=this.getCheckout().getStep('billing').reloadSteps;}
if($(checkboxId))
{if($(checkboxId).checked)
{if($(this.cfmTopContainer)||$(this.cfmBottomContainer))
{Element.show(this.container);Element.hide(this.container+'-child');}else{Element.hide(this.container);}
this.getCheckout().getStep('billing').setReloadSteps(this.getCheckout().getStep('shipping').reloadSteps);this.getCheckout().getStep('billing').update(event);return;}}
Element.show(this.container);Element.show(this.container+'-child');this.getCheckout().getStep('billing').setReloadSteps(this.billingCurrentReloadSteps);this.getCheckout().getStep('billing').update(event);this.getCheckout().getStep('shipping').update(event);}});