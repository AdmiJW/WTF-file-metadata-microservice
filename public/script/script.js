
const navbar = document.querySelector('nav');
const jumbotron = document.querySelector('.jumbotron');

//=======================================
// Intersection Observer for Navbar
//=======================================
const intersectionObserverOptions = {
    threshold: 0.25
  }
  
let observer = new IntersectionObserver((e)=> {
    if (e[0].isIntersecting)
        navbar.classList.add('bg-invis');
    else
        navbar.classList.remove('bg-invis');
}, intersectionObserverOptions);

observer.observe(jumbotron);