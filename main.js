//fade

gsap.registerPlugin(ScrollTrigger);

gsap.to("canvas", {
    opacity: 0,
    scrollTrigger:{
        trigger:".content",
        start:"top bottom",
        end:"top top",
        scrub:true
    }
}); //fade

let scrollProgress = 0;

window.addEventListener("scroll", () => {
    scrollProgress = Math.min(window.scrollY / window.innerHeight, 1);
});

gsap.to("#liquidCanvas",{
    opacity:0,
    ease:"none",
    scrollTrigger:{
        trigger:".content",
        start:"top bottom",
        end:"top center",
        scrub:true
    }
});