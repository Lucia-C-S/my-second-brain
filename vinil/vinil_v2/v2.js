const images = [
    "../../media/images/ice1.jpg",
    "../../media/images/ice2.jpg",
    "../../media/images/ice3.jpg",
    "../../media/images/ice4.jpg",
    "../../media/images/ice5.jpg",
    "../../media/images/ice6.jpg"
];

const CONFIG = {

    cardWidth: 220,
    cardHeight: 220,

    spacing: 260,

    diagonalX: 260,
    diagonalY: -150,

    depth: 260,

    hoverLift: 80,

    scrollSpeed: 0.0018,

    friction: 0.92

};

const state = {

    records: [],

    offset: 0,

    velocity: 0,

    mouseX: 0,
    mouseY: 0

};

const conveyor = document.getElementById("conveyor");

//////////////////////////////////////////////////////////////

createRecords();

animate();

//////////////////////////////////////////////////////////////

function createRecords(){

    images.forEach(src=>{

        const record = document.createElement("div");
        record.className = "record";

        const img = document.createElement("img");
        img.src = src;
        img.draggable = false;

        record.appendChild(img);

        conveyor.appendChild(record);

        state.records.push({

            element:record,

            hover:0,

            targetHover:0

        });

    });

}

//////////////////////////////////////////////////////////////

window.addEventListener("pointermove",e=>{

    state.mouseX = e.clientX;
    state.mouseY = e.clientY;

});

window.addEventListener("wheel",e=>{

    state.velocity += e.deltaY * CONFIG.scrollSpeed;

});

//////////////////////////////////////////////////////////////

function updateHover() {

    let hovered = null;

    for (const record of state.records) {

        const rect = record.element.getBoundingClientRect();

        if (
            state.mouseX >= rect.left &&
            state.mouseX <= rect.right &&
            state.mouseY >= rect.top &&
            state.mouseY <= rect.bottom
        ) {
            hovered = record;
            break;
        }
    }

    for (const record of state.records) {

        record.targetHover = (record === hovered)
            ? CONFIG.hoverLift
            : 0;

        record.hover +=
            (record.targetHover - record.hover) * 0.15;
    }
}

//////////////////////////////////////////////////////////////

function render() {

    const total = state.records.length;

    for (let i = 0; i < total; i++) {

        let p = (i - state.offset) % total;

        if (p < 0) p += total;

        p /= total;

        // diagonal position
        const x = (0.5 - p) * 700;
const y = (0.5 - p) * 260;

        // front/back illusion
        const depth = Math.sin(p * Math.PI);

        const z = depth * 260;

        const scale = 0.65 + depth * 0.35;

        const opacity = 0.3 + depth * 0.7;

        const record = state.records[i];

        const rotation = -18 + p * 36;

record.element.style.transform = `
    translate3d(
        ${x}px,
        ${y - record.hover}px,
        ${z}px
    )
    rotateY(${rotation}deg)
    scale(${scale})
`;

        record.element.style.opacity = 1;
        record.element.style.zIndex = Math.floor(depth * 1000);

    }

}

//////////////////////////////////////////////////////////////

function animate(){

    state.offset+=state.velocity;

    state.velocity*=CONFIG.friction;

    updateHover();

    render();

    requestAnimationFrame(animate);

}