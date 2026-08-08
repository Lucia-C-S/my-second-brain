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
    compression: 2.3


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

    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.src = src;
    img.draggable = false;

    card.appendChild(img);

    conveyor.appendChild(card);

    state.cards.push(card);
}

function layoutCard(position){

    const count = state.cards.length;

    const t = position / count;
const p = easeInOut(t);

const angle = (p - 0.5);

const x = angle * CONFIG.pathWidth;

const y = angle * CONFIG.pathHeight;

const z = Math.sin(angle * Math.PI) * CONFIG.depth;
    
    const scale = 1 + (z / CONFIG.depth)*0.08;
    
    const opacity = 0.65 + (1 - p) * 0.35;
    const zIndex = Math.round((1 - p) * 10000);
    return {

        x,
        y,
        z,

        rotation:0,

        scale,

        opacity,

        zIndex
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

function applyLayout(card, layout){

    card.style.transform = `
translate3d(
${layout.x}px,
${layout.y - (card.matches(':hover') ? 80 : 0)}px,
${layout.z}px
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

state.scrollVelocity *= 0.9;

state.conveyorOffset += state.scrollVelocity;
    render();

    requestAnimationFrame(animate);

}

animate();

