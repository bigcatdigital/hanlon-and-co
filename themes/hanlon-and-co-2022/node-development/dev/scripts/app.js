/* * BC custom scripts - Hanlon & Co solicitors 2022
 * BigCat Design, Dublin
 * @preserve 
*/
const bcFunctions = (function bcAppJS() {
	let debug = false;
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
		let options = {
			headers: {
				'Content-Type': 'application/json'
			}
		};
		if (opts) {
			options = Object.assign(options, opts);
		}
		return bcAJAX(url, options).then((data) => {
			return Promise.resolve(data);
		}).catch((err) => {
			return Promise.reject(err);
		});
	}
	
	/*** Utils */
	/*
		Use getBoundingClientRect to get the top and left offsets for an element - used with lerp scroll for the target argument value
		$el: the element whose offsets are required
	*/
	function bcGetOffset($el = document.querySelector('body')) {
		if (debug) {
			console.log(`bcGetOffset()`);	
			console.log(`-------------`);	
			console.log(`$el: ${$el}`);	
		}
		const elRect = $el.getBoundingClientRect();
		const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
		const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
		
		return { top: elRect.top + scrollTop, left: elRect.left + scrollLeft };
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
	function bcLerpScroll($el, pos, target, speed = 0.1) {
		pos = Math.floor(pos);
		target = Math.floor(target);
		if (debug) {
			console.log(`Lerp ${i}`); 
			console.log(`---------`);
			console.log(`$el: ${$el.classList} pos: ${Math.floor(pos)} target: ${Math.floor(target)} speed: ${speed}`);
		}
		let scrollOpts = {};
		//Scroll down
		if (Math.floor(pos) < Math.floor(target)) {
			if (debug) {
				console.log(`Scroll down`);
				console.log(`Target - Pos * speed: ${Math.ceil((target - pos) * speed)}`);
			}
			pos += Math.ceil((target - pos) * speed); 
			if (debug) { 
				console.log(`New postion: ${pos} ${target}`);
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
			requestAnimationFrame(() => {
				bcLerpScroll($el, pos, target); 
			});
		//Scroll up
		} else if (Math.floor(pos) > Math.floor(target)) {
			if (debug) {
				console.log(`Scroll up`);
				console.log(`${pos} ${target}`);
				console.log(`${(pos - target)}`);
			}
			pos -= (pos - target) * speed; 
			if (debug) {
				console.log(`${pos} ${target}`);	
			}
			scrollOpts = {
				top: pos,
				left: 0,
				behavior: 'auto'
			};
			$el.scroll(scrollOpts);
			if (debug) {
				console.log(`${$el.scrollY}`);
				i++;	
			}
			requestAnimationFrame(() => {
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
				console.log(`Target: ${target} Final position: ${$el.scrollY}`);
			}
			return;
		} 
	}//Lerp scroll
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
	function bcAdjustHeight($el, target, speed = 0.075, cb = null) {
		bcLerpHeight($el, target, speed) ;	
		function bcLerpHeight($el, target, speed = 0.075) {
			if (debug) {
				console.log(`$el height: ${$el.style.height}`); 
			}
			//the currrent el height
			let h = ($el.style.height !== '' && $el.style.height !== undefined ) ? parseFloat($el.style.height) : $el.clientHeight;
			if (debug) {
				if (i > 500) {
					return;
				}
				console.log(`Lerp ${i}`); 
				console.log(`---------`);
				console.log(`Height: ${h} Target: ${target}`);
				console.log(`Difference: ${(h - target)}`);
			}
			if (Math.floor(target) > Math.floor(h)) {
				if (debug) {
					console.log(`Target > Height`);
					console.log(`Raw height to add: ${(target - h) * speed}`); 
				}
				h += Math.ceil((target - h) * speed); 
				if (debug) { 
					console.log(`New height: ${h} Target: ${target}`);
				}
				requestAnimationFrame(() => {
					$el.style.height = h + 'px';	
				});
				//$el.style.height = h + 'px';
				if (debug) {
					console.log(`Element style.height: ${$el.style.height}`);
					i++;
				}
				
				bcLerpHeight($el, target, speed); 
				
			} else if (Math.floor(h) > Math.floor(target)) {
				if (debug) {
					console.log(`Height > Target`);
					console.log(`Raw height to subtract: ${(h - target) * speed}`); 
				}
				h -= Math.ceil((h - target) * speed); 
				if (debug) {
					console.log(`New height: ${h} Target: ${target}`);	
				}
				requestAnimationFrame(() => {
					$el.style.height = h + 'px';
				});
				if (debug) {
					console.log(`${$el.style.height}`);
					i++;	
				}
				bcLerpHeight($el, target, speed);
				
			} else {
				return;
			} 
		}//Lerp scroll
		if (typeof cb === 'function') {
			cb();	
		}
		return;
	}//bcAdjustHeight
	
	/* 
		Scroll links
		For on page vertical scrolling
	*/
	if (debug) {
		console.log('Scroll links');
		console.log('------------');
	}
	const scrollLinks = Array.from(document.querySelectorAll('.bc-scroll-link'));
	if (debug) {
		console.log(`scrollLinks length: ${scrollLinks.length}`);
		console.log(`scrollLinks length: ${scrollLinks[0]}`);
	}
	
	scrollLinks.forEach(($link) => {
		
		if (debug) {
			console.log($link); 
		}
		if (document.getElementById($link.getAttribute('href').substr(1))) {
			$link.addEventListener('click', (evt) => {
				evt.preventDefault();
				const $scrollTargetEl = document.getElementById($link.getAttribute('href').substr(1));
				const scrollTarget = bcGetOffset($scrollTargetEl).top;
				bcLerpScroll(document.documentElement, document.documentElement.scrollTop, scrollTarget);		
			});
		}
		
	});
	
	/* Show/hide (accordion) components
	 * $el: element to show or hide
	 * target: element target height as an integer
	 * cb: a callback
	*/
	debug = true;
	function bcShowHide($el, targetHeight, cb) {
		if (debug) {
			console.log('bcShowHide function, target height:');	
			console.log(targetHeight);	
		}
		targetHeight = Number.parseInt(targetHeight);
		requestAnimationFrame(() => {
			$el.style.maxHeight = targetHeight + 'px';
		});	
		
		if (typeof cb === 'function') {
			$el.addEventListener('transitionend', () => {
				requestAnimationFrame(() => {
					cb();
				});	
				$el.removeEventListener('transitionend', arguments.callee);
			});	
		}
	}//bcShowHide()
	const showHideComponents = Array.from(document.querySelectorAll('.bc-show-hide'));
	if (debug){
		console.log(``);
		console.log(`Show/hide accordion components:`);
		console.log(`-------------------------------`);
		console.log(`Length: ${showHideComponents.length}`);
		console.log(``);
	}
	showHideComponents.forEach(($showHideComponent, idx) => {
		if (debug) {
			console.log(`Accordion component #${idx + 1} classlist:`);
			console.log($showHideComponent.classList);	
		}
		//Show hide toggles
		const showHideToggles = Array.from($showHideComponent.querySelectorAll('.bc-show-hide__toggle'));
		showHideToggles.forEach(($showHideToggle, idx) => {
			const $showHideBody = $showHideToggle.nextElementSibling;
			const showHideBodyHeight = ($showHideBody.parentElement.classList.contains('bc-site-header__main-navigation__item')) ? $showHideBody.scrollHeight + ((14*1.5)*0.5) : $showHideBody.scrollHeight ;
			if (debug) {
				console.log(`Accordion toggle #${idx + 1} classlist: `);
				console.log($showHideToggle.classList);
				console.log(`Accordion body #${idx +1} scrollHeight: `);
				console.log($showHideBody.scrollHeight); 
			}
			//Show/hide toggle listener
			$showHideToggle.addEventListener('click', (evt) => {
				evt.preventDefault();
				let thisDebug = false;
				if ($showHideToggle.classList.contains('bc-is-active')) {
					if (thisDebug) {
						console.log('This accordion body is active.');
					}
					bcShowHide($showHideBody, 0);
					$showHideToggle.classList.remove('bc-is-active'); 
				} else {
					if (thisDebug) {
						console.log('This accordion body is inactive.');
					}
					bcShowHide($showHideBody, showHideBodyHeight);	
					$showHideToggle.classList.add('bc-is-active');	
					
				}
			});
			//Accordion closer in the accordion body
			if ($showHideBody.querySelector('.bc-show-hide__hide')) {
				const $showHideBodyClose = $showHideBody.querySelector('.bc-show-hide__hide');
				$showHideBodyClose.addEventListener('click', () => {
					if ($showHideToggle.classList.contains('bc-is-active')) { 
						bcShowHide($showHideBody, 0);
						$showHideToggle.classList.remove('bc-is-active');
					}
				});
			}
		});
	});
	debug = false;
	/* Main site navigation */
	function mainNavigationSetup() {
		const $siteHeader = document.querySelector('.bc-site-header');
		const $siteHeaderMenuLink = document.querySelector('.bc-site-header__menu-link');
		const $siteHeaderMainNav = document.querySelector('.bc-site-header__main-navigation');
		if (($siteHeader && $siteHeader !== undefined) && ($siteHeaderMenuLink && $siteHeaderMenuLink !== undefined) && ($siteHeaderMainNav && $siteHeaderMainNav !== undefined)) {
			if (debug) {
				console.log(`Main navigation set up`);
				console.log(`----------------------`); 
				console.log(`window.outerWidth is ${window.outerWidth}`);
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
			requestAnimationFrame(() => {
				$siteHeader.classList.toggle('bc-is-active');
				let $bodyWrap = document.querySelector('.bc-body-wrap');
				$bodyWrap.classList.toggle('bc-main-nav-open'); 
			});
			
			if (debug) {
				console.log(`Header class list: ${$siteHeader.classList}`);
			}
			
		}
		$siteHeaderMenuLink.removeEventListener('click', menuIconClickHandler);
		$siteHeaderMenuLink.addEventListener('click', menuIconClickHandler);
		
		debug = false;
	}//mainNavigationSetup()
	
	/* Flickity Sliders */
	const $bcFlkSliders = document.querySelectorAll('.bc-flickity');
	function setUpSliders (sliders) {
		Array.from(sliders).forEach(($bcFlkSlider, idx) => {
			if (debug) {
				console.log(`Sliders foreach`);
				console.log(`Sliders idx: ${idx}`);
			}
			const sliderType = ($bcFlkSlider.classList.contains('bc-flickity--text-slider')) ? 'text-slider' : ($bcFlkSlider.classList.contains('bc-flickity--card-slider')) ? 'card-slider' : 'video-slider'; 
			const slidesLen = $bcFlkSlider.querySelectorAll('.bc-flickity__slide').length;
			if (debug) {
				console.log(`Slider type: ${sliderType}`);
			}
			
			const flkSlider = new Flickity($bcFlkSlider, {
				adaptiveHeight: (sliderType === 'text-slider' ) ? true : false,
				cellAlign: (sliderType === 'card-slider' ) ? 'left' : 'center',
				groupCells: true,
				cellSelector: '.bc-flickity__slide', 
				prevNextButtons: (sliderType === 'text-slider' ) ? false : true,
				pageDots: (slidesLen > 1) ? true : false
			});
			
			if (sliderType === 'text-slider') {
				const nextButton = document.querySelector('.flickity-prev-next-button.next');
				const prevButton = document.querySelector('.flickity-prev-next-button.previous');
				if ((prevButton !== null && prevButton !== undefined) && (nextButton == null && nextButton !== undefined)) {
					nextButton.addEventListener('click', (e) => {
						e.preventDefault();
						console.log('click');
						flkSlider.next();
					});
					prevButton.addEventListener('click', (e) => {
						e.preventDefault();
						flkSlider.previous();
					});
					prevButton.setAttribute('disabled', '');
					flkSlider.on('change', (idx) => {
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
			flkSlider.on('change', () => {
				const videoSlides = $bcFlkSlider.querySelectorAll('.bc-flickity__slide--video');
				if (videoSlides && videoSlides.length > 0) {
					Array.from(videoSlides).forEach((slide) => {
						slide.querySelector('iframe').stopVideo();
					});
				}
			});
		});//end foreach bcFlkSliders
	}//end setUpSliders()
	if ($bcFlkSliders &&  $bcFlkSliders.length > 0) {
		if (debug) {
			console.log('Flickity slider set up.');
			console.log('-----------------------');
			console.log(`$bcFlkSliders length is ${$bcFlkSliders.length}`);
		}
		setUpSliders($bcFlkSliders);
		
		window.addEventListener('resize', () => {
			setUpSliders($bcFlkSliders);
		});
		
	}//end if $bcFlkSliders
	/* Custom -- services - corporate/individual - homepage */
	if (debug) {
		console.log('');
		console.log('Services component');
		console.log('------------------');
	}
	const $bcTwinComponents = Array.from(document.querySelectorAll('.bc-twin-component'));
	if ($bcTwinComponents.length > 0) {
		//* For each service block on the page */
		$bcTwinComponents.forEach(($bcTwinComponent) => {
			/* Set up the images - array and current active image ID */
			const componentImages = Array.from($bcTwinComponent.querySelectorAll('.bc-twin-component__image'));
			
			if (componentImages.legth === 0) {
				return;
			}
			/* The service triggers - on hover */
			
			const componentTriggers = Array.from($bcTwinComponent.querySelectorAll('.bc-twin-component__trigger'));
			
			if (componentTriggers.length > 0) {
				componentTriggers.forEach(($componentTrigger) => {
					$componentTrigger.addEventListener('mouseover', (evt) => { 
						evt.stopPropagation();
						const $thisTrigger = evt.currentTarget;
						const serviceID = $thisTrigger.dataset.service;
						if ($thisTrigger.classList.contains('is-active')) {
							return;
						}
						const $activeServiceImage = componentImages.find(($serviceImage) => {
							return $serviceImage.classList.contains('is-active');	
						});	
						if ($activeServiceImage.getAttribute('id') === serviceID) {
							return;
						}
						$activeServiceImage.classList.remove('is-active');	
						const $newServiceImage = $bcTwinComponent.querySelector('#' + serviceID);
						if ($newServiceImage) {
							$newServiceImage.classList.add('is-active');
							$thisTrigger.classList.add('is-active');
						} else {
							return;
						}
					});// This $componentTrigger mouseover
					componentTriggers.forEach(componentTrigger => {
						componentTrigger.addEventListener('mouseleave', (evt) => {
							evt.preventDefault();
							componentTrigger.classList.remove('is-active');
						});
					});
				});// componentTriggers for each
			}// end if componentTriggers
		});// end $bcTwinComponents for each
	}//end if $bcTwinComponents is > 0

	/* Match height elements */
	function matchHeights() {
		if (document.querySelectorAll('.bc-match-height-wrap')) { 
			let matchHeightWraps = Array.from(document.querySelectorAll('.bc-match-height-wrap'));

			if (debug) {
				console.log('Found '+ matchHeightWraps.length + ' match height wrap(s)');
			}
			
			matchHeightWraps.forEach((el, idx) => {
				let targetHeight = 0;
				let $thisWrapper = el;
				let matchElements = [];
				let minHeight = (el.dataset.matchMinHeight) ? el.dataset.matchMinHeight : 0 ;
				if (window.outerWidth < minHeight) {
					return; 
				}
				if ($thisWrapper.querySelectorAll('.bc-match-height')) {
					matchElements = Array.from($thisWrapper.querySelectorAll('.bc-match-height'));
					matchElements.forEach((matchElement, idx, thisArr) => {
						if (debug) {
							console.log('Target height: '+ targetHeight);
							console.log(matchElement.style.height);
						}
						matchElement.style.height = null;
						if (debug) {
							console.log(matchElement.clientHeight);
							console.log(matchElement);
						}
						let thisElementStyles = getComputedStyle(matchElement);
						let thisElHeight = matchElement.scrollHeight;
						if (debug) {
							console.log('This matchElement height is ' + thisElHeight + ' Index is '+idx); 
							console.log('This matchElement paddingTop is ' + thisElementStyles.paddingTop + ' Index is '+idx); 
							console.log('This matchElement paddingBottom is ' + thisElementStyles.paddingBottom + ' Index is '+idx); 
							console.log('This matchElement height is ' + thisElHeight + ' minus padding '+idx); 
						}
						if (thisElHeight > targetHeight) {
							targetHeight = thisElHeight;
						} else {
							return;
						}
					});//matchElements foreach
					if (targetHeight > 0) {
						matchElements.forEach((el) => {
							el.style.height = targetHeight + 'px';
						});
					} else {
						return;
					}
				} else {
					return;
				}
	
			});//matchHeightWraps forewach
			
		}//end if .bc-match-height-wrap
		window.addEventListener('resize', () => {
			matchHeights();
		});
	}//matchHeights()
	
	
	/* Intersection Observer for filterable images */
	function createFilterableElsObserver($filterableElement) {

		let isFilterableOpts = {
			root: null,
			rootMargin: '0px',
			threshold: [0, 0.5, 1]
		};
		//let lastIR = 0;
		function isFilterableIntersection(entries) {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					let entryTarget = entry.target;
					
					//let IR = entry.intersectionRatio;
					if (entryTarget.classList.contains('bc-is-filterable--full-screen')) {
						if (entry.intersectionRatio <= 0.6) {
							entryTarget.style.filter = `grayscale(100%)`;
						} else {
							entryTarget.style.filter = '';
						}	
					} else {
						if (entry.intersectionRatio >= 0.75) {
							entryTarget.style.filter = `grayscale(0)`;
						} else {
							entryTarget.style.filter = 'grayscale(100%)';
						}
					}
				
				}
			});
		}
		let isFilterableObserver = new IntersectionObserver(isFilterableIntersection, isFilterableOpts);
		isFilterableObserver.observe($filterableElement);
	}//createFilterableElsObserver()
	const $filterableElsArr = Array.from(document.querySelectorAll('.bc-is-filterable, .bc-is-filterable--full-screen'));
	$filterableElsArr.forEach(($el) => {
		createFilterableElsObserver($el);
	});
	window.addEventListener('load', () => {
		if (debug) {
			console.log('[debug]: Window loaded');
		}
		//Main nav set up
		mainNavigationSetup();
		let $bodyWrap = document.querySelector('.bc-body-wrap');
		let $siteHeader = document.querySelector('.bc-site-header');

		$bodyWrap.addEventListener('click', (evt) => {
			if ($bodyWrap.classList.contains('bc-main-nav-open')) {
				let $eventTarget = evt.target;
				if ($eventTarget.closest('.bc-site-header')){
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
		let theBody = document.querySelector('html');
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
		window.setTimeout(() => {
			checkCookies('bc-cookies-preferences', () => {
				theBody.classList.add('bc-cookies-not-set', 'bc-modal-visible');
			}); 
		}, 0);
		//Consent button click handler
		let cookiesConsent = document.querySelector('#bc-cookies-consent');
		if (cookiesConsent) {
			console.log(`Cookies consent script`);
			cookiesConsent.addEventListener('click', (evt) => {
				console.log('Click');
				evt.preventDefault();

				if (bcGetCookie('bc-cookies-preferences') !== 'submitted') {
					console.log('Cookies preferences are not set. Set cookies all cookies');
					let expiryDate = new Date(Date.now() + (28 * 24 * 60 * 60 * 1000)).toUTCString();

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
	let cookiesDone = false;
	function checkCookies(cookieName, cbFn) {
		if (bcGetCookie(cookieName) !== undefined && bcGetCookie(cookieName) !== '') {
			return true;
		}
		cbFn();
	}

	/* Cookie funcitons */
	function bcSetCookie(cname, cvalue, opts) {
		let newCookie = cname + '=' + encodeURI(cvalue);
		if (typeof opts === 'object') {
			if (debug) {
				console.log('opts is an object');
			}
			let optNames = Object.getOwnPropertyNames(opts);
			optNames.forEach((key) => {
				newCookie += '; ' + key + '=' + opts[key];
			});
		}
		if (debug) {
			console.log('New cookie is: '+newCookie);
		}
		document.cookie	= newCookie; 
		if (debug) {
			console.log('setCookie() document.cookie = '+ document.cookie);
		} 
	}
	function bcGetCookie(cname) {
		const allCookies = document.cookie.split('; ');
		const thisCookie = allCookies.find((row) => {
			return row.startsWith(cname);
		}); 
		return (thisCookie) ? thisCookie.split('=')[1] : undefined ;
	}

	/* Snack bar */
	if (document.querySelector('.bc-snack-bar__close')) {
		let $snackBarClose = document.querySelector('.bc-snack-bar__close');
		$snackBarClose.addEventListener('click', (evt) => {
			evt.preventDefault();
			let $docBody = document.querySelector('body');
			$docBody.classList.remove('bc-snack-bar-visible');
		});
	}
	
	
	function showSnackBar($trigger) {
		let $docBody = document.querySelector('body');
		$docBody.classList.add('bc-snack-bar-visible');
	}

	/* Return protected functions */
	return {
		getCookie: bcGetCookie,
		setCookie: bcSetCookie,
		showSnackBar: showSnackBar
	};
})(window);
/* App.js */

