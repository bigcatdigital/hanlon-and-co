
/* App.js */
function sayHello(name) { 
	console.log(`Hello ${name}`);
}
sayHello('You');
/* 
	GSAP Get Started
	https://greensock.com/get-started/ 
*/ 
gsap.to('.gsap-test__heading', {duration: 2, x: 200, color: 'rgba(69, 80, 140)', ease: 'back'}); 
gsap.to('.gsap-test__heading .past', {duration: 1.5, maxWidth: '0px', color: 'rgba(209, 103, 155)'}); 
