var AitAddress=Class.create(Step,{newAddress:function(isNew,containerId)
{if(isNew)
{Element.show(containerId);}else{Element.hide(containerId);}},initAddress:function(savedAddressId,newAddressContainerId)
{if($(savedAddressId))
{$(savedAddressId).observe('change',function(event)
{this.newAddress(!Event.element(event).value,newAddressContainerId);if(Event.element(event).value){this.update();}}.bind(this));}
this.initEvents(newAddressContainerId);},initAdditional:function(containerID)
{this.initEvents(containerID);}});