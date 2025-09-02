const dropAreas = document.getElementsByClassName('dropArea');
const imageAreas = document.getElementsByClassName('imageArea');
const dropArea = document.getElementById('drop-area');

const dropContainer = document.getElementsByClassName('container')[0];
const colTitles = document.getElementsByClassName('columnTitles')[0];

const colTitleTemplate = document.querySelector("[data-column-title]");
const rowTitleTemplate = document.querySelector("[data-row-title]");
const dropContTemplate = document.querySelector("[data-drop-container]");

const matrixVal = document.getElementById('sel_id');
//const canvas = document.getElementById('preview');
//const imgPreview = document.getElementById('img-preview');
//const ctx = canvas.getContext('2d');

// CONSTANTS
const COL_TITLE = 100;
const ROW_TITLE = 100;

let TILE_WIDTH = 1000;
let TILE_HEIGHT = 750;

let cols = 3; 
let rows = 2;

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    //dropArea.addEventListener(eventName, preventDefaults, false);
    for(var i = 0; i < dropAreas.length; i++) {
        dropAreas[i].addEventListener(eventName, preventDefaults, false);
    }

});

window.onload = function() {
    matrixVal.value = 1;
    drawMatrix();
    
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    //dropArea.addEventListener(eventName, () => dropArea.classList.add('hover'), false);
    for(var i = 0; i < dropAreas.length; i++) {
        dropAreas[i].addEventListener(eventName, preventDefaults, false);
    }
});

['dragleave', 'drop'].forEach(eventName => {
    //dropArea.addEventListener(eventName, () => dropArea.classList.remove('hover'), false);
    for(var i = 0; i < dropAreas.length; i++) {
        dropAreas[i].addEventListener(eventName, preventDefaults, false);
    }
});

//dropArea.addEventListener('drop', handleDrop, false);
for(var i = 0; i < dropAreas.length; i++) {
    dropAreas[i].addEventListener('drop', handleDrop, false);
}

function rebind() {
    ['dragenter', 'dragover'].forEach(eventName => {
        //dropArea.addEventListener(eventName, () => dropArea.classList.add('hover'), false);
        for(var i = 0; i < dropAreas.length; i++) {
            dropAreas[i].addEventListener(eventName, preventDefaults, false);
        }
    });

    ['dragleave', 'drop'].forEach(eventName => {
        //dropArea.addEventListener(eventName, () => dropArea.classList.remove('hover'), false);
        for(var i = 0; i < dropAreas.length; i++) {
            dropAreas[i].addEventListener(eventName, preventDefaults, false);
        }
    });

    //dropArea.addEventListener('drop', handleDrop, false);
    for(var i = 0; i < dropAreas.length; i++) {
        dropAreas[i].addEventListener('drop', handleDrop, false);
    }
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;

    if (files.length) {
        const file = files[0];
        const canvas = e.target.parentElement.getElementsByClassName('preview')[0];
        const imgPreview = e.target.parentElement.getElementsByClassName('imgPreview')[0];
        
        if (file.type === 'image/tiff' || file.name.match(/\.(tif|tiff)$/i)) {
            // Read TIFF file as ArrayBuffer
            const reader = new FileReader();
            reader.onload = function(event) {
                const buffer = event.target.result;
                const ifds = UTIF.decode(buffer);
                UTIF.decodeImages(buffer, ifds);
                const firstImage = ifds[0];
                const rgba = UTIF.toRGBA8(firstImage);
                //console.log(e);
                
                //console.log(canvas);
                const ctx = canvas.getContext('2d');
                canvas.width = firstImage.width;
                canvas.height = firstImage.height;
                const imageData = ctx.createImageData(firstImage.width, firstImage.height);
                imageData.data.set(rgba);
                ctx.putImageData(imageData, 0, 0);

                canvas.style.display = 'block';
                imgPreview.style.display = 'none';
            };
            reader.readAsArrayBuffer(file);
        } else if (file.type.startsWith('image/')) {
            // For other image types, use normal img preview
            const reader = new FileReader();
            reader.onload = function(event) {
                
                imgPreview.src = event.target.result;
                imgPreview.style.display = 'block';
                canvas.style.display = 'none';
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please drop an image file (including TIFF).');
        }
    }
}

function drawMatrix() {
    
    console.log(matrixVal.value);
    switch(matrixVal.value) {
        case '1':
            cols = 3;
            rows = 2;
            //dropContainer.setAttribute('style', "grid-template-columns: 50px 400px 400px 400px");
            //colTitles.setAttribute('style', "grid-template-columns: 50px 400px 400px 400px");
            break;
        case '2':
            cols = 4;
            rows = 2;
            break;
        case '3':
            cols = 3;
            rows = 1;
            break;
        case '4':
            cols = 4;
            rows = 1;
            break;
        case '5':
            cols = 2;
            rows = 2;
            break;
        case '6':
            cols = 1;
            rows = 2;
            break;
        case '7':
            cols = 2;
            rows = 1;
            break;
        case '8':
            cols = 5;
            rows = 2;
            break;
        default:
            cols = 3;
            rows = 2;
            break;

    }
    let gridStyle = "grid-template-columns: 50px" + " 400px".repeat(cols);
    dropContainer.setAttribute('style', `${gridStyle}`);
    colTitles.setAttribute('style', `${gridStyle}`);
    // console.log(gridStyle);

    // Delete all from container and column titles
    if(dropContainer.children.length > 0) {
        while(dropContainer.lastElementChild) {
            dropContainer.removeChild(dropContainer.lastElementChild);
        }
    }

    if(colTitles.children.length > 0) {
        while(colTitles.lastElementChild) {
            colTitles.removeChild(colTitles.lastElementChild);
        }

    }

    //Add column titles
    colTitles.append(document.createElement('div'));

    for(i=1; i<=cols; i++) {
        const newColTitle = colTitleTemplate.content.cloneNode(true).children[0];
        colTitles.append(newColTitle);
    }

    //Add drop areas
    for(i=1; i<=rows; i++) {
        const newRowTitle = rowTitleTemplate.content.cloneNode(true).children[0];
        dropContainer.append(newRowTitle);
        for(j=1; j<=cols; j++) {
            const newDropCont = dropContTemplate.content.cloneNode(true).children[0];
            dropContainer.append(newDropCont);
        }
    }

    rebind();
}

function preview() {
    let colTitle = COL_TITLE * document.getElementById("colTitles").checked;
    let rowTitle = ROW_TITLE * document.getElementById("rowTitles").checked;

    TILE_HEIGHT = parseInt(document.getElementById("height").value);
    TILE_WIDTH =  parseInt(document.getElementById("width").value);

    if(typeof TILE_HEIGHT != 'number') {
        TILE_HEIGHT = 750;
        document.getElementById("height").value = 750;
    }

    if(typeof TILE_WIDTH != 'number') {
        TILE_WIDTH = 1000;
        document.getElementById("width").value = 1000;
    }
    
    let borders = document.getElementById("borders").checked;
    let labels = document.getElementById("labels").checked;
    console.log(colTitle);

    let canvas = document.getElementById("canvas")
    let ctx = canvas.getContext('2d')

    let modal = document.getElementById("previewModal");

    canvas.height = rows * TILE_HEIGHT + colTitle;
    canvas.width =  cols * TILE_WIDTH + rowTitle;

    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //let modalHeight = 500;
    //let modalWidth =  500;

    //modal.style.height = modalHeight+"px";
    //modal.style.width = modalWidth+"px";
    modal.style.height = rows * TILE_HEIGHT + colTitle;
    modal.style.width = cols * TILE_WIDTH + rowTitle;

    // DRAW COLUMN TITLES
    if(colTitle) {
        for(var i = 0; i < cols; i++) {
            ctx.rect(i * TILE_WIDTH + rowTitle, 0, TILE_WIDTH, COL_TITLE);
            if(borders) { ctx.stroke(); }

            ctx.font = "80px Arial";
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            //console.log(document.getElementsByClassName("columnTitle")[i].innerText);
            ctx.fillText(document.getElementsByClassName("columnTitle")[i].innerText, i * TILE_WIDTH + rowTitle + (TILE_WIDTH / 2), 80);
            //ctx.fillText("TEST", 10, 10);
        }
        
    }

    // DRAW ROW TITLES
    if(rowTitle) {
        for(var i = 0; i < rows; i++) {
            ctx.rect(0, i * TILE_HEIGHT + colTitle, ROW_TITLE, TILE_HEIGHT);
            if(borders) { ctx.stroke(); }

            ctx.save();
            console.log(i * -1 * TILE_HEIGHT + colTitle + (TILE_HEIGHT / 2));
            ctx.rotate((Math.PI/180)*-90);
            ctx.font = "80px Arial";
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            //ctx.fillText(document.getElementsByClassName("rowTitle")[i].innerText, 80, i * TILE_HEIGHT + colTitle + (TILE_HEIGHT / 2));
            ctx.fillText(document.getElementsByClassName("rowTitle")[i].innerText, (i * TILE_HEIGHT + colTitle + (TILE_HEIGHT / 2)) * -1, 80);
            
            ctx.restore();
        }
    }

    // DRAW IMAGES

    let col = 0;
    let row = 0;
    for(var i = 0; i < imageAreas.length; i++) {
        if(col >= cols) {
            row = row + 1;
            col = 0;
        }
        //console.log(col, row);

        //check image
        let img;
        if(imageAreas[i].children[1].style.display == 'block') {
            img = imageAreas[i].children[1];
            //console.log('Image found');
        }
        else if(imageAreas[i].children[0].style.display == 'block') {
            img = imageAreas[i].children[0];
        }
        else {
            if(borders) { 
                ctx.rect(col * TILE_WIDTH + rowTitle, row * TILE_HEIGHT + colTitle, TILE_WIDTH, TILE_HEIGHT);
                ctx.stroke(); 
            }
            col++;
            continue;
        }
        console.log(col, row);
        if(borders) { 
            ctx.rect(col * TILE_WIDTH + rowTitle, row * TILE_HEIGHT + colTitle, TILE_WIDTH, TILE_HEIGHT);
            ctx.stroke();
        }
        const scaleFactor = Math.min((TILE_WIDTH - 50)/img.width, (TILE_HEIGHT - 50)/img.height);
        let newW = img.width*scaleFactor;
        let newH = img.height*scaleFactor;
        let newX = col * TILE_WIDTH + ((TILE_WIDTH - 50) - newW) / 2 + 25 + rowTitle;
        let newY = row * TILE_HEIGHT + ((TILE_HEIGHT - 50) - newH) / 2 + 25 + colTitle;
        ctx.drawImage(img, newX, newY, newW, newH);

        //DRAW IMAGE LABELS
        if(labels) {
            if(imageAreas[i].parentElement.children[0].children[0].innerText.trim() != "") {
                
                ctx.fillStyle = "white";
                ctx.strokeStyle = "black";
                ctx.fillRect(newX + 1, newY + 1, 200, 80);
                ctx.lineWidth = 2;
                ctx.strokeRect(newX + 1, newY + 1, 200, 80);
                ctx.stroke();
                ctx.fillStyle = "black";
                ctx.textAlign = "center";
                ctx.font = "50px Arial";
                ctx.fillText(imageAreas[i].parentElement.children[0].children[0].innerText, newX + 100, newY + 60);
            }

            if(imageAreas[i].parentElement.children[0].children[1].innerText.trim() != "") {
                ctx.fillStyle = "white";
                ctx.strokeStyle = "black";
                ctx.fillRect(newX + newW - 200 + 1, newY + 1, 200, 80);
                ctx.lineWidth = 2;
                ctx.strokeRect(newX + newW - 200 - 1, newY + 1, 200, 80);
                ctx.stroke();
                ctx.fillStyle = "black";
                ctx.textAlign = "center";
                ctx.font = "50px Arial";
                ctx.fillText(imageAreas[i].parentElement.children[0].children[1].innerText, newX + newW - 100, newY + 60);
            }
        }
        col++;
        
    }

    //ctx.clearRect(0,0, canvas.width, canvas.height)
    //ctx.fillStyle = "#ffff00"
    //ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function previewOpen() {
    preview();
    console.log('Preview open');
    let modal = document.getElementById("previewModal");
    modal.style.display = "block";
    return 1;
}

function previewClose() {
    let modal = document.getElementById("previewModal");
    modal.style.display = "none";
    return 1;
}

function copyToClipboard() {
    let scale = 0.5;

    const modalCanvas = document.getElementById('canvas');

    const newCanvas = document.createElement('canvas');
    newCanvas.width = modalCanvas.width * scale;
    newCanvas.height = modalCanvas.height * scale;

    const ctx = newCanvas.getContext('2d');
    ctx.drawImage(modalCanvas, 0, 0, newCanvas.width, newCanvas.height);

    newCanvas.toBlob(function(blob) {
        const item = new ClipboardItem({"image/png": blob});
        navigator.clipboard.write([item]);
    });
    
}

function copyImage() {
    preview();
    copyToClipboard();
}
