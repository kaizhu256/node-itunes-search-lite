/* istanbul instrument in package itunes_search */
/*jslint
    bitwise: true,
    browser: true,
    maxerr: 8,
    maxlen: 96,
    node: true,
    nomen: true,
    regexp: true,
    stupid: true
*/
(function () {
    'use strict';
    var local;



    // run shared js-env code - init-before
    (function () {
        // init local
        local = {};
        // init modeJs
        local.modeJs = (function () {
            try {
                return typeof navigator.userAgent === 'string' &&
                    typeof document.querySelector('body') === 'object' &&
                    typeof XMLHttpRequest.prototype.open === 'function' &&
                    'browser';
            } catch (errorCaughtBrowser) {
                return module.exports &&
                    typeof process.versions.node === 'string' &&
                    typeof require('http').createServer === 'function' &&
                    'node';
            }
        }());
        // init global
        local.global = local.modeJs === 'browser'
            ? window
            : global;
        // init utility2_rollup
        local = local.global.utility2_rollup || local;
        // init lib
        local.local = local.itunes_search = local;
        // init exports
        if (local.modeJs === 'browser') {
            local.global.utility2_itunes_search = local;
        } else {
            module.exports = local;
            module.exports.__dirname = __dirname;
            module.exports.module = module;
        }
    }());



    // run shared js-env code - function
    (function () {
        // init global.debug_inline
        local.global['debug_inline'.replace('_i', 'I')] = local.global[
            'debug_inline'.replace('_i', 'I')
        ] || function (arg) {
        /*
         * this function will both print the arg to stderr and return it
         */
            // debug arguments
            local['_debug_inlineArguments'.replace('_i', 'I')] = arguments;
            console.error('\n\n\ndebug_inline'.replace('_i', 'I'));
            console.error.apply(console, arguments);
            console.error();
            // return arg for inspection
            return arg;
        };

        local.ajax = function (options, onError) {
        /*
         * this function will send an ajax-request with error-handling and timeout
         */
            var timerTimeout, tmp, xhr;
            onError = local.onErrorWithStack(onError);
            // init modeServerLocal
            if (local.env &&
                    !local.env.npm_config_mode_backend &&
                    (local._serverLocalUrlTest && local._serverLocalUrlTest(options.url))) {
                xhr = new local._http.XMLHttpRequest();
            }
            // init xhr
            xhr = xhr || (local.modeJs === 'browser'
                ? new local.global.XMLHttpRequest()
                : new local._http.XMLHttpRequest());
            // debug xhr
            local._debugXhr = xhr;
            // init options
            local.objectSetOverride(xhr, options);
            // init headers
            xhr.headers = {};
            Object.keys(options.headers || {}).forEach(function (key) {
                xhr.headers[key.toLowerCase()] = options.headers[key];
            });
            // init method
            xhr.method = xhr.method || 'GET';
            // init modeForwardProxyUrl
            xhr.modeForwardProxyUrl = xhr.modeForwardProxyUrl || local.modeForwardProxyUrl;
            // init timeout
            xhr.timeout = xhr.timeout || local.timeoutDefault;
            // init timerTimeout
            timerTimeout = local.onTimeout(function (error) {
                xhr.error = xhr.error || error;
                xhr.abort();
                // cleanup requestStream and responseStream
                local.streamListCleanup([xhr.requestStream, xhr.responseStream]);
            }, xhr.timeout, 'ajax ' + xhr.method + ' ' + xhr.url);
            // init event handling
            xhr.onEvent = function (event) {
                // init statusCode
                xhr.statusCode = xhr.status;
                switch (event.type) {
                case 'abort':
                case 'error':
                case 'load':
                    // do not run more than once
                    if (xhr.isDone) {
                        return;
                    }
                    xhr.isDone = true;
                    // cleanup timerTimeout
                    clearTimeout(timerTimeout);
                    // cleanup requestStream and responseStream
                    setTimeout(function () {
                        local.streamListCleanup([xhr.requestStream, xhr.responseStream]);
                    });
                    // decrement ajaxProgressCounter
                    local.ajaxProgressCounter -= 1;
                    // handle abort or error event
                    if (!xhr.error &&
                            (event.type === 'abort' ||
                            event.type === 'error' ||
                            xhr.statusCode >= 400)) {
                        xhr.error = new Error(event.type);
                    }
                    // handle completed xhr request
                    if (xhr.readyState === 4) {
                        // debug xhr
                        if (xhr.modeDebug) {
                            console.error(new Date().toISOString(
                            ) + ' ajax-response ' + JSON.stringify({
                                statusCode: xhr.statusCode,
                                method: xhr.method,
                                url: xhr.url,
                                responseText: local.tryCatchOnError(function () {
                                    return xhr.responseText.slice(0, 256);
                                }, local.nop)
                            }));
                        }
                        // handle string data
                        if (xhr.error) {
                            // debug statusCode
                            xhr.error.statusCode = xhr.statusCode;
                            // debug statusCode / method / url
                            tmp = local.modeJs + ' - ' + xhr.statusCode + ' ' + xhr.method +
                                ' ' + xhr.url + '\n';
                            // try to debug responseText
                            local.tryCatchOnError(function () {
                                tmp += '    ' + JSON.stringify(xhr.responseText.slice(0, 256) +
                                    '...') + '\n';
                            }, local.nop);
                            local.errorMessagePrepend(xhr.error, tmp);
                        }
                    }
                    onError(xhr.error, xhr);
                    break;
                }
                local.ajaxProgressUpdate();
            };
            // increment ajaxProgressCounter
            local.ajaxProgressCounter += 1;
            xhr.addEventListener('abort', xhr.onEvent);
            xhr.addEventListener('error', xhr.onEvent);
            xhr.addEventListener('load', xhr.onEvent);
            xhr.addEventListener('loadstart', local.ajaxProgressUpdate);
            xhr.addEventListener('progress', local.ajaxProgressUpdate);
            xhr.upload.addEventListener('progress', local.ajaxProgressUpdate);
            // open url
            if (local.modeJs === 'browser' &&
                    xhr.modeForwardProxyUrl &&
                    (/^https{0,1}:/).test(xhr.url) &&
                    xhr.url.indexOf(location.protocol + '//' + location.host) !== 0) {
                xhr.open(xhr.method, xhr.modeForwardProxyUrl);
                xhr.setRequestHeader('forward-proxy-headers', JSON.stringify(xhr.headers));
                xhr.setRequestHeader('forward-proxy-url', xhr.url);
            } else {
                xhr.open(xhr.method, xhr.url);
            }
            Object.keys(xhr.headers).forEach(function (key) {
                xhr.setRequestHeader(key, xhr.headers[key]);
            });
            // debug xhr
            if (xhr.modeDebug) {
                console.error(new Date().toISOString() + ' ajax-request ' + JSON.stringify({
                    method: xhr.method,
                    url: xhr.url,
                    headers: xhr.headers,
                    data: xhr.data && xhr.data.slice &&
                        local.bufferToString(xhr.data.slice(0, 256))
                }));
            }
            if (local.FormData && xhr.data instanceof local.FormData) {
                // handle formData
                xhr.data.read(function (error, data) {
                    if (error) {
                        xhr.error = xhr.error || error;
                        xhr.onEvent({ type: 'error' });
                        return;
                    }
                    // send data
                    xhr.send(local.bufferToNodeBuffer(data));
                });
            } else {
                // send data
                xhr.send(local.bufferToNodeBuffer(xhr.data));
            }
            return xhr;
        };

        local.ajaxProgressUpdate = function () {
        /*
         * this function will update ajaxProgress
         */
            var ajaxProgressDiv1;
            ajaxProgressDiv1 = local.modeJs === 'browser' &&
                document.querySelector('#ajaxProgressDiv1');
            if (!ajaxProgressDiv1) {
                return;
            }
            // init transition
            ajaxProgressDiv1.style.transition = 'width 1500ms';
            // init ajaxProgressDiv1StyleBackground
            local.ajaxProgressDiv1StyleBackground = local.ajaxProgressDiv1StyleBackground ||
                ajaxProgressDiv1.style.background;
            // show ajaxProgress
            ajaxProgressDiv1.style.background = local.ajaxProgressDiv1StyleBackground;
            // increment ajaxProgress
            if (local.ajaxProgressCounter > 0) {
                // this algorithm will indefinitely increment the ajaxProgressBar
                // with successively smaller increments without ever reaching 100%
                local.ajaxProgressState += 1;
                ajaxProgressDiv1.style.width = Math.max(
                    100 - 75 * Math.exp(-0.125 * local.ajaxProgressState),
                    Number(ajaxProgressDiv1.style.width.slice(0, -1)) || 0
                ) + '%';
            } else {
                // finish ajaxProgress
                ajaxProgressDiv1.style.width = '100%';
            }
            // cleanup timerTimeout
            clearTimeout(local.timerTimeoutAjaxProgressHide);
            // hide ajaxProgress
            local.timerTimeoutAjaxProgressHide = setTimeout(function () {
                ajaxProgressDiv1.style.transition = 'background 500ms';
                ajaxProgressDiv1.style.background = 'transparent';
                local.ajaxProgressCounter = 0;
                local.ajaxProgressState = 0;
                // reset ajaxProgress
                setTimeout(function () {
                    // coverage-hack
                    local.nop(!local.ajaxProgressState && (function () {
                        ajaxProgressDiv1.style.transition = '';
                        ajaxProgressDiv1.style.width = '0%';
                    }()));
                }, 500);
            }, local.ajaxProgressCounter > 0
                ? local.timeoutDefault
                : 1500);
        };

        local.assert = function (passed, message) {
        /*
         * this function will throw the error message if passed is falsey
         */
            var error;
            if (passed) {
                return;
            }
            error = message && message.message
                // if message is an error-object, then leave it as is
                ? message
                : new Error(typeof message === 'string'
                    // if message is a string, then leave it as is
                    ? message
                    // else JSON.stringify message
                    : JSON.stringify(message));
            throw error;
        };

        local.bufferToNodeBuffer = function (bff) {
        /*
         * this function will convert the Uint8Array instance to a node Buffer instance
         */
            if (local.modeJs === 'node' &&
                    bff instanceof local.global.Uint8Array && (!Buffer.isBuffer(bff))) {
                Object.setPrototypeOf(bff, Buffer.prototype);
            }
            return bff;
        };

        local.errorMessagePrepend = function (error, message) {
        /*
         * this function will prepend the message to error.message and error.stack
         */
            error.message = message + error.message;
            error.stack = message + error.stack;
            return error;
        };

        local.nop = function () {
        /*
         * this function will do nothing
         */
            return;
        };

        local.objectSetDefault = function (arg, defaults, depth) {
        /*
         * this function will recursively set defaults for undefined-items in the arg
         */
            arg = arg || {};
            defaults = defaults || {};
            Object.keys(defaults).forEach(function (key) {
                var arg2, defaults2;
                arg2 = arg[key];
                // handle misbehaving getter
                try {
                    defaults2 = defaults[key];
                } catch (ignore) {
                }
                if (defaults2 === undefined) {
                    return;
                }
                // init arg[key] to default value defaults[key]
                if (!arg2) {
                    arg[key] = defaults2;
                    return;
                }
                // if arg2 and defaults2 are both non-null and non-array objects,
                // then recurse with arg2 and defaults2
                if (depth > 1 &&
                        // arg2 is a non-null and non-array object
                        arg2 &&
                        typeof arg2 === 'object' &&
                        !Array.isArray(arg2) &&
                        // defaults2 is a non-null and non-array object
                        defaults2 &&
                        typeof defaults2 === 'object' &&
                        !Array.isArray(defaults2)) {
                    // recurse
                    local.objectSetDefault(arg2, defaults2, depth - 1);
                }
            });
            return arg;
        };

        local.objectSetOverride = function (arg, overrides, depth, env) {
        /*
         * this function will recursively set overrides for items in the arg
         */
            arg = arg || {};
            env = env || (typeof process === 'object' && process.env) || {};
            overrides = overrides || {};
            Object.keys(overrides).forEach(function (key) {
                var arg2, overrides2;
                arg2 = arg[key];
                overrides2 = overrides[key];
                if (overrides2 === undefined) {
                    return;
                }
                // if both arg2 and overrides2 are non-null and non-array objects,
                // then recurse with arg2 and overrides2
                if (depth > 1 &&
                        // arg2 is a non-null and non-array object
                        (arg2 &&
                        typeof arg2 === 'object' &&
                        !Array.isArray(arg2)) &&
                        // overrides2 is a non-null and non-array object
                        (overrides2 &&
                        typeof overrides2 === 'object' &&
                        !Array.isArray(overrides2))) {
                    local.objectSetOverride(arg2, overrides2, depth - 1, env);
                    return;
                }
                // else set arg[key] with overrides[key]
                arg[key] = arg === env
                    // if arg is env, then overrides falsey value with empty string
                    ? overrides2 || ''
                    : overrides2;
            });
            return arg;
        };

        local.onErrorWithStack = function (onError) {
        /*
         * this function will create a new callback that will call onError,
         * and append the current stack to any error
         */
            var stack;
            stack = new Error().stack.replace((/(.*?)\n.*?$/m), '$1');
            return function (error, data, meta) {
                if (error &&
                        error !== local.errorDefault &&
                        String(error.stack).indexOf(stack.split('\n')[2]) < 0) {
                    // append the current stack to error.stack
                    error.stack += '\n' + stack;
                }
                onError(error, data, meta);
            };
        };

        local.onNext = function (options, onError) {
        /*
         * this function will wrap onError inside the recursive function options.onNext,
         * and append the current stack to any error
         */
            options.onNext = local.onErrorWithStack(function (error, data, meta) {
                try {
                    options.modeNext = error && !options.modeErrorIgnore
                        ? Infinity
                        : options.modeNext + 1;
                    onError(error, data, meta);
                } catch (errorCaught) {
                    // throw errorCaught to break infinite recursion-loop
                    if (options.errorCaught) {
                        throw options.errorCaught;
                    }
                    options.errorCaught = errorCaught;
                    options.onNext(errorCaught, data, meta);
                }
            });
            return options;
        };

        local.onTimeout = function (onError, timeout, message) {
        /*
         * this function will create a timeout-error-handler,
         * that will append the current stack to any error encountered
         */
            onError = local.onErrorWithStack(onError);
            // create timeout timer
            return setTimeout(function () {
                onError(new Error('onTimeout - timeout-error - ' +
                    timeout + ' ms - ' + (typeof message === 'function'
                    ? message()
                    : message)));
            // coerce to finite integer
            }, timeout | 0);
        };

        local.streamListCleanup = function (streamList) {
        /*
         * this function will end or destroy the streams in streamList
         */
            streamList.forEach(function (stream) {
                // try to end the stream
                local.tryCatchOnError(function () {
                    stream.end();
                }, function () {
                    // if error, then try to destroy the stream
                    local.tryCatchOnError(function () {
                        stream.destroy();
                    }, local.nop);
                });
            });
        };

        local.templateRender = function (template, dict) {
        /*
         * this function will render the template with the given dict
         */
            var argList, getValue, match, renderPartial, rgx, value;
            dict = dict || {};
            getValue = function (key) {
                argList = key.split(' ');
                value = dict;
                // iteratively lookup nested values in the dict
                argList[0].split('.').forEach(function (key) {
                    value = value && value[key];
                });
                return value;
            };
            renderPartial = function (match0, helper, key, partial) {
                switch (helper) {
                case 'each':
                    value = getValue(key);
                    return Array.isArray(value)
                        ? value.map(function (dict) {
                            // recurse with partial
                            return local.templateRender(partial, dict);
                        }).join('')
                        : '';
                case 'if':
                    partial = partial.split('{{#unless ' + key + '}}');
                    partial = getValue(key)
                        ? partial[0]
                        // handle 'unless' case
                        : partial.slice(1).join('{{#unless ' + key + '}}');
                    // recurse with partial
                    return local.templateRender(partial, dict);
                case 'unless':
                    return getValue(key)
                        ? ''
                        // recurse with partial
                        : local.templateRender(partial, dict);
                default:
                    // recurse with partial
                    return match0[0] + local.templateRender(match0.slice(1), dict);
                }
            };
            // render partials
            rgx = (/\{\{#(\w+) ([^}]+?)\}\}/g);
            template = template || '';
            for (match = rgx.exec(template); match; match = rgx.exec(template)) {
                rgx.lastIndex += 1 - match[0].length;
                template = template.replace(
                    new RegExp('\\{\\{#(' + match[1] + ') (' + match[2] +
                        ')\\}\\}([\\S\\s]*?)\\{\\{/' + match[1] + ' ' + match[2] +
                        '\\}\\}'),
                    renderPartial
                );
            }
            // search for keys in the template
            return template.replace((/\{\{[^}]+?\}\}/g), function (match0) {
                getValue(match0.slice(2, -2));
                if (value === undefined) {
                    return match0;
                }
                argList.slice(1).forEach(function (arg) {
                    switch (arg) {
                    case 'alphanumeric':
                        value = value.replace((/\W/g), '_');
                        break;
                    case 'decodeURIComponent':
                        value = decodeURIComponent(value);
                        break;
                    case 'encodeURIComponent':
                        value = encodeURIComponent(value);
                        break;
                    case 'htmlSafe':
                        value = value.replace((/["&'<>]/g), function (match0) {
                            return '&#x' + match0.charCodeAt(0).toString(16) + ';';
                        });
                        break;
                    case 'jsonStringify':
                        value = JSON.stringify(value);
                        break;
                    case 'jsonStringify4':
                        value = JSON.stringify(value, null, 4);
                        break;
                    case 'markdownCodeSafe':
                        value = value.replace((/`/g), '\'');
                        break;
                    default:
                        value = value[arg]();
                        break;
                    }
                });
                return String(value);
            });
        };

        local.tryCatchOnError = function (fnc, onError) {
        /*
         * this function will try to run the fnc in a try-catch block,
         * else call onError with the errorCaught
         */
            // validate onError
            local.assert(typeof onError === 'function', typeof onError);
            try {
                // reset errorCaught
                local._debugTryCatchErrorCaught = null;
                return fnc();
            } catch (errorCaught) {
                // debug errorCaught
                local._debugTryCatchErrorCaught = errorCaught;
                return onError(errorCaught);
            }
        };

        local.uiAnimateScrollTo = function (element) {
        /*
         * this function will scrollTo the element
         */
            var ii, timerInterval;
            ii = 0;
            timerInterval = setInterval(function () {
                ii += 0.025;
                local.global.scrollTo(0, document.body.scrollTop +
                    Math.min(ii, 1) * (element.offsetTop - document.body.scrollTop) +
                    -5);
            }, 25);
            setTimeout(function () {
                clearInterval(timerInterval);
            }, 1000);
        };

        local.uiAnimateSlideDown = function (element) {
        /*
         * this function will slideDown the dom-element
         */
            if (element.style.display !== 'none') {
                return;
            }
            element.style.maxHeight = 0;
            element.classList.add('uiAnimateSlide');
            element.style.display = '';
            setTimeout(function () {
                element.style.maxHeight = 2 * local.global.innerHeight + 'px';
            }, 20);
            setTimeout(function () {
                element.style.maxHeight = '';
                element.classList.remove('uiAnimateSlide');
            }, 500);
        };

        local.uiEventDelegate = function (event) {
            Object.keys(local.uiEventListenerDict).sort().some(function (key) {
                if (!(event.currentTarget.matches(key) || event.target.matches(key))) {
                    return;
                }
                switch (event.target.tagName) {
                case 'A':
                case 'BUTTON':
                case 'FORM':
                    event.preventDefault();
                    break;
                }
                event.stopPropagation();
                local.uiEventListenerDict[key](event);
                return true;
            });
        };

        local.uiEventInit = function (element) {
        /*
         * this function will init event-handling for the dom-element
         */
            ['Change', 'Click', 'Submit'].forEach(function (eventType) {
                Array.from(
                    element.querySelectorAll('.eventDelegate' + eventType)
                ).forEach(function (element) {
                    element.addEventListener(eventType.toLowerCase(), local.uiEventDelegate);
                });
            });
        };

        local.uiEventListenerDict = {};

        local.uiEventListenerDict['.onEventUiCardExpand'] = function (options) {
        /*
         * this function will expand the cardSelected
         */
            if (options.target.href) {
                window.open(options.target.href, '_blank');
                return;
            }
            local.cardSelected = options.target.closest('.card') || options.target;
            if (!local.cardSelected.classList.contains('card')) {
                return;
            }
            if (document.querySelector('.cardSelected') === local.cardSelected) {
                return;
            }
            Array.from(document.querySelectorAll('.cardSelected')).forEach(function (element) {
                element.classList.remove('cardSelected');
            });
            local.cardSelected.classList.add('cardSelected');
            local.cardExpanded.innerHTML = local.templateRender(
/* jslint-ignore-begin */
'\
<table>\n\
    <tr class="price"><td>Price:</td><td><a \n\
        href="{{trackViewUrl htmlSafe}}" \n\
        target="_blank" \n\
    >{{trackPriceFormatted htmlSafe}}</a>\n\
    </td></tr>\n\
    <tr class="title"><td>Title:</td><td>{{trackName htmlSafe}}</td></tr>\n\
    <tr class="artist"><td>Artist:</td><td>{{artistName htmlSafe}}</td></tr>\n\
    <tr class="date"><td>Release Date:</td><td>{{releaseDate htmlSafe}}</td></tr>\n\
    <tr class="description"><td>Description:</td><td>{{longDescription htmlSafe}}</td></tr>\n\
</table>\n\
',
/* jslint-ignore-end */
                local.data.results[local.cardSelected.dataset.ii]
            );
            Array.from(document.querySelectorAll('.card')).some(function (element, ii, list) {
                if (element.offsetTop > local.cardSelected.offsetTop) {
                    local.cardSelected.parentElement.insertBefore(local.cardExpanded, element);
                    return true;
                }
                if (ii + 1 === list.length) {
                    element.parentElement.appendChild(local.cardExpanded);
                }
            });
            if (local.cardExpanded.offsetTopPrevious !==
                    local.cardExpanded.offsetTop) {
                local.cardExpanded.style.display = 'none';
                local.uiAnimateSlideDown(local.cardExpanded);
                local.uiAnimateScrollTo(local.cardSelected);
            }
            local.cardExpanded.offsetTopPrevious = local.cardExpanded.offsetTop;
            document.querySelector('.cardExpandedArrow').style.top =
                (local.cardExpanded.offsetTop - 10) + 'px';
            document.querySelector('.cardExpandedArrow').style.left =
                (local.cardSelected.offsetLeft +
                0.5 * local.cardSelected.offsetWidth - 10) + 'px';
            return options;
        };

        local.uiEventListenerDict['.onEventUiReload'] = function (options) {
        /*
         * this function will reload the ui
         */
            local.onNext(options, function (error, data) {
                switch (options.modeNext) {
                case 1:
                    if (options.currentTarget.classList.contains('searchMediaA')) {
                        localStorage.searchMedia =
                            local.searchMediaDict[options.currentTarget.hash] || '#movie';
                        Array.from(document.querySelectorAll('.searchMediaA'))
                            .forEach(function (element) {
                                if (element.hash === localStorage.searchMedia) {
                                    element.classList.add('searchMediaASelected');
                                } else {
                                    element.classList.remove('searchMediaASelected');
                                }
                            });
                    }
                    localStorage.searchTerm =
                        document.querySelector('.searchTermInput').value || '';
                    local.ajax({ headers: {
                        'forward-proxy-url': 'https://itunes.apple.com/search?' +
                            'term=' +
                            (localStorage.searchTerm.replace((/\s+/g), '+') || 'the') +
                            '&media=' + localStorage.searchMedia.slice(1) +
                            '&limit=24'
                    }, url: 'https://h1-proxy1.herokuapp.com/' }, options.onNext);
                    break;
                case 2:
                    local.data = JSON.parse(data.responseText);
                    local.uiEventListenerDict['.onEventUiRender']();
                    break;
                default:
                    throw error;
                }
            });
            options.modeNext = 0;
            options.onNext();
        };

        local.uiEventListenerDict['.onEventUiRender'] = function () {
        /*
         * this function will render the ui
         */
            var key, options;
            options = local.data;
            if (!(options && options.results && options.results.length)) {
                document.querySelector('.grid').innerHTML =
                    '<div style="margin: 1rem;">No results</div>';
                return;
            }
            localStorage.searchSort = document.querySelector('.searchSortSelect').selectedIndex;
            // normalize
            options.results.forEach(function (element) {
                local.objectSetDefault(element, {
                    artistName: 'N/A',
                    longDescription: 'No description',
                    trackName: 'N/A',
                    trackViewUrl: ''
                });
                element.releaseDateFormatted = element.releaseDate
                    ? new Date(element.releaseDate).toString()
                    : 'N/A';
                element.releaseYear = element.releaseDate
                    ? element.releaseDate.slice(0, 4)
                    : 'N/A';
                element.trackPrice2 = Number(element.trackPrice) >= 0
                    ? Number(element.trackPrice)
                    : Number(element.collectionPrice);
                element.trackPriceFormatted = element.trackPrice2 && element.currency
                    ? element.trackPrice2 + ' ' + element.currency
                    : 'N/A';
            });
            // sort
            key = document.querySelector('.searchSortSelect').selectedOptions[0].dataset.value;
            options.results.sort(function (aa, bb) {
                aa = aa[key];
                bb = bb[key];
                if (key === 'releaseDate') {
                    return aa >= bb
                        ? -1
                        : 1;
                }
                return aa <= bb
                    ? -1
                    : 1;
            });
            options.results.forEach(function (element, ii) {
                element.ii = ii;
            });
            document.querySelector('.cardExpandedArrow').style.top = '';
            document.querySelector('.grid').innerHTML = local.templateRender(
/* jslint-ignore-begin */
'\
{{#each results}}\n\
    <div class="card" data-ii="{{ii}}">\n\
        <img src="{{artworkUrl100 htmlSafe}}">\n\
        <div class="price">{{trackPriceFormatted htmlSafe}}</div>\n\
        <div class="title">{{trackName htmlSafe}}</div>\n\
        <div class="artist">{{artistName htmlSafe}}</div>\n\
        <div class="date">{{releaseYear htmlSafe}}</div>\n\
    </div>\n\
{{/each results}}\n\
',
/* jslint-ignore-end */
                options
            );
        };
    }());
    switch (local.modeJs) {



    // run browser js-env code - init-after
    case 'browser':
        local.global.local = local;
        local.searchMediaDict = {
            '#movie': '#movie',
            '#music': '#music',
            '#musicVideo': '#musicVideo',
            '#podcast': '#podcast'
        };
        local.timeoutDefault = 30000;
        local.cardExpanded = document.querySelector('.cardExpanded');
        // init event-handling
        local.uiEventInit(document.body);
        // init state
        local.tryCatchOnError(function () {
            localStorage.test = Object.keys(local);
            delete localStorage.test;
        }, function () {
            localStorage.clear();
        });
        localStorage.searchMedia = local.searchMediaDict[localStorage.searchMedia] || '#movie';
        document.querySelector('.searchSortSelect').selectedIndex = Math.min(
            localStorage.searchSort || 0,
            document.querySelector('.searchSortSelect').length
        );
        document.querySelector('.searchTermInput').value = localStorage.searchTerm || '';
        // reload-ui
        document.querySelector('[href="' + localStorage.searchMedia + '"]').click();
        if (local.global.fileElectronHtml) {
            setTimeout(function () {
                console.error(local.global.fileElectronHtml + ' global_test_results ' +
                    JSON.stringify({ global_test_results: {
                        coverage: local.global.__coverage__,
                        testReport: { testPlatformList: [{}] }
                    } }));
            }, 5000);
        }
        break;
    }
}());
