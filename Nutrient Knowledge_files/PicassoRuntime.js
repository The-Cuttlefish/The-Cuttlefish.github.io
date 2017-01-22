var picassoRuntime = {
    visibilityEffect: { None: "none", HorizontalBlind: "hblind", Fade: "fade" },
    runScript: function(target, callback)
    {
        var element = $(target).get(0);

        callback.apply(this, [element]);
    },
    parseEffectString: function(effect)
    {
        effect = jQuery.trim(effect).toLowerCase();
        if (effect === '')
        {
            effect = picassoRuntime.visibilityEffect.None;
        }

        return effect;
    },
    hide: function(target, effect, speed, callback)
    {
        // Ok if callback hsa no value
        if (target && effect && speed)
        {
            effect = picassoRuntime.parseEffectString(effect);

            switch (effect)
            {
                default:
                    {
                        jQuery(target).hide(effect, null, speed);

                        if (callback)
                        {
                            callback.call();
                        }
                    }
                    break;
                case picassoRuntime.visibilityEffect.None:
                    {
                        jQuery(target).hide();

                        if (callback)
                        {
                            callback.call();
                        }
                    }
                    break;
                case picassoRuntime.visibilityEffect.Fade:
                    {
                        jQuery(target).animate({ opacity: "hide" }, speed, null, callback);
                    }
                    break;
                case picassoRuntime.visibilityEffect.HorizontalBlind:
                    {
                        jQuery(target).animate({ width: "hide" }, speed, null, callback);
                    }
                    break;
            }
        }
    },
    show: function(target, effect, speed, callback)
    {
        // Ok if callback has no value
        if (target && effect && speed)
        {
            effect = picassoRuntime.parseEffectString(effect);

            switch (effect)
            {
                default:
                    {
                        jQuery(target).show(effect, null, speed);

                        if (callback)
                        {
                            callback.call();
                        }
                    }
                    break;

                case picassoRuntime.visibilityEffect.None:
                    {
                        jQuery(target).show();

                        if (callback)
                        {
                            callback.call();
                        }
                    }
                    break;
                case picassoRuntime.visibilityEffect.Fade:
                    {
                        jQuery(target).animate({ opacity: "show" }, speed, null, callback);
                    }
                    break;
                case picassoRuntime.visibilityEffect.HorizontalBlind:
                    {
                        jQuery(target).animate({ width: "show" }, speed, null, callback);
                    }
                    break;
            }

        }
    },
    toggle: function(target, effect, speed, callback)
    {
        // Ok if callback hsa no value
        if (target && effect && speed)
        {
            effect = picassoRuntime.parseEffectString(effect);
            switch (effect)
            {
                default:
                    {
                        jQuery(target).toggle(effect, null, speed);

                        if (callback)
                        {
                            callback.call();
                        }
                    }
                    break;
                case picassoRuntime.visibilityEffect.None:
                    {
                        jQuery(target).toggle();

                        if (callback)
                        {
                            callback.call();
                        }
                    }
                    break;
                case picassoRuntime.visibilityEffect.Fade:
                    {
                        jQuery(target).animate({ opacity: "toggle" }, speed, null, callback);
                    }
                    break;
                case picassoRuntime.visibilityEffect.HorizontalBlind:
                    {
                        jQuery(target).animate({ width: "toggle" }, speed, null, callback);
                    }
                    break;
            }
        }
    },
    libraryItem: function(partial, target, effect, speed, callback)
    {
        if (partial && target && effect && speed)
        {
            picassoRuntime.hide(target, effect, speed, function()
            {
                // Move existing children out of background
                picassoRuntime._replaceChildren(target, partial);

                // and the show
                picassoRuntime.show(target, effect, speed, callback);

                //Original - loads via URL
                //jQuery(target).load(partial, null, function()
                //{
                //picassoRuntime.show(target, effect, speed, callback);
                //});
            });
        }
    },
    popup: function(partial, target, effect, anchor, callback)
    {
        alert("Popup window not yet implemented");
    },
    showColorBox: function(effect, speed, useBackground, callback)
    {
        var bg = 0.0;

        if (useBackground)
            bg = 0.8;

        $.fn.colorbox({ opacity: bg, transition: effect, inline: true, href: "#runtimeDialogContainer", open: true, showOutline: false }, callback);

        $("#runtimeDialogContainer").bind('cbox_cleanup', function()
        {
            picassoRuntime.hideDialog();
        });
    },
    showDialog: function(partial, effect, callback, useBackground, useFrame)
    {
        var background = picassoRuntime._getBackgroundPanel();

        var container = jQuery("#runtimeDialogContainer");

        // Move existing children out of container
        picassoRuntime._replaceChildren(container, partial);

        // show the container
        if (useFrame)
        {
            // use the pre-styled frame
            container.css({ "position": "" });
            container.show();
            container.click(function(){});
            picassoRuntime.showColorBox(effect, "normal", useBackground, callback);
        }
        else
        {
            // user-styled frame

            if (picassoRuntime.parseEffectString(effect) == "elastic")
            {
                effect = "slide";
            }

            // request data for centering
            var windowWidth = document.documentElement.clientWidth;
            var windowHeight = document.documentElement.clientHeight;
            var popupHeight = $(partial).height();
            var popupWidth = $(partial).width();

            // If we don't have an explicit height - let the browser center it horizontally
            // and offset a fixed height from the top
            if (popupHeight == 0 || popupWidth == 0)
            {
                // Browser horizontal centering
                $(partial).css({ "position": "relative", "top": windowHeight / 6, "margin": "0 auto" });
            }
            else
            {
                // Explicit center
                $(partial).css({ "position": "absolute", "top": windowHeight / 2 - popupHeight / 2, "left": windowWidth / 2 - popupWidth / 2 });
            }

            if (useBackground)
            {
                // Set background opacity
                jQuery(background).css({ "opacity": "0.7" });

                // Need to give IE6 a helping hand..
                background.css({ "height": windowHeight });

                // Show the background element
                picassoRuntime.show(background, effect, "normal", callback);
            }

            container.css({ "position": "fixed" });

            jQuery(container).click(function()
            {
                picassoRuntime.hideDialog();
            });

            // show the container
            picassoRuntime.show(container, effect, "normal", null);
        }
    },
    hideDialog: function()
    {
        var background = picassoRuntime._getBackgroundPanel();

        jQuery("#runtimeDialogContainer").hide();
        jQuery(background).fadeOut("slow");
    },
    timer: function(delay, callback)
    {
        if (callback && delay)
        {
            setTimeout(callback, delay);
        }
    },
    repeat: function(delay, count, callback)
    {
        // Convert count to integer
        count = parseInt(count);
        delay = parseInt(delay);

        if (callback && delay != 0)
        {
            if (count != 0)
            {
                for (var counter = 0; counter < count; counter++)
                {
                    setTimeout(callback, delay * (counter + 1));
                }
            }
            else
            {
                setInterval(callback, delay);
            }
        }
    },
    _getBackgroundPanel: function()
    {
        var background = jQuery("#runtimeDialogBackground");
        if (background.length == 0)
        {
            background = jQuery("<div id='runtimeDialogBackground' style='display: none;position:fixed;_position:absolute;left: 0; top: 0; width: 100%; height: 100%; background-color: black;'></div>");

            jQuery(background).insertAfter("#libraryItemPlaceholders");
            jQuery(background).click(function()
            {
                picassoRuntime.hideDialog();
            });
        }

        var container = jQuery('#runtimeDialogContainer');
        if (container.length == 0)
        {
            container = jQuery("<div id='runtimeDialogContainer' style='display: hidden; absolute;left: 0; top: 0; width: 100%; height: 100%; z-index: 10000'></div>");
            jQuery(container).insertAfter("#runtimeDialogBackground");
        }

        return background;
    },
    _replaceChildren: function(target, child)
    {
        // Move existing children out of source panel
        jQuery(target).children().appendTo("#libraryItemPlaceholders");

        // And new child into source
        jQuery(child).appendTo(target);
    },
    OnAction: function(src)
    {
        this.UpdateRepeaterIndex(src);
    },
    UpdateRepeaterIndex: function(sourceElement)
    {
        if (sourceElement == null)
        {
            return;
        }
        // updates a hidden input control with the 'current' repeater index
        var repeaterIndex = $(sourceElement).parents("div[rptr-idx]").attr('rptr-idx');
        if (repeaterIndex != null)
        {
            $("#sm_rptr_idx").val(repeaterIndex);
        }
    },
    GetParameters: function() {
        var url = window.location.toString();

        url.match(/\?(.+)$/);
        var params = RegExp.$1;

        var params = params.split("&");
        var queryStringList = {};

        for(var i=0; i<params.length; i++) {
            var tmp = params[i].split("=");
            queryStringList[tmp[0]] = unescape(tmp[1]);
        }
        return queryStringList;
    },
    ChangeQueryOffset: function(queryID, delta) {
        var newHref = window.location.href;
        if(newHref.indexOf('?') != -1) {
            newHref = newHref.substring(0, newHref.indexOf('?'));
        }
        params = picassoRuntime.GetParameters();

        var absolute = false;

        if(!delta.indexOf || (delta.indexOf('+') == -1 && delta.indexOf('-') == -1)) {
            absolute = true;
        }

        var deltaAsInt = parseInt(delta);

        if(params[queryID] && !absolute) {
            var newPage = parseInt(params[queryID]) + deltaAsInt;
            if(newPage < 0) {
                newPage = 0;
            }
            params[queryID] = newPage;
        } else {
            if(deltaAsInt < 0) {
                deltaAsInt = 0;
            }
            params[queryID] = deltaAsInt;
        }

        newHref = newHref + '?';
        for(var param in params) {
           if(param)
               newHref = newHref + param + '=' + params[param] + '&';
        }
        newHref = newHref.substring(0, newHref.length - 1);
        window.location.replace(newHref);
    },
    SetQueryOffset: function(queryID, fieldID) {
        var value = $('input[data-fieldid="' + fieldID +'"]').val();
        if (isNaN(value) || value < 0) {
            return;
        }
        if(value == 0) {
            value = 1;
        }
        picassoRuntime.ChangeQueryOffset(queryID, parseInt(value) - 1);
    },
    SubmitFormWithValidation: function(formID,submitElement) {
        var contentType = "application/json; charset=utf-8";
        var url = "sfruntime";
        var type = "json";
        var values = {};
        var formSelector = "[itemid=" + formID + "]";
        
        // when choosing which form to act on, we need to account for the possibility of 
        // multiple forms on a page (can happen if forms are re-used through widgets)
        var $form = null;
        if (submitElement) {
            // if this submit element exists inside a form, prefer that form and ignore all others
            $form = $(submitElement).parents(formSelector);
        }
        
        if ($form == null || $form.size() == 0) {
            // no submit element; assume all forms on page with this id should be used
            $form = $(formSelector);
        }
        

        values = picassoRuntime.collectValuesFromForm($form);
        // Form that we are submitting
        values["formID"] = formID;
        
        // TODO: handle any 'submitting' views (show/hide)

        // fast switch to loading view
        //formElement.animate({ opacity: "hide" }, "fast", null, function() {

            //formElement.html($("[itemid=" + formID + "Loading]").html());
            //formElement.show();
            var handler = {};
            if (formHandlers && formHandlers[formID]) {
                handler = formHandlers[formID];
            }
            handler.setForm($form);

            if (typeof handler.validate === 'function' && !handler.validate()) {
            return;
            }
            
            if (handler.onSubmit) {
                handler.onSubmit();
            }

            // Post it
            $.post(url, values, function(result) {
                if (result.ERROR) {
                    if (result.ERROR.VIEW === "Error"){
                        var errorViewHtml = $("[itemid=" + result.ERROR.ITEMID + "Error]").html();
                        $("[itemid=" + result.ERROR.ITEMID + "]").animate({ opacity: "hide" }, "slow", null, function() {
                            $(this).html(errorViewHtml).show();
                        });
                    } else if (handler.onError) {
                        handler.onError(result.ERROR);
                    } else if (console.log) {
                        console.log("Form could not be submitted: " + result.ERROR);
                    }
                } else {
                    if (handler.onSuccess) {
                        handler.onSuccess(result.SUCCESS);
                    }
                        if (result.SUCCESS.REDIRECT) {
                        document.location.href = result.SUCCESS.REDIRECT;
                    }
                }

                    //formElement.animate({ opacity: "hide" }, "slow", null, function() {
                        // switch to final view
                    //    formElement.html($("[itemid=" + formID + (results != "false" ? "Acknowledgement" : "Error") + "]").html());
                    //    formElement.show();
                    //});

            });
       // });

    }, 
    
    collectValuesFromForm: function($form) { 
        var values = {};
        // Package up the fields
        $form.find("[data-fieldid]").each( function() {
            var $input = $(this);
            var key = $input.attr("data-fieldid");
            var value = $input.val();
            if ($input.attr('type') == 'checkbox') {
                value = $input.is(':checked');
            } else if ($input.attr('radiogrp') == 'true') {
                value = $input.find('input:checked').val();
            } else if ($input.hasClass('rta')) {
                value = $input.data('CKE').getData();
            }

            if (value === null) {
                value = '';
            }

            values[key] = value;
        });
        return values;
    },

    RuntimeService: {
        /**
         * performs an ajax POST with the given method + parameters + query string
         */
        call: function(method, parameters, successCallback, errorCallback, queryString) {
            var postUrl = "sfsites/sfservice?Method=" + method;
            if (queryString) {
                postUrl = postUrl + "&" + queryString;
            }

            var ajaxOptions = {
                type : "POST",
                url : postUrl,
                contentType : "application/json; charset=utf-8",
                dataType : "json",
                async: true,
                data : JSON.stringify({params : parameters}),
                success : successCallback,
                error : errorCallback
            };

            $.ajax(ajaxOptions);
        },
        
        /**
         * GET version of the above RuntimeService.call(..) function
         */
        call_get: function(method, parameters, successCallback, errorCallback) {
            var getUrl = "sfsites/sfservice?Method=" + method;

            var on_complete = function(data,status,xhr) {
                if (status === "error" || status === "timeout" || status === "parsererror" || (data && data.error) ) {
                    errorCallback(data);
                } else {
                    successCallback(data);
                }
            };
            
            $.get(getUrl,parameters,on_complete,"json");
        },
        
        /**
         * generic render method for a single component (componentId can point to a page component, widget, or route)
         */
        renderComponent: function(componentId, params, successCB, failCB) {
            var queryString = null;
            if (typeof(params) === "undefined") {
                params = {};
            }
            params["picasso_id"] = componentId;

            this.call_get("RenderComponent",params,successCB,failCB,queryString);
        },
        
        /**
         * performs an ajax render call based on  a route URL e.g. /routeUrl/some:id
         */
        renderRouteUrl: function(routeUrl, successCB, failCB) {
            this.call("RenderRouteUrl",[routeUrl],successCB,failCB);
        }
    }
};
