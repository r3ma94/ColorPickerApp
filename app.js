// Global selectors and variables
const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate");
const sliders = document.querySelectorAll("input[type='range']");
const currentHexes = document.querySelectorAll(".color h2");
let initicalColors;

// Listeners
sliders.forEach(slider =>{
    slider.addEventListener("input", hslControls);
});

colorDivs.forEach((div, index) => {
    div.addEventListener("change", () =>{
        updateTextUI(index);
    });
});








// Functions 


// Color Generator
function generateHex(){
    const hexColor = chroma.random();
    return hexColor;
}

function randomColors(){
    //
    initicalColors = [];
    colorDivs.forEach((div, index) => {
        const hexText = div.children[0];
        const randomColor = generateHex();
        // add hex to initial colors array
        initicalColors.push(chroma(randomColor).hex());

        // Add color to background
        div.style.backgroundColor = randomColor;
        hexText.innerText = randomColor;
        // check for contrast 
        checkTextContrast(randomColor, hexText);
        // Initial colorize sliders
        const color = chroma(randomColor);
        const sliders = div.querySelectorAll(".sliders input");
        const hue = sliders[0];
        const brightness = sliders[1];
        const saturation = sliders[2];

        colorizeSliders(color, hue, brightness, saturation)
        
    });
    // resetting inputs
    resetInputs();
};

function checkTextContrast(color, text){
    const luminance = chroma(color).luminance();
    if(luminance > 0.5){
        text.style.color = "black";
    }
    else{
        text.style.color = "white";
    } 
}

function colorizeSliders(color, hue, brightness, saturation){
    // scale saturation
    const noSat = color.set("hsl.s", 0);
    const fullSat = color.set("hsl.s", 1);
    const scaleSat = chroma.scale([noSat, color, fullSat]);
    // scale brightness
    const midBright = color.set("hsl.l", 0.5);
    const scaleBright = chroma.scale(["black", midBright, "white"]);
    

    // Update input colors
    saturation.style.backgroundImage = `linear-gradient(to right, ${scaleSat(0)}, ${scaleSat(1)})`;

    brightness.style.backgroundImage = `linear-gradient(to right, ${scaleBright(0)},${scaleBright(0.5)}, ${scaleBright(1)})`;

    hue.style.backgroundImage = `linear-gradient(to right, #FF0000, #FFFF00, #00FF00, #00FFFF, #0000FF, #FF00FF, #FF0000)`;

    // resetting sliders
    saturation.value = color.hsl()[1];
    brightness.value = color.hsl()[2];
    hue.value = color.hsl()[0];
};

function hslControls(e){
    const index = 
        e.target.getAttribute("data-bright") || 
        e.target.getAttribute("data-sat") ||
        e.target.getAttribute("data-hue");
    
    let sliders = e.target.parentElement.querySelectorAll("input[type='range']");
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];

    const bgColor = initicalColors[index];
    //console.log(bgColor);

    let color = chroma(bgColor)
    .set("hsl.s", saturation.value)
    .set("hsl.l", brightness.value)
    .set("hsl.h", hue.value);

    
    colorDivs[index].style.backgroundColor = color;
    // updating slider values
    colorizeSliders(color, hue, brightness, saturation);
}


function updateTextUI(index){
    const activeDiv = colorDivs[index];
    const color = chroma(activeDiv.style.backgroundColor);
    //console.log(color);
    const textHex = activeDiv.querySelector("h2");
    const icons = activeDiv.querySelectorAll(".controls button");
    textHex.innerText = color.hex();
    //check contrast
    checkTextContrast(color, textHex);
    for(icon of icons){
        checkTextContrast(color, icon);
    }
}





randomColors();