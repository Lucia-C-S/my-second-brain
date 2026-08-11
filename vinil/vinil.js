const images = [
    "media/images/ice1.jpg",
    "media/images/ice2.jpg",
    "media/images/ice3.jpg",
    "media/images/ice4.jpg",
    "media/images/ice5.jpg",
    "media/images/ice6.jpg"
];

const state = {

    cards: [],

    conveyorOffset: 0,

    scrollVelocity: 0,

    autoSpeed: 0.12,

    spacing: 1.0

};

const CONFIG = {

    // Camera
    perspective: 1900,

    // Cards
    cardWidth: 220,
    cardHeight: 220,

    spacing:1.15,

     // Conveyor
    autoSpeed: 0.08,

    // Path
    pathWidth: 620,
    pathHeight: 420,
    depth: 340,

    depthRange:240,
    compression: 2.3,

   hoverLift: 65,
hoverSpring: 45,
hoverDamping: 12,
    

};

const conveyor = document.getElementById("conveyor");


function init() {

    images.forEach(src => {
        createCard(src);
    });
}
init();

function easeInOut(t){

    return t * t * (3 - 2 * t);

}

function createCard(src) {

    const wrapper = document.createElement("div");
    wrapper.className = "card-wrapper";

    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.src = src;
    img.draggable = false;

    card.appendChild(img);
    wrapper.appendChild(card);
    conveyor.appendChild(wrapper);

    state.cards.push(wrapper);

    wrapper.hoverLift = 0;
    wrapper.targetHoverLift = 0;
    wrapper.hoverVelocity = 0;

    wrapper.addEventListener("mouseenter", () => {
        wrapper.targetHoverLift = CONFIG.hoverLift;
    });

    wrapper.addEventListener("mouseleave", () => {
        wrapper.targetHoverLift = 0;
    });
}

function layoutCard(position){

    const count = state.cards.length;

    const t = position / count;
const p = easeInOut(t);

const angle = (p * 2.2) - 0.6;

const x = angle * CONFIG.pathWidth;
const y = angle * CONFIG.pathHeight;
const z = angle * CONFIG.depth;

    const depth =
    z / CONFIG.depth;

const scale =
    0.88 + depth * 0.22;
    
    const opacity = 0.65 + (1 - p) * 0.35;
    const zIndex = Math.round((1 - p) * 10000);
    
return {

    x,
    y,
    z,

    rotation:0,

    scale,

    opacity,

    zIndex,
};
}

function mod(x,n){

    return ((x % n) + n) % n;

}

function cardPosition(index) {

    const count = state.cards.length;

    return mod(
        index - state.conveyorOffset,
        count
    );
}

function applyLayout(card, layout) {

    const lift = card.hoverLift;

    const x = layout.x + lift * 0.601;
    const y = layout.y - lift * 0.601;
    const z = layout.z + lift * 0.527;

    card.style.transform = `
        translate3d(
            ${x}px,
            ${y}px,
            ${z}px
        )
        rotateY(90deg)
        rotateZ(${layout.rotation}deg)
        scale(${layout.scale})
    `;

    card.style.opacity = layout.opacity;
    card.style.zIndex = layout.zIndex;
}

function render(){

    const count = state.cards.length;

    for(let i = 0; i < count; i++){

        const position = cardPosition(i);

        const layout = layoutCard(position);

        applyLayout(state.cards[i], layout);

    }

}

window.addEventListener("wheel", e=>{

    state.scrollVelocity += e.deltaY * 0.0015;

});

function animate(){

state.scrollVelocity *= 0.95;

state.conveyorOffset += state.scrollVelocity;
for (const card of state.cards) {

    card.hoverLift +=
        (card.targetHoverLift - card.hoverLift) * 0.18;

}

    render();

    requestAnimationFrame(animate);

}

animate();
