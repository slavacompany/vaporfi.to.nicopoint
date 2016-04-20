var Checkout = Class.create();
Checkout.prototype = {
    initialize: function (accordion, urls) {
        this.accordion = accordion;
        this.progressUrl = urls.progress;
        this.reviewUrl = urls.review;
        this.saveMethodUrl = urls.saveMethod;
        this.failureUrl = urls.failure;
        this.orderSummaryUrl = urls.orderSummary;
        this.billingForm = false;
        this.shippingForm = false;
        this.syncBillingShipping = false;
        this.method = '';
        this.payment = '';
        this.loadWaiting = false;
        this.steps = ['login', 'shipping', 'payment'];
        this.currentStep = 'shipping';
        this.updateCartUrl = urls.updateCart;
        this.currentShippingMethod = '';
        this.forceUpdateOrderSummary = false;
        this.accordion.sections.each(function (section) {
            Event.observe($(section).down('.step-title'), 'click', this._onSectionClick.bindAsEventListener(this));
        }.bind(this));
        this.accordion.disallowAccessToNextSections = true;
    }, _onSectionClick: function (event) {
        var section = $(Event.element(event).up().up());
        if (section.hasClassName('allow')) {
            Event.stop(event);
            this.gotoSection(section.readAttribute('id').replace('opc-', ''), false);
            return false;
        }
    }, ajaxFailure: function () {
        location.href = this.failureUrl;
    }, reloadProgressBlock: function (toStep) {
        this.reloadStep(toStep);
        if (this.syncBillingShipping) {
            this.syncBillingShipping = false;
            this.reloadStep('shipping');
        }
    }, reloadStep: function (prevStep) {
        var updater = new Ajax.Updater(prevStep + '-progress-opcheckout', this.progressUrl, {
            method: 'get',
            onFailure: this.ajaxFailure.bind(this),
            onComplete: function () {
                this.checkout.resetPreviousSteps();
            },
            parameters: prevStep ? {prevStep: prevStep} : null
        });
    }, reloadReviewBlock: function () {
        var updater = new Ajax.Updater('checkout-review-load', this.reviewUrl, {
            method: 'get',
            onFailure: this.ajaxFailure.bind(this),
            onSuccess: function () {
                this.updateOrderSummary();
                checkout.setLoadWaiting(false);
            }.bind(this)
        });
    }, _disableEnableAll: function (element, isDisabled) {
        var descendants = element.descendants();
        for (var k in descendants) {
            descendants[k].disabled = isDisabled;
        }
        element.disabled = isDisabled;
    }, setLoadWaiting: function (step, keepDisabled) {
        if (step) {
            if (this.loadWaiting) {
                this.setLoadWaiting(false);
            }
            var container = $(step + '-buttons-container');
            container.addClassName('disabled');
            container.setStyle({opacity: .9});
            this._disableEnableAll(container, true);
            Element.show(step + '-please-wait');
        } else {
            if (this.loadWaiting) {
                var container = $(this.loadWaiting + '-buttons-container');
                var isDisabled = (keepDisabled ? true : false);
                if (!isDisabled) {
                    container.removeClassName('disabled');
                    container.setStyle({opacity: 1});
                }
                this._disableEnableAll(container, isDisabled);
                Element.hide(this.loadWaiting + '-please-wait');
            }
        }
        this.loadWaiting = step;
    }, gotoSection: function (section, reloadProgressBlock) {
        if (reloadProgressBlock) {
            this.reloadProgressBlock(this.currentStep);
        }
        this.currentStep = section;
        var sectionElement = $('opc-' + section);
        sectionElement.addClassName('allow');
        this.accordion.openSection('opc-' + section);
        if (!reloadProgressBlock) {
            this.resetPreviousSteps();
        }
        this.showSteps();
        this.updateOrderSummary();
    }, updateOrderSummary: function () {
        var methodSelected = '';
        var methodValue = '';
        try {
            methodSelected = Form.serialize(shippingMethod.form);
            var methodValue = methodSelected.split('=')[1];
        }
        catch (e) {
            methodValue = 'notApply';
        }
        if (this.currentShippingMethod != methodValue || this.forceUpdateOrderSummary == true) {
            this.currentShippingMethod = methodValue;
            this.forceUpdateOrderSummary = false;
        }
        else
            return;
        if ($('review-please-wait'))
            Element.show('review-please-wait');
        if ($('payment-total-please-wait'))
            Element.show('payment-total-please-wait');
        var updater = new Ajax.Updater('checkout-review-load', this.orderSummaryUrl, {
            method: 'get',
            onFailure: this.ajaxFailure.bind(this),
            onSuccess: function () {
                Element.hide('review-please-wait');
            }.bind(this),
            onComplete: function () {
                jQuery('#checkout-review-load').fadeOut('fast').fadeIn('slow');
                $('payment-total-grandtotal').update($('current-payment-total-grandtotal').innerHTML);
                Element.hide('payment-total-please-wait');
                if (window.mobileResponsive) {
                    mobileResponsive.summaryResize();
                }
            }.bind(this)
        });
    }, showSteps: function () {
        switch (this.currentStep) {
            case'shipping':
                $('checkout-step-3').removeClassName('selected');
                $('checkout-step-2').removeClassName('complete');
                $('checkout-step-2').addClassName('selected');
                $('breadcrumb-shipping-selected').show();
                $('breadcrumb-payment-selected').hide();
                break;
            case'payment':
                $('checkout-step-2').removeClassName('selected');
                $('checkout-step-2').addClassName('complete');
                $('checkout-step-3').addClassName('selected');
                $('breadcrumb-shipping-selected').hide();
                $('breadcrumb-payment-selected').show();
                break;
            default:
                break;
        }
    }, updateCart: function (ele) {
        new Ajax.Request(this.updateCartUrl, {
            method: 'post',
            parameters: jQuery(ele).serialize(),
            onFailure: this.ajaxFailure.bind(this),
            onSuccess: function (result) {
            }.bind(this),
            onComplete: function () {
                this.updateOrderSummary();
            }.bind(this)
        });
    }, resetPreviousSteps: function () {
        var stepIndex = this.steps.indexOf(this.currentStep);
        for (var i = stepIndex; i < this.steps.length; i++) {
            var nextStep = this.steps[i];
            var progressDiv = nextStep + '-progress-opcheckout';
            if ($(progressDiv)) {
                $(progressDiv).select('.changelink').each(function (item) {
                    item.remove();
                });
                $(progressDiv).select('dt').each(function (item) {
                    item.removeClassName('complete');
                });
                $(progressDiv).select('dd.complete').each(function (item) {
                    item.remove();
                });
            }
        }
    }, changeSection: function (section) {
        var changeStep = section.replace('opc-', '');
        this.gotoSection(changeStep, false);
    }, setMethod: function () {
        if ($('login:guest') && $('login:guest').checked) {
            this.method = 'guest';
            var request = new Ajax.Request(this.saveMethodUrl, {
                method: 'post',
                onFailure: this.ajaxFailure.bind(this),
                parameters: {method: 'guest'}
            });
            Element.hide('register-customer-password');
            this.gotoSection('billing', true);
        }
        else if ($('login:register') && ($('login:register').checked || $('login:register').type == 'hidden')) {
            this.method = 'register';
            var request = new Ajax.Request(this.saveMethodUrl, {
                method: 'post',
                onFailure: this.ajaxFailure.bind(this),
                parameters: {method: 'register'}
            });
            Element.show('register-customer-password');
            this.gotoSection('billing', true);
        }
        else {
            alert(Translator.translate('Please choose to register or to checkout as a guest').stripTags());
            return false;
        }
        document.body.fire('login:setMethod', {method: this.method});
    }, setBilling: function () {
        if (($('billing:use_for_shipping_yes')) && ($('billing:use_for_shipping_yes').checked)) {
            shipping.syncWithBilling();
            $('opc-shipping').addClassName('allow');
            this.gotoSection('shipping_method', true);
        } else if (($('billing:use_for_shipping_no')) && ($('billing:use_for_shipping_no').checked)) {
            $('shipping:same_as_billing').checked = false;
            this.gotoSection('shipping', true);
        } else {
            $('shipping:same_as_billing').checked = true;
            this.gotoSection('shipping', true);
        }
    }, setShipping: function () {
        this.gotoSection('shipping_method', true);
    }, setShippingMethod: function () {
        this.gotoSection('payment', true);
    }, setPayment: function () {
        this.gotoSection('review', true);
    }, setReview: function () {
        this.reloadProgressBlock();
    }, back: function () {
        jQuery('html,body').animate({scrollTop: jQuery('body')}, 500);
        if (this.loadWaiting)return;
        if (this.currentShippingMethod != 'notApply') {
            var stepIndex = this.steps.indexOf(this.currentStep);
            var section = this.steps[--stepIndex];
            var sectionElement = $('opc-' + section);
            while (sectionElement === null && stepIndex > 0) {
                --stepIndex;
                section = this.steps[stepIndex];
                sectionElement = $('opc-' + section);
            }
            this.changeSection('opc-' + section);
            this.showSteps();
        } else
            location.href = this.failureUrl;
    }, setStepResponse: function (response) {
        if (typeof skipAbandon == 'function') {
            skipAbandon();
        }
        if (response.update_section) {
            $('checkout-' + response.update_section.name + '-load').update(response.update_section.html);
        }
        if (response.allow_sections) {
            response.allow_sections.each(function (e) {
                $('opc-' + e).addClassName('allow');
            });
        }
        if (response.duplicateBillingInfo) {
            this.syncBillingShipping = true;
            shipping.setSameAsBilling(true);
        }
        if (response.goto_section) {
            this.gotoSection(response.goto_section, true);
            return true;
        }
        if (response.redirect) {
            location.href = response.redirect;
            return true;
        }
        return false;
    }
}
var Billing = Class.create();
Billing.prototype = {
    initialize: function (form, addressUrl, saveUrl) {
        this.form = form;
        if ($(this.form)) {
            $(this.form).observe('submit', function (event) {
                this.save();
                Event.stop(event);
            }.bind(this));
        }
        this.addressUrl = addressUrl;
        this.saveUrl = saveUrl;
        this.onAddressLoad = this.fillForm.bindAsEventListener(this);
        this.onSave = this.nextStep.bindAsEventListener(this);
        this.onComplete = this.resetLoadWaiting.bindAsEventListener(this);
    }, updateBillingAddress: function () {
        if (checkout.currentShippingMethod != 'notApply') {
            if ($('billing:use_for_billing').checked) {
                $('billing:use_for_billing').value = 1;
                $('billing:save_in_address_book').value = 0;
                Element.hide('billing-new-address-form');
                if ($('billing_address_select_li'))
                    Element.hide('billing_address_select_li');
                billing.fillBilling();
            } else {
                $('billing:use_for_billing').value = 0;
                $('billing:save_in_address_book').value = 1;
                Element.show('billing-new-address-form');
                if ($('billing_address_select_li'))
                    Element.show('billing_address_select_li');
            }
        }
    }, fillBilling: function () {
        billing.syncWithShipping();
        if ($('shipping-address-select') && $('shipping-address-select').value == "") {
            billing.resetSelectedAddress();
        } else if ($('shipping:save_in_address_book').getAttribute('type') != "hidden")
            billing.newAddress($('billing-address-select').value);
    }, syncWithShipping: function () {
        if (!$('shipping-address-select') || !$('shipping-address-select').value) {
            arrElements = Form.getElements(this.form);
            for (var elemIndex in arrElements) {
                if (arrElements[elemIndex].id) {
                    var sourceField = $(arrElements[elemIndex].id.replace(/^billing:/, 'shipping:'));
                    if (sourceField) {
                        arrElements[elemIndex].value = sourceField.value;
                    }
                }
            }
            $('billing:country_id').value = $('shipping:country_id').value;
            billingRegionUpdater.update();
            $('billing:region_id').value = $('shipping:region_id').value;
            $('billing:region').value = $('shipping:region').value;
        } else {
            $('billing-address-select').value = $('shipping-address-select').value;
        }
    }, setAddress: function (addressId) {
        if (addressId) {
            request = new Ajax.Request(this.addressUrl + addressId, {
                method: 'get',
                onSuccess: this.onAddressLoad,
                onFailure: checkout.ajaxFailure.bind(checkout)
            });
        }
        else {
            this.fillForm(false);
        }
    }, newAddress: function (isNew) {
        if (isNew) {
            checkout.setLoadWaiting('payment');
            billing.setAddress(isNew);
        } else {
            billing.fillForm();
        }
        if (checkout.currentShippingMethod == 'notApply')
            Element.show('billing-new-address-form');
        this.modernizerBlur();
    }, resetSelectedAddress: function () {
        var selectElement = $('billing-address-select')
        if (selectElement) {
            selectElement.value = '';
        }
        this.removeReadOnlyForm();
    }, fillForm: function (transport) {
        checkout.setLoadWaiting(false);
        var elementValues = {};
        var autocompleted = false;
        if (transport && transport.responseText) {
            try {
                elementValues = eval('(' + transport.responseText + ')');
                autocompleted = true;
            }
            catch (e) {
                elementValues = {};
            }
        }
        else {
            this.resetSelectedAddress();
        }
        arrElements = Form.getElements(this.form);
        for (var elemIndex in arrElements) {
            if (arrElements[elemIndex].id) {
                var fieldName = arrElements[elemIndex].id.replace(/^billing:/, '');
                if (fieldName != 'use_for_billing') {
                    arrElements[elemIndex].value = elementValues[fieldName] ? elementValues[fieldName] : '';
                    if (fieldName == 'country_id' && billingForm) {
                        try {
                            billingForm.elementChildLoad(arrElements[elemIndex]);
                        } catch (err) {
                        }
                    }
                    if ((fieldName == 'billing-address-select' || fieldName == 'address_id') && billingForm) {
                        arrElements[elemIndex].value = elementValues['entity_id'];
                    }
                }
            }
        }
        if (autocompleted) {
            this.readOnlyForm();
        }
    }, readOnlyForm: function () {
        Form.getElements(billing.form).each(function (element) {
            if (element.id != 'billing-address-select')
                element.setAttribute('readonly', 'readonly');
            if (element.id == 'billing:country_id' || element.id == 'billing:region_id')
                for (var i = 0; i < element.length; i++)
                    element.options[i].setAttribute('disabled', 'disabled');
        });
        Element.hide($('billing_save_in_address_book_li'));
        $('billing:save_in_address_book').checked = false;
    }, removeReadOnlyForm: function () {
        Form.getElements(billing.form).each(function (element) {
            element.removeAttribute('readonly');
            if (element.id == 'billing:country_id' || element.id == 'billing:region_id')
                for (var i = 0; i < element.length; i++)
                    element.options[i].removeAttribute('disabled');
        });
        Element.show($('billing_save_in_address_book_li'));
        $('billing:save_in_address_book').checked = false;
    }, setUseForShipping: function (flag) {
    }, modernizer: function () {
        if (!Modernizr.input.placeholder) {
            jQuery('#' + this.form).find('[placeholder]').each(function () {
                var input = jQuery(this);
                if (input.val() == input.attr('placeholder')) {
                    input.val('');
                }
            });
        }
    }, modernizerBlur: function () {
        if (!Modernizr.input.placeholder) {
            jQuery('#' + this.form + ' [placeholder]').focus(function () {
                var input = jQuery(this);
                if (input.val() == input.attr('placeholder')) {
                    input.val('');
                    input.removeClass('placeholder');
                }
            }).blur(function () {
                var input = jQuery(this);
                if (input.val() == '' || input.val() == input.attr('placeholder')) {
                    input.addClass('placeholder');
                    input.val(input.attr('placeholder'));
                }
            }).blur();
        }
    }, save: function () {
        this.modernizer();
        if (!addressValidator.validateWithResponse())return;
        if (checkout.loadWaiting != false)return;
        var validator = new Validation(this.form);
        if (validator.validate()) {
            checkout.setLoadWaiting('payment');
            var request = new Ajax.Request(this.saveUrl, {
                method: 'post',
                onComplete: this.onComplete,
                onSuccess: this.onSave,
                onFailure: checkout.ajaxFailure.bind(checkout),
                parameters: Form.serialize(this.form)
            });
        }
    }, resetLoadWaiting: function (transport) {
        document.body.fire('billing-request:completed', {transport: transport});
    }, nextStep: function (transport) {
        if (transport && transport.responseText) {
            try {
                response = eval('(' + transport.responseText + ')');
            }
            catch (e) {
                response = {};
            }
        }
        if (response.error) {
            if ((typeof response.message) == 'string') {
                alert(response.message);
            } else {
                alert(response.message.join("\n"));
            }
            return false;
        }
        checkout.setLoadWaiting(false);
        payment.initWhatIsCvvListeners();
        payment.save();
    }
}
var Shipping = Class.create();
Shipping.prototype = {
    initialize: function (form, addressUrl, saveUrl, methodsUrl) {
        this.form = form;
        if ($(this.form)) {
            $(this.form).observe('submit', function (event) {
                this.save();
                Event.stop(event);
            }.bind(this));
        }
        this.addressUrl = addressUrl;
        this.saveUrl = saveUrl;
        this.methodsUrl = methodsUrl;
        this.onAddressLoad = this.fillForm.bindAsEventListener(this);
        this.onSave = this.saveShippingMethod.bindAsEventListener(this);
        this.onComplete = this.resetLoadWaiting.bindAsEventListener(this);
        this.readyToSave = false;
    }, setAddress: function (addressId) {
        if (addressId) {
            request = new Ajax.Request(this.addressUrl + addressId, {
                method: 'get',
                onSuccess: this.onAddressLoad,
                onFailure: checkout.ajaxFailure.bind(checkout)
            });
            checkout.forceUpdateOrderSummary = true;
            checkout.updateOrderSummary();
        }
        else {
            this.fillForm(false);
        }
    }, newAddress: function (isNew) {
        if (isNew) {
            checkout.setLoadWaiting('shipping');
            shipping.setAddress(isNew);
        } else {
            shipping.fillForm();
        }
        shipping.setSameAsBilling(false);
        this.modernizerBlur();
    }, resetSelectedAddress: function () {
        var selectElement = $('shipping-address-select')
        if (selectElement) {
            selectElement.value = '';
            Element.show($('shipping:firstname'));
            Element.show($('shipping:lastname'));
        }
        this.removeReadOnlyForm();
    }, fillForm: function (transport) {
        checkout.setLoadWaiting(false);
        var elementValues = {};
        var autocompleted = false;
        if (transport && transport.responseText) {
            try {
                elementValues = eval('(' + transport.responseText + ')');
                autocompleted = true;
            }
            catch (e) {
                elementValues = {};
            }
        }
        else {
            this.resetSelectedAddress();
        }
        arrElements = Form.getElements(this.form);
        for (var elemIndex in arrElements) {
            if (arrElements[elemIndex].id) {
                var fieldName = arrElements[elemIndex].id.replace(/^shipping:/, '');
                arrElements[elemIndex].value = elementValues[fieldName] ? elementValues[fieldName] : '';
                if (fieldName == 'country_id' && shippingForm) {
                    try {
                        shippingForm.elementChildLoad(arrElements[elemIndex]);
                    } catch (err) {
                    }
                }
                if ((fieldName == 'shipping-address-select' || fieldName == 'address_id') && shippingForm) {
                    arrElements[elemIndex].value = elementValues['entity_id'];
                }
            }
        }
        $('shipping:save_in_address_book').value = 1;
        if (autocompleted) {
            shipping.updateShippingMethod(false);
            this.readOnlyForm();
            Element.hide($('shipping:firstname'));
            Element.hide($('shipping:lastname'));
        }
        $('shipping:save_in_address_book').value = 1;
    }, readOnlyForm: function () {
        Form.getElements(shipping.form).each(function (element) {
            if (element.id != 'shipping-address-select')
                element.setAttribute('readonly', 'readonly');
            if (element.id == 'shipping:country_id' || element.id == 'shipping:region_id')
                for (var i = 0; i < element.length; i++)
                    element.options[i].setAttribute('disabled', 'disabled');
        });
        Element.hide($('shipping_save_in_address_book_li'));
        $('shipping:save_in_address_book').checked = false;
    }, removeReadOnlyForm: function () {
        Form.getElements(shipping.form).each(function (element) {
            element.removeAttribute('readonly');
            if (element.id == 'shipping:country_id' || element.id == 'shipping:region_id')
                for (var i = 0; i < element.length; i++)
                    element.options[i].removeAttribute('disabled');
        });
        Element.show($('shipping_save_in_address_book_li'));
        $('shipping:save_in_address_book').checked = false;
    }, setSameAsBilling: function (flag) {
        if (flag) {
            this.syncWithBilling();
        }
    }, syncWithBilling: function () {
        $('billing-address-select') && this.newAddress(!$('billing-address-select').value);
        $('shipping:same_as_billing').checked = true;
        if (!$('billing-address-select') || !$('billing-address-select').value) {
            arrElements = Form.getElements(this.form);
            for (var elemIndex in arrElements) {
                if (arrElements[elemIndex].id) {
                    var sourceField = $(arrElements[elemIndex].id.replace(/^shipping:/, 'billing:'));
                    if (sourceField) {
                        arrElements[elemIndex].value = sourceField.value;
                    }
                }
            }
            shippingRegionUpdater.update();
            $('shipping:region_id').value = $('billing:region_id').value;
            $('shipping:region').value = $('billing:region').value;
        } else {
            $('shipping-address-select').value = $('billing-address-select').value;
        }
    }, setRegionValue: function () {
        $('shipping:region').value = $('billing:region').value;
    }, modernizer: function () {
        if (!Modernizr.input.placeholder) {
            jQuery('#' + this.form).find('[placeholder]').each(function () {
                var input = jQuery(this);
                if (input.val() == input.attr('placeholder')) {
                    input.val('');
                }
            });
        }
    }, modernizerBlur: function () {
        if (!Modernizr.input.placeholder) {
            jQuery('#' + this.form + ' [placeholder]').focus(function () {
                var input = jQuery(this);
                if (input.val() == input.attr('placeholder')) {
                    input.val('');
                    input.removeClass('placeholder');
                }
            }).blur(function () {
                var input = jQuery(this);
                if (input.val() == '' || input.val() == input.attr('placeholder')) {
                    input.addClass('placeholder');
                    input.val(input.attr('placeholder'));
                }
            }).blur();
        }
    }, save: function () {
        jQuery('html,body').animate({scrollTop: jQuery('body')}, 500);
        if (shippingMethod.preCheckBeforeLoadMethods()) {
            Element.show($('shipping-please-wait-bottom'));
            this.updateShippingMethod();
            return;
        }
        Element.show($('shipping-please-wait-bottom'));
        if (checkout.loadWaiting != false)return;
        var validator = new Validation(this.form);
        if (validator.validate()) {
            this.modernizer();
            if (!addressValidator.validateWithResponse())return;
            switch (checkout.currentStep) {
                case'payment':
                    checkout.setLoadWaiting('payment');
                    break;
                default:
                    checkout.setLoadWaiting('shipping');
                    break;
            }
            var request = new Ajax.Request(this.saveUrl, {
                method: 'post',
                onSuccess: this.onSave,
                onFailure: checkout.ajaxFailure.bind(checkout),
                parameters: Form.serialize(this.form)
            });
        }
        if (checkout.loadWaiting == false)Element.hide($('shipping-please-wait-bottom'));
    }, saveShippingMethod: function () {
        if (shippingMethod.validate()) {
            var request = new Ajax.Request(shippingMethod.saveUrl, {
                method: 'post',
                onComplete: this.onComplete,
                onSuccess: shippingMethod.onSave,
                onFailure: checkout.ajaxFailure.bind(checkout),
                parameters: Form.serialize(shippingMethod.form)
            });
        }
    }, saveShippingMethodSilent: function () {
        if (shippingMethod.validate()) {
            Element.show($('shipping-please-wait-bottom'));
            var request = new Ajax.Request(shippingMethod.saveUrl, {
                method: 'post', onComplete: function () {
                    Element.hide($('shipping-please-wait-bottom'));
                }.bind(this), onSuccess: function () {
                    checkout.updateOrderSummary();
                }.bind(this), onFailure: function () {
                    Element.hide($('shipping-please-wait-bottom'));
                }, parameters: Form.serialize(shippingMethod.form)
            });
        }
    }, updateShippingMethod: function (preCheck) {
        if (preCheck != false)
            if (shippingMethod.preCheckBeforeLoadMethods() == false)return;
        if (checkout.loadWaiting != false)return;
        //this.modernizer();
        Element.show($('shipping-please-wait-bottom'));
        var validator = new Validation(this.form);
        if (validator.validate()) {
            checkout.setLoadWaiting('shipping-method');
            var request = new Ajax.Request(this.saveUrl, {
                method: 'post',
                onComplete: this.onComplete,
                onSuccess: shippingMethod.onSave,
                onFailure: checkout.ajaxFailure.bind(checkout),
                parameters: Form.serialize(this.form)
            });
        }
        if (checkout.loadWaiting == false)Element.hide($('shipping-please-wait-bottom'));
    }, resetLoadWaiting: function (transport) {
        checkout.setLoadWaiting(false);
        Element.hide($('shipping-please-wait-bottom'));
        checkout.forceUpdateOrderSummary = true;
        checkout.updateOrderSummary();
    }, nextStep: function (transport) {
        if (transport && transport.responseText) {
            try {
                response = eval('(' + transport.responseText + ')');
            }
            catch (e) {
                response = {};
            }
        }
        if (response.error) {
            if ((typeof response.message) == 'string') {
                alert(response.message);
            } else {
                if (window.shippingRegionUpdater) {
                    shippingRegionUpdater.update();
                }
                alert(response.message.join("\n"));
            }
            return false;
        }
        checkout.setStepResponse(response);
    }
}
var ShippingMethod = Class.create();
ShippingMethod.prototype = {
    initialize: function (form, saveUrl) {
        this.form = form;
        if ($(this.form)) {
            $(this.form).observe('submit', function (event) {
                this.save();
                Event.stop(event);
            }.bind(this));
        }
        this.saveUrl = saveUrl;
        this.validator = new Validation(this.form);
        this.onSave = this.nextStep.bindAsEventListener(this);
        this.onComplete = this.resetLoadWaiting.bindAsEventListener(this);
        this.methods = false;
    }, validate: function () {
        var methods = $$('select[name="shipping_method"] option');
        if (methods.length == 0) {
            alert(Translator.translate('Your order cannot be completed at this time as there is no shipping methods available for it. Please make necessary changes in your shipping address.').stripTags());
            return false;
        }
        if (!this.validator.validate()) {
            return false;
        }
        for (var i = 0; i < methods.length; i++) {
            if (methods[i].selected) {
                return true;
            }
        }
        alert(Translator.translate('Please specify shipping method.').stripTags());
        return false;
    }, save: function () {
        if (checkout.loadWaiting != false)return;
        if (this.validate()) {
            checkout.setLoadWaiting('shipping-method');
            var request = new Ajax.Request(this.saveUrl, {
                method: 'post',
                onComplete: this.onComplete,
                onSuccess: this.onSave,
                onFailure: checkout.ajaxFailure.bind(checkout),
                parameters: Form.serialize(this.form)
            });
        }
    }, resetLoadWaiting: function (transport) {
        checkout.setLoadWaiting(false);
    }, nextStep: function (transport) {
        this.methods = true;
        if (transport && transport.responseText) {
            try {
                response = eval('(' + transport.responseText + ')');
            }
            catch (e) {
                response = {};
            }
        }
        if (response.error) {
            alert(response.message);
            return false;
        }
        if (response.update_section) {
            if (checkout.currentStep == 'shipping' || checkout.currentStep == 'shipping_method' || checkout.currentStep == 'payment')
                $('checkout-' + response.update_section.name + '-load').update(response.update_section.html);
            payment.modernizerBlur();
        }
        payment.initWhatIsCvvListeners();
        if (response.goto_section) {
            if (response.goto_section != 'payment')
                shipping.saveShippingMethodSilent();
            checkout.gotoSection(response.goto_section, true);
            checkout.reloadProgressBlock();
            billing.updateBillingAddress();
            return;
        }
        if (response.payment_methods_html) {
            $('checkout-payment-method-load').update(response.payment_methods_html);
        }
        checkout.setShippingMethod();
    }, resetMethods: function () {
        this.methods = false;
        shipping.updateShippingMethod();
    }, preCheckBeforeLoadMethods: function () {
        if ((($('shipping:postcode').value.strip() == '' || $('shipping:postcode').value == $('shipping:postcode').getAttribute('placeholder')) && $('shipping:country_id').value.strip() != 'US') && $('shipping:telephone').value.strip() != '') {
            if (this.methods == false)
                return true; else
                return false;
        }
        if ($('shipping:postcode').value.strip() == '' || $('shipping:telephone').value.strip() == '')return false;
        if ($('shipping:postcode').value == $('shipping:postcode').getAttribute('placeholder') || $('shipping:telephone').value == $('shipping:telephone').getAttribute('placeholder'))return false;
        if (this.methods == false)
            return true; else
            return false;
    }
}
var Payment = Class.create();
Payment.prototype = {
    beforeInitFunc: $H({}),
    afterInitFunc: $H({}),
    beforeValidateFunc: $H({}),
    afterValidateFunc: $H({}),
    initialize: function (form, saveUrl) {
        this.form = form;
        this.saveUrl = saveUrl;
        this.onSave = this.nextStep.bindAsEventListener(this);
        this.onComplete = this.resetLoadWaiting.bindAsEventListener(this);
    },
    addBeforeInitFunction: function (code, func) {
        this.beforeInitFunc.set(code, func);
    },
    beforeInit: function () {
        (this.beforeInitFunc).each(function (init) {
            (init.value)();
            ;
        });
    },
    init: function () {
        this.beforeInit();
        var elements = Form.getElements(this.form);
        if ($(this.form)) {
            $(this.form).observe('submit', function (event) {
                this.save();
                Event.stop(event);
            }.bind(this));
        }
        var method = null;
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].name == 'payment[method]') {
                if (elements[i].checked) {
                    method = elements[i].value;
                }
            } else {
                elements[i].disabled = true;
            }
            elements[i].setAttribute('autocomplete', 'off');
        }
        if (method)this.switchMethod(method);
        this.afterInit();
    },
    addAfterInitFunction: function (code, func) {
        this.afterInitFunc.set(code, func);
    },
    afterInit: function () {
        (this.afterInitFunc).each(function (init) {
            (init.value)();
        });
    },
    switchMethod: function (method) {
        if (this.currentMethod && $('payment_form_' + this.currentMethod)) {
            this.changeVisible(this.currentMethod, true);
            $('payment_form_' + this.currentMethod).fire('payment-method:switched-off', {method_code: this.currentMethod});
        }
        if ($('payment_form_' + method)) {
            this.changeVisible(method, false);
            $('payment_form_' + method).fire('payment-method:switched', {method_code: method});
        } else {
            document.body.fire('payment-method:switched', {method_code: method});
        }
        if (method) {
            this.lastUsedMethod = method;
        }
        this.currentMethod = method;
    },
    changeVisible: function (method, mode) {
        var block = 'payment_form_' + method;
        [block + '_before', block, block + '_after'].each(function (el) {
            element = $(el);
            if (element) {
                element.style.display = (mode) ? 'none' : '';
                element.select('input', 'select', 'textarea', 'button').each(function (field) {
                    field.disabled = mode;
                });
            }
        });
    },
    addBeforeValidateFunction: function (code, func) {
        this.beforeValidateFunc.set(code, func);
    },
    beforeValidate: function () {
        var validateResult = true;
        var hasValidation = false;
        (this.beforeValidateFunc).each(function (validate) {
            hasValidation = true;
            if ((validate.value)() == false) {
                validateResult = false;
            }
        }.bind(this));
        if (!hasValidation) {
            validateResult = false;
        }
        return validateResult;
    },
    validate: function () {
        var result = this.beforeValidate();
        if (result) {
            return true;
        }
        var methods = document.getElementsByName('payment[method]');
        if (methods.length == 0) {
            alert(Translator.translate('Your order cannot be completed at this time as there is no payment methods available for it.').stripTags());
            return false;
        }
        for (var i = 0; i < methods.length; i++) {
            if (methods[i].checked) {
                return true;
            }
        }
        result = this.afterValidate();
        if (result) {
            return true;
        }
        alert(Translator.translate('Please specify payment method.').stripTags());
        return false;
    },
    addAfterValidateFunction: function (code, func) {
        this.afterValidateFunc.set(code, func);
    },
    afterValidate: function () {
        var validateResult = true;
        var hasValidation = false;
        (this.afterValidateFunc).each(function (validate) {
            hasValidation = true;
            if ((validate.value)() == false) {
                validateResult = false;
            }
        }.bind(this));
        if (!hasValidation) {
            validateResult = false;
        }
        return validateResult;
    },
    save: function () {
        if (checkout.loadWaiting != false)return;
        var validator = new Validation(this.form);
        if (this.validate() && validator.validate()) {
            checkout.setLoadWaiting('payment');
            var request = new Ajax.Request(this.saveUrl, {
                method: 'post',
                onSuccess: this.onSave,
                onFailure: checkout.ajaxFailure.bind(checkout),
                parameters: Form.serialize(this.form)
            });
        }
    },
    resetLoadWaiting: function () {
        checkout.setLoadWaiting(false);
    },
    nextStep: function (transport) {
        if (transport && transport.responseText) {
            try {
                response = eval('(' + transport.responseText + ')');
            }
            catch (e) {
                response = {};
            }
        }
        if (response.error) {
            if (response.fields) {
                var fields = response.fields.split(',');
                for (var i = 0; i < fields.length; i++) {
                    var field = null;
                    if (field = $(fields[i])) {
                        Validation.ajaxError(field, response.error);
                    }
                }
                return;
            }
            alert(response.error);
            return;
        }
        checkout.setLoadWaiting(false);
        review.save();
    },
    initWhatIsCvvListeners: function () {
        $$('.cvv-what-is-this').each(function (element) {
            Event.observe(element, 'click', toggleToolTip);
        });
    },
    submitInfo: function () {
        var validator = new Validation(this.form);
        try {
            var validatorAge = new Validation(ageverification.form);
            if (this.validate() && validator.validate() && validatorAge.validate())
                ageverification.save();
        } catch (e) {
            if (this.validate() && validator.validate())
                billing.save();
        }
    },
    modernizerBlur: function () {
        if (!Modernizr.input.placeholder) {
            jQuery('#' + this.form + ' [placeholder]').focus(function () {
                var input = jQuery(this);
                if (input.val() == input.attr('placeholder')) {
                    input.val('');
                    input.removeClass('placeholder');
                }
            }).blur(function () {
                var input = jQuery(this);
                if (input.val() == '' || input.val() == input.attr('placeholder')) {
                    input.addClass('placeholder');
                    input.val(input.attr('placeholder'));
                }
            }).blur();
        }
    }
}
var Review = Class.create();
Review.prototype = {
    initialize: function (saveUrl, successUrl, agreementsForm) {
        this.saveUrl = saveUrl;
        this.successUrl = successUrl;
        this.agreementsForm = agreementsForm;
        this.onSave = this.nextStep.bindAsEventListener(this);
        this.onComplete = this.resetLoadWaiting.bindAsEventListener(this);
    }, save: function () {
        if (checkout.loadWaiting != false)return;
        checkout.setLoadWaiting('payment');
        var params = Form.serialize(payment.form);
        if (this.agreementsForm) {
            params += '&' + Form.serialize(this.agreementsForm);
        }
        try {
            if (ageverification) {
                params += '&' + Form.serialize(ageverification.form);
            }
        } catch (e) {
        }
        try {
            if (newsletter) {
                params += '&' + Form.serialize(newsletter.form);
            }
        } catch (e) {
        }
        params.save = true;
        var request = new Ajax.Request(this.saveUrl, {
            method: 'post',
            parameters: params,
            onSuccess: this.onSave,
            onFailure: checkout.ajaxFailure.bind(checkout)
        });
    }, resetLoadWaiting: function (transport) {
        checkout.setLoadWaiting(false, this.isSuccess);
    }, nextStep: function (transport) {
        if (typeof skipAbandon == 'function') {
            skipAbandon();
        }
        if (transport && transport.responseText) {
            try {
                response = eval('(' + transport.responseText + ')');
            }
            catch (e) {
                response = {};
            }
            if (response.redirect) {
                this.isSuccess = true;
                location.href = response.redirect;
                return;
            }
            if (response.success) {
                this.isSuccess = true;
                window.location = this.successUrl;
            }
            else {
                var msg = response.error_messages;
                if (typeof(msg) == 'object') {
                    msg = msg.join("\n");
                }
                if (msg) {
                    alert(msg);
                }
                this.resetLoadWaiting();
            }
            if (response.update_section) {
                $('checkout-' + response.update_section.name + '-load').update(response.update_section.html);
            }
            if (response.goto_section) {
                checkout.gotoSection(response.goto_section, true);
            }
        }
        $('billing:save_in_address_book').value = 1;
        if (autocompleted) {
            this.readOnlyForm();
        }
    }, readOnlyForm: function () {
        Form.getElements(billing.form).each(function (element) {
            if (element.id != 'billing-address-select')
                element.setAttribute('readonly', 'readonly');
            if (element.id == 'billing:country_id' || element.id == 'billing:region_id')
                for (var i = 0; i < element.length; i++)
                    element.options[i].setAttribute('disabled', 'disabled');
        });
        Element.hide($('billing_save_in_address_book_li'));
        $('billing:save_in_address_book').checked = false;
    }, removeReadOnlyForm: function () {
        Form.getElements(billing.form).each(function (element) {
            element.removeAttribute('readonly');
            if (element.id == 'billing:country_id' || element.id == 'billing:region_id')
                for (var i = 0; i < element.length; i++)
                    element.options[i].removeAttribute('disabled');
        });
        Element.show($('billing_save_in_address_book_li'));
        $('billing:save_in_address_book').checked = false;
    }, isSuccess: false
}
var AgeVerification = Class.create();
AgeVerification.prototype = {
    initialize: function (form) {
        this.form = form;
    }, save: function () {
        if (checkout.loadWaiting != false)return;
        checkout.setLoadWaiting('payment');
        var validator = new Validation(this.form);
        if (validator.validate()) {
            checkout.setLoadWaiting(false);
            billing.save();
            return;
        }
        checkout.setLoadWaiting(false);
    }
}
var GiftCard = Class.create();
GiftCard.prototype = {
    initialize: function (activateUrl, deActivateUrl) {
        this.activateUrl = activateUrl;
        this.deActivateUrl = deActivateUrl;
    }, activateGiftCard: function (giftCardCode) {
        checkout.setLoadWaiting('review');
        new Ajax.Request(this.activateUrl, {
            method: 'post',
            parameters: {giftcard_code: giftCardCode},
            onSuccess: function (result) {
                if (result.responseText.match(/error/)) {
                    result = JSON.parse(result.responseText);
                    checkout.setLoadWaiting(false);
                    alert(result.error);
                } else {
                    checkout.reloadReviewBlock();
                }
            }.bind(this)
        });
    }, deActivateGiftCard: function (cardId) {
        checkout.setLoadWaiting('review');
        new Ajax.Request(this.deActivateUrl + 'id/' + cardId, {
            method: 'get', onSuccess: function (result) {
                checkout.reloadReviewBlock();
            }.bind(this)
        });
    }
}
var Coupon = Class.create();
Coupon.prototype = {
    initialize: function (couponUpdateUrl) {
        this.couponUpdateUrl = couponUpdateUrl;
        this.onComplete = this.resetLoadWaiting.bindAsEventListener(this);
    }, update: function () {
        checkout.setLoadWaiting('review');
        new Ajax.Request(this.couponUpdateUrl, {
            method: 'post',
            parameters: {coupon_code: $('coupon_code').value, remove_coupon: $('remove_coupon').value},
            onSuccess: function (result) {
                result = JSON.parse(result.responseText);
                alert(result.message);
                checkout.reloadReviewBlock();
                this.onComplete;
            }.bind(this)
        });
    }, resetLoadWaiting: function () {
        checkout.setLoadWaiting(false);
    }
}
var AgeVerification = Class.create();
AgeVerification.prototype = {
    initialize: function (form) {
        this.form = form;
    }, save: function () {
        if (checkout.loadWaiting != false)return;
        checkout.setLoadWaiting('payment');
        var validator = new Validation(this.form);
        if (validator.validate()) {
            checkout.setLoadWaiting(false);
            billing.save();
            return;
        }
        checkout.setLoadWaiting(false);
    }
}
var NewsLetter = Class.create();
NewsLetter.prototype = {
    initialize: function (form) {
        this.form = form;
    }
}
var GiftCard = Class.create();
GiftCard.prototype = {
    initialize: function (activateUrl, deActivateUrl, reloadUrl) {
        this.activateUrl = activateUrl;
        this.deActivateUrl = deActivateUrl;
        this.reloadUrl = reloadUrl;
        this.onComplete = this.reloadGiftCardBlock.bindAsEventListener(this);
    }, activateGiftCard: function (giftCardCode) {
        checkout.setLoadWaiting('payment');
        new Ajax.Request(this.activateUrl, {
            method: 'post',
            parameters: {giftcard_code: giftCardCode},
            onSuccess: function (result) {
                if (result.responseText.match(/error/)) {
                    result = JSON.parse(result.responseText);
                    checkout.setLoadWaiting(false);
                    alert(result.error);
                } else {
                    this.onComplete();
                }
            }.bind(this)
        });
    }, deActivateGiftCard: function (cardId) {
        checkout.setLoadWaiting('payment');
        new Ajax.Request(this.deActivateUrl + 'id/' + cardId, {
            method: 'get', onSuccess: function (result) {
                this.onComplete();
            }.bind(this)
        });
    }, reloadGiftCardBlock: function () {
        var updater = new Ajax.Updater('onepage_payment_giftcard', this.reloadUrl, {
            method: 'get',
            onFailure: checkout.ajaxFailure.bind(this),
            onSuccess: function () {
                checkout.forceUpdateOrderSummary = true;
                if (checkout.currentShippingMethod != 'notApply') {
                    checkout.setLoadWaiting(false);
                    shipping.save();
                } else {
                    location.reload();
                }
            }.bind(this)
        });
    }
}
var Coupon = Class.create();
Coupon.prototype = {
    initialize: function (couponUpdateUrl) {
        this.couponUpdateUrl = couponUpdateUrl;
        this.onComplete = this.resetLoadWaiting.bindAsEventListener(this);
    }, update: function () {
        checkout.setLoadWaiting('review');
        new Ajax.Request(this.couponUpdateUrl, {
            method: 'post',
            parameters: {coupon_code: $('coupon_code').value, remove_coupon: $('remove_coupon').value},
            onSuccess: function (result) {
                result = JSON.parse(result.responseText);
                alert(result.message);
                checkout.reloadReviewBlock();
                this.onComplete;
            }.bind(this)
        });
    }, resetLoadWaiting: function () {
        checkout.setLoadWaiting(false);
    }
}