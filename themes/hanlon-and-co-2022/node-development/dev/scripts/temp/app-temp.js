"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* * BC custom scripts - Hanlon & Co solicitors 2022
 * BigCat Design, Dublin
 * @preserve 
*/
var bcFunctions = function bcAppJS() {
  var debug = false;

  if (debug) {
    console.log('Hanlon & Co WP theme here');
    console.log('Debug is go');
    console.log('===========');
    console.log('...');
  }
  /*** AJAX functions **/


  function bcAJAX(url, options) {
    if (options !== undefined) {
      return fetch(url, options);
    } else {
      return fetch(url);
    }
  }

  function bcGetJSON(url, opts) {
    var options = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (opts) {
      options = Object.assign(options, opts);
    }

    return bcAJAX(url, options).then(function (data) {
      return Promise.resolve(data);
    }).catch(function (err) {
      return Promise.reject(err);
    });
  }
  /*** Utils */

  /*
  	Use getBoundingClientRect to get the top and left offsets for an element - used with lerp scroll for the target argument value
  	$el: the element whose offsets are required
  */


  function bcGetOffset() {
    var $el = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document.querySelector('body');

    if (debug) {
      console.log("bcGetOffset()");
      console.log("-------------");
      console.log("$el: ".concat($el));
    }

    var elRect = $el.getBoundingClientRect();
    var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return {
      top: elRect.top + scrollTop,
      left: elRect.left + scrollLeft
    };
  }
  /*** Animation functions **/

  /*
  	bcLerpScroll - scroll an element (usually the window) to some target target using linear interpolation
  		en.wikipedia.org/wiki/Linear_interpolation
  		
  	return: null
  	$el: and element to scroll
  	pos: start position
  	target: target position
  	[speed]: scroll speed 
  */
  //Liner interpolation


  if (debug) {
    var i = 0;
  }

  function bcLerpScroll($el, pos, target) {
    var speed = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.1;
    pos = Math.floor(pos);
    target = Math.floor(target);

    if (debug) {
      console.log("Lerp ".concat(i));
      console.log("---------");
      console.log("$el: ".concat($el.classList, " pos: ").concat(Math.floor(pos), " target: ").concat(Math.floor(target), " speed: ").concat(speed));
    }

    var scrollOpts = {}; //Scroll down

    if (Math.floor(pos) < Math.floor(target)) {
      if (debug) {
        console.log("Scroll down");
        console.log("Target - Pos * speed: ".concat(Math.ceil((target - pos) * speed)));
      }

      pos += Math.ceil((target - pos) * speed);

      if (debug) {
        console.log("New postion: ".concat(pos, " ").concat(target));
      }

      scrollOpts = {
        top: pos,
        left: 0,
        behavior: 'auto'
      };
      $el.scroll(scrollOpts);

      if (debug) {
        i++;
      }

      requestAnimationFrame(function () {
        bcLerpScroll($el, pos, target);
      }); //Scroll up
    } else if (Math.floor(pos) > Math.floor(target)) {
      if (debug) {
        console.log("Scroll up");
        console.log("".concat(pos, " ").concat(target));
        console.log("".concat(pos - target));
      }

      pos -= (pos - target) * speed;

      if (debug) {
        console.log("".concat(pos, " ").concat(target));
      }

      scrollOpts = {
        top: pos,
        left: 0,
        behavior: 'auto'
      };
      $el.scroll(scrollOpts);

      if (debug) {
        console.log("".concat($el.scrollY));
        i++;
      }

      requestAnimationFrame(function () {
        bcLerpScroll($el, pos, target);
      });
    } else {
      if (debug) {
        console.log('Snap to target');
      }

      scrollOpts = {
        top: target,
        left: 0,
        behavior: 'auto'
      };
      $el.scroll(scrollOpts);

      if (debug) {
        console.log("Target: ".concat(target, " Final position: ").concat($el.scrollY));
      }

      return;
    }
  } //Lerp scroll

  /*
  	bcAdjustHeight - adjust the height of an element to some target target using linear interpolation
  	It is a show/hide function with a callback
  	Wrapper for bcLearpHeight
  		en.wikipedia.org/wiki/Linear_interpolation
  		
  	return: null
  	$el: and element show/hide
  	pos: start position
  	target: target position
  	[speed]: scroll speed 
  	[cb]: callback function
  */


  function bcAdjustHeight($el, target) {
    var speed = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.075;
    var cb = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    bcLerpHeight($el, target, speed);

    function bcLerpHeight($el, target) {
      var speed = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.075;

      if (debug) {
        console.log("$el height: ".concat($el.style.height));
      } //the currrent el height


      var h = $el.style.height !== '' && $el.style.height !== undefined ? parseFloat($el.style.height) : $el.clientHeight;

      if (debug) {
        if (i > 500) {
          return;
        }

        console.log("Lerp ".concat(i));
        console.log("---------");
        console.log("Height: ".concat(h, " Target: ").concat(target));
        console.log("Difference: ".concat(h - target));
      }

      if (Math.floor(target) > Math.floor(h)) {
        if (debug) {
          console.log("Target > Height");
          console.log("Raw height to add: ".concat((target - h) * speed));
        }

        h += Math.ceil((target - h) * speed);

        if (debug) {
          console.log("New height: ".concat(h, " Target: ").concat(target));
        }

        requestAnimationFrame(function () {
          $el.style.height = h + 'px';
        }); //$el.style.height = h + 'px';

        if (debug) {
          console.log("Element style.height: ".concat($el.style.height));
          i++;
        }

        bcLerpHeight($el, target, speed);
      } else if (Math.floor(h) > Math.floor(target)) {
        if (debug) {
          console.log("Height > Target");
          console.log("Raw height to subtract: ".concat((h - target) * speed));
        }

        h -= Math.ceil((h - target) * speed);

        if (debug) {
          console.log("New height: ".concat(h, " Target: ").concat(target));
        }

        requestAnimationFrame(function () {
          $el.style.height = h + 'px';
        });

        if (debug) {
          console.log("".concat($el.style.height));
          i++;
        }

        bcLerpHeight($el, target, speed);
      } else {
        return;
      }
    } //Lerp scroll


    if (typeof cb === 'function') {
      cb();
    }

    return;
  } //bcAdjustHeight

  /* 
  	Scroll links
  	For on page vertical scrolling
  */


  if (debug) {
    console.log('Scroll links');
    console.log('------------');
  }

  var scrollLinks = Array.from(document.querySelectorAll('.bc-scroll-link'));

  if (debug) {
    console.log("scrollLinks length: ".concat(scrollLinks.length));
    console.log("scrollLinks length: ".concat(scrollLinks[0]));
  }

  scrollLinks.forEach(function ($link) {
    if (debug) {
      console.log($link);
    }

    if (document.getElementById($link.getAttribute('href').substr(1))) {
      $link.addEventListener('click', function (evt) {
        evt.preventDefault();
        var $scrollTargetEl = document.getElementById($link.getAttribute('href').substr(1));
        var scrollTarget = bcGetOffset($scrollTargetEl).top;
        bcLerpScroll(document.documentElement, document.documentElement.scrollTop, scrollTarget);
      });
    }
  });
  /* Show/hide (accordion) components
   * $el: element to show or hide
   * target: element target height as an integer
   * cb: a callback
  */

  function bcShowHide($el, targetHeight, cb) {
    var _arguments = arguments;

    if (debug) {
      console.log('bcShowHide function, target height:');
      console.log(targetHeight);
    }

    targetHeight = Number.parseInt(targetHeight);
    requestAnimationFrame(function () {
      $el.style.maxHeight = targetHeight + 'px';
    });

    if (typeof cb === 'function') {
      $el.addEventListener('transitionend', function () {
        requestAnimationFrame(function () {
          cb();
        });
        $el.removeEventListener('transitionend', _arguments.callee);
      });
    }
  } //bcShowHide()


  var showHideComponents = Array.from(document.querySelectorAll('.bc-show-hide'));

  if (debug) {
    console.log("Show/hide accordion components");
    console.log("--------------------");
    console.log("Length: ".concat(showHideComponents.length));
  }

  showHideComponents.forEach(function ($showHideComponent, idx) {
    if (debug) {
      console.log("Accordion component #".concat(idx + 1, ":"));
      console.log($showHideComponent.classList);
    } //Show hide toggles


    var showHideToggles = Array.from($showHideComponent.querySelectorAll('.bc-show-hide__toggle'));
    showHideToggles.forEach(function ($showHideToggle) {
      var $showHideBody = $showHideToggle.nextElementSibling;

      if (debug) {
        console.log('Accordion body scrollHeight: ');
        console.log($showHideBody.scrollHeight);
        console.log('Accordion toggle classlist: ');
        console.log($showHideToggle.classList);
      } //Show/hide toggle listener


      $showHideToggle.addEventListener('click', function (evt) {
        evt.preventDefault();

        if ($showHideToggle.classList.contains('bc-is-active')) {
          if (debug) {
            console.log('This accordion body is active.');
          }

          bcShowHide($showHideBody, 0);
          $showHideToggle.classList.remove('bc-is-active');
        } else {
          if (debug) {
            console.log('This accordion body is inactive.');
          }

          bcShowHide($showHideBody, $showHideBody.scrollHeight);
          $showHideToggle.classList.add('bc-is-active');
        }
      }); //Accordion closer in the accordion body

      if ($showHideBody.querySelector('.bc-show-hide__hide')) {
        var $showHideBodyClose = $showHideBody.querySelector('.bc-show-hide__hide');
        $showHideBodyClose.addEventListener('click', function () {
          if ($showHideToggle.classList.contains('bc-is-active')) {
            bcShowHide($showHideBody, 0);
            $showHideToggle.classList.remove('bc-is-active');
          }
        });
      }
    });
  });
  /* Main site navigation */

  function mainNavigationSetup() {
    debug = false;
    var $siteHeader = document.querySelector('.bc-site-header');
    var $siteHeaderMenuLink = document.querySelector('.bc-site-header__menu-link');
    var $siteHeaderMainNav = document.querySelector('.bc-site-header__main-navigation');

    if ($siteHeader && $siteHeader !== undefined && $siteHeaderMenuLink && $siteHeaderMenuLink !== undefined && $siteHeaderMainNav && $siteHeaderMainNav !== undefined) {
      if (debug) {
        console.log("Main navigation set up");
        console.log("----------------------");
        console.log("window.outerWidth is ".concat(window.outerWidth));
      }
    }
    /* 
    	start
    	-- nav hidden --
    	onclick navLink
    	-- nav visible --
    	onclick navLink
    	-- nav visible --
    */


    function menuIconClickHandler(evt) {
      evt.preventDefault();
      requestAnimationFrame(function () {
        $siteHeader.classList.toggle('bc-is-active');
        var $bodyWrap = document.querySelector('.bc-body-wrap');
        $bodyWrap.classList.toggle('bc-main-nav-open');
      });

      if (debug) {
        console.log("Header class list: ".concat($siteHeader.classList));
      }
    }

    $siteHeaderMenuLink.removeEventListener('click', menuIconClickHandler);
    $siteHeaderMenuLink.addEventListener('click', menuIconClickHandler);
    debug = false;
  } //mainNavigationSetup()

  /* Flickity Sliders */


  var $bcFlkSliders = document.querySelectorAll('.bc-flickity');

  function setUpSliders(sliders) {
    Array.from(sliders).forEach(function ($bcFlkSlider, idx) {
      if (debug) {
        console.log("Sliders foreach");
        console.log("Sliders idx: ".concat(idx));
      }

      var sliderType = $bcFlkSlider.classList.contains('bc-flickity--text-slider') ? 'text-slider' : $bcFlkSlider.classList.contains('bc-flickity--card-slider') ? 'card-slider' : 'video-slider';
      var slidesLen = $bcFlkSlider.querySelectorAll('.bc-flickity__slide').length;

      if (debug) {
        console.log("Slider type: ".concat(sliderType));
      }

      var flkSlider = new Flickity($bcFlkSlider, {
        adaptiveHeight: sliderType === 'text-slider' ? true : false,
        cellAlign: sliderType === 'card-slider' ? 'left' : 'center',
        groupCells: true,
        cellSelector: '.bc-flickity__slide',
        prevNextButtons: sliderType === 'text-slider' ? false : true,
        pageDots: slidesLen > 1 ? true : false
      });

      if (sliderType === 'text-slider') {
        var nextButton = document.querySelector('.flickity-prev-next-button.next');
        var prevButton = document.querySelector('.flickity-prev-next-button.previous');

        if (prevButton !== null && prevButton !== undefined && nextButton == null && nextButton !== undefined) {
          nextButton.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('click');
            flkSlider.next();
          });
          prevButton.addEventListener('click', function (e) {
            e.preventDefault();
            flkSlider.previous();
          });
          prevButton.setAttribute('disabled', '');
          flkSlider.on('change', function (idx) {
            console.log(idx);

            if (idx === flkSlider.cells.length - 1) {
              nextButton.setAttribute('disabled', '');
            } else {
              nextButton.removeAttribute('disabled');
            }

            if (idx === 0) {
              prevButton.setAttribute('disabled', '');
            } else {
              prevButton.removeAttribute('disabled');
            }
          });
        }
      }

      flkSlider.select(0);
      flkSlider.on('change', function () {
        var videoSlides = $bcFlkSlider.querySelectorAll('.bc-flickity__slide--video');

        if (videoSlides && videoSlides.length > 0) {
          Array.from(videoSlides).forEach(function (slide) {
            slide.querySelector('iframe').stopVideo();
          });
        }
      });
    }); //end foreach bcFlkSliders
  } //end setUpSliders()


  if ($bcFlkSliders && $bcFlkSliders.length > 0) {
    if (debug) {
      console.log('Flickity slider set up.');
      console.log('-----------------------');
      console.log("$bcFlkSliders length is ".concat($bcFlkSliders.length));
    }

    setUpSliders($bcFlkSliders);
    window.addEventListener('resize', function () {
      setUpSliders($bcFlkSliders);
    });
  } //end if $bcFlkSliders

  /* Custom -- services - corporate/individual - homepage */


  if (debug) {
    console.log('');
    console.log('Services component');
    console.log('------------------');
  }

  var $bcTwinComponents = Array.from(document.querySelectorAll('.bc-twin-component'));

  if ($bcTwinComponents.length > 0) {
    //* For each service block on the page */
    $bcTwinComponents.forEach(function ($bcTwinComponent) {
      /* Set up the images - array and current active image ID */
      var componentImages = Array.from($bcTwinComponent.querySelectorAll('.bc-twin-component__image'));

      if (componentImages.legth === 0) {
        return;
      }
      /* The service triggers - on hover */


      var componentTriggers = Array.from($bcTwinComponent.querySelectorAll('.bc-twin-component__trigger'));

      if (componentTriggers.length > 0) {
        componentTriggers.forEach(function ($componentTrigger) {
          $componentTrigger.addEventListener('mouseover', function (evt) {
            evt.stopPropagation();
            var $thisTrigger = evt.currentTarget;
            var serviceID = $thisTrigger.dataset.service;

            if ($thisTrigger.classList.contains('is-active')) {
              return;
            }

            var $activeServiceImage = componentImages.find(function ($serviceImage) {
              return $serviceImage.classList.contains('is-active');
            });

            if ($activeServiceImage.getAttribute('id') === serviceID) {
              return;
            }

            $activeServiceImage.classList.remove('is-active');
            var $newServiceImage = $bcTwinComponent.querySelector('#' + serviceID);

            if ($newServiceImage) {
              $newServiceImage.classList.add('is-active');
              $thisTrigger.classList.add('is-active');
            } else {
              return;
            }
          }); // This $componentTrigger mouseover

          componentTriggers.forEach(function (componentTrigger) {
            componentTrigger.addEventListener('mouseleave', function (evt) {
              evt.preventDefault();
              componentTrigger.classList.remove('is-active');
            });
          });
        }); // componentTriggers for each
      } // end if componentTriggers

    }); // end $bcTwinComponents for each
  } //end if $bcTwinComponents is > 0

  /* Match height elements */


  function matchHeights() {
    if (document.querySelectorAll('.bc-match-height-wrap')) {
      var matchHeightWraps = Array.from(document.querySelectorAll('.bc-match-height-wrap'));

      if (debug) {
        console.log('Found ' + matchHeightWraps.length + ' match height wrap(s)');
      }

      matchHeightWraps.forEach(function (el, idx) {
        var targetHeight = 0;
        var $thisWrapper = el;
        var matchElements = [];

        if ($thisWrapper.querySelectorAll('.bc-match-height')) {
          matchElements = Array.from($thisWrapper.querySelectorAll('.bc-match-height'));
          matchElements.forEach(function (matchElement, idx, thisArr) {
            if (debug) {
              console.log('Target height: ' + targetHeight);
              console.log(matchElement.style.height);
            }

            matchElement.style.height = null;

            if (debug) {
              console.log(matchElement.clientHeight);
              console.log(matchElement);
            }

            var thisElementStyles = getComputedStyle(matchElement);
            var thisElHeight = matchElement.scrollHeight;

            if (debug) {
              console.log('This matchElement height is ' + thisElHeight + ' Index is ' + idx);
              console.log('This matchElement paddingTop is ' + thisElementStyles.paddingTop + ' Index is ' + idx);
              console.log('This matchElement paddingBottom is ' + thisElementStyles.paddingBottom + ' Index is ' + idx);
              console.log('This matchElement height is ' + thisElHeight + ' minus padding ' + idx);
            }

            if (thisElHeight > targetHeight) {
              targetHeight = thisElHeight;
            } else {
              return;
            }
          }); //matchElements foreach

          if (targetHeight > 0) {
            matchElements.forEach(function (el) {
              el.style.height = targetHeight + 'px';
            });
          } else {
            return;
          }
        } else {
          return;
        }
      }); //matchHeightWraps forewach
    } //end if .bc-match-height-wrap


    window.addEventListener('resize', function () {
      matchHeights();
    });
  } //matchHeights()

  /* Intersection Observer for filterable images */


  function createFilterableElsObserver($filterableElement) {
    var isFilterableOpts = {
      root: null,
      rootMargin: '0px',
      threshold: [0, 0.5, 1]
    }; //let lastIR = 0;

    function isFilterableIntersection(entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var entryTarget = entry.target; //let IR = entry.intersectionRatio;

          if (entryTarget.classList.contains('bc-is-filterable--full-screen')) {
            if (entry.intersectionRatio <= 0.6) {
              entryTarget.style.filter = "grayscale(100%)";
            } else {
              entryTarget.style.filter = '';
            }
          } else {
            if (entry.intersectionRatio >= 0.75) {
              entryTarget.style.filter = "grayscale(0)";
            } else {
              entryTarget.style.filter = 'grayscale(100%)';
            }
          }
        }
      });
    }

    var isFilterableObserver = new IntersectionObserver(isFilterableIntersection, isFilterableOpts);
    isFilterableObserver.observe($filterableElement);
  } //createFilterableElsObserver()


  var $filterableElsArr = Array.from(document.querySelectorAll('.bc-is-filterable, .bc-is-filterable--full-screen'));
  $filterableElsArr.forEach(function ($el) {
    createFilterableElsObserver($el);
  });
  window.addEventListener('load', function () {
    if (debug) {
      console.log('[debug]: Window loaded');
    } //Main nav set up


    mainNavigationSetup();
    var $bodyWrap = document.querySelector('.bc-body-wrap');
    var $siteHeader = document.querySelector('.bc-site-header');
    $bodyWrap.addEventListener('click', function (evt) {
      if ($bodyWrap.classList.contains('bc-main-nav-open')) {
        var $eventTarget = evt.target;

        if ($eventTarget.closest('.bc-site-header')) {
          return;
        } else {
          $siteHeader.classList.remove('bc-is-active');
          $bodyWrap.classList.remove('bc-main-nav-open');
        }
      } else {
        return;
      }
    });
    matchHeights();
    var theBody = document.querySelector('html');

    if (theBody) {
      theBody.classList.remove('bc-page-loading');
      theBody.classList.add('bc-page-loaded');
    }
    /* Temporary - to make cookies block always show */
    //set main cookie
    // bcSetCookie('bc-cookies-preferences', '', {
    // 	expires: new Date(Date.now() - (1 * 24 * 60 * 60 * 1000)).toUTCString()
    // });
    // if (bcGetCookie('bc-cookies-preferences') !== undefined || bcGetCookie('bc-cookies-preferences') !== '' ) {
    // 	bcSetCookie('bc-cookies-preferences', '', {
    // 		expires: new Date(Date.now() - (1 * 24 * 60 * 60 * 1000)).toUTCString()
    // 	});
    // }
    //show the consent block


    window.setTimeout(function () {
      checkCookies('bc-cookies-preferences', function () {
        theBody.classList.add('bc-cookies-not-set', 'bc-modal-visible');
      });
    }, 0); //Consent button click handler

    var cookiesConsent = document.querySelector('#bc-cookies-consent');

    if (cookiesConsent) {
      console.log("Cookies consent script");
      cookiesConsent.addEventListener('click', function (evt) {
        console.log('Click');
        evt.preventDefault();

        if (bcGetCookie('bc-cookies-preferences') !== 'submitted') {
          console.log('Cookies preferences are not set. Set cookies all cookies');
          var expiryDate = new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toUTCString();
          bcSetCookie('bc-ga-analytics', 'granted', {
            expires: expiryDate
          });
          bcSetCookie('bc-google-ad-storage', 'granted', {
            expires: expiryDate
          });
          bcSetCookie('bc-cookies-preferences', 'submitted', {
            expires: expiryDate
          });
        }

        theBody.classList.remove('bc-cookies-not-set');
        theBody.classList.remove('bc-modal-visible');
        document.querySelector('#bc-cookies-consent-block').classList.add('bc-cookies-set');
      });
    }
  });
  var cookiesDone = false;

  function checkCookies(cookieName, cbFn) {
    if (bcGetCookie(cookieName) !== undefined && bcGetCookie(cookieName) !== '') {
      return true;
    }

    cbFn();
  }
  /* Cookie funcitons */


  function bcSetCookie(cname, cvalue, opts) {
    var newCookie = cname + '=' + encodeURI(cvalue);

    if (_typeof(opts) === 'object') {
      if (debug) {
        console.log('opts is an object');
      }

      var optNames = Object.getOwnPropertyNames(opts);
      optNames.forEach(function (key) {
        newCookie += '; ' + key + '=' + opts[key];
      });
    }

    if (debug) {
      console.log('New cookie is: ' + newCookie);
    }

    document.cookie = newCookie;

    if (debug) {
      console.log('setCookie() document.cookie = ' + document.cookie);
    }
  }

  function bcGetCookie(cname) {
    var allCookies = document.cookie.split('; ');
    var thisCookie = allCookies.find(function (row) {
      return row.startsWith(cname);
    });
    return thisCookie ? thisCookie.split('=')[1] : undefined;
  }
  /* Snack bar */


  if (document.querySelector('.bc-snack-bar__close')) {
    var $snackBarClose = document.querySelector('.bc-snack-bar__close');
    $snackBarClose.addEventListener('click', function (evt) {
      evt.preventDefault();
      var $docBody = document.querySelector('body');
      $docBody.classList.remove('bc-snack-bar-visible');
    });
  }

  function showSnackBar($trigger) {
    var $docBody = document.querySelector('body');
    $docBody.classList.add('bc-snack-bar-visible');
  }
  /* Return protected functions */


  return {
    getCookie: bcGetCookie,
    setCookie: bcSetCookie,
    showSnackBar: showSnackBar
  };
}(window);
/* App.js */
