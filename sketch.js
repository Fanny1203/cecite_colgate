let images = [];
let currentImageIndex = 0;
let nextButton;
let restartButton;
let canvas;
let messageContainer;

// Étapes de l'expérience
// 0: Premier passage - images normales
// 1: Message intermédiaire "regardez bien"
// 2: Deuxième passage - images normales
// 3: Message avant résultats
// 4: Troisième passage - images avec rectangles et légendes
// 5: Conclusion
let etape = 0;

// Tableau des rectangles pour chaque image
// Format: [x, y, largeur, hauteur] relatif à l'image
const coordonnees_rectangles = [[0.75, 0.5, 0.24, 0.4], [0.65, 0.3, 0.35, 0.35], [0.37, 0.25, 0.1, 0.3]];

// Tableau des légendes pour chaque image
const labels = [
    "Cette main a vraiment trop de doigts !",
    "A qui appartient cette main ?",
    "Hum, ce monsieur n'a pas d'oreille droite !"
];

const intermediateText1 = "Vous avez vu les bouts de salade dans les dents des gens ? Mais avez-vous vu le reste ?!";

const intermediateText2 = "Vérifions ensemble !";

const conclusionText = `La cécité attentionnelle est un phénomène psychologique où notre cerveau peut complètement manquer des éléments pourtant visibles quand notre attention est focalisée sur une tâche spécifique.
Le rectangle rouge que vous avez vu dans le troisième tour était présent pour vous permettre de mettre en évidence une zone importante que vous avez peut-être manquée lors des premiers visionnages.
\nIl s'agit d'une campagne publicitaire pour Colgate: quel est le message, à votre avis ?
Source: https://www.publicidadeuskadi.com/ingeniosa-campana-de-publicidad-de-colgate`;

function preload() {
    // Load the three Colgate images
    images[0] = loadImage('assets/colgate_1.jpg');
    images[1] = loadImage('assets/colgate_2.jpg');
    images[2] = loadImage('assets/colgate_3.jpg');
}

function setup() {
    // Calcul de la taille du canvas en fonction de la fenêtre
    let canvasWidth = min(windowWidth * 0.8, 800);
    let canvasHeight = (canvasWidth * 3) / 4;
    if(canvasHeight > windowHeight) {
        canvasHeight = windowHeight*0.8;
        console.log("canvasHeight", canvasHeight);
        console.log("windowHeight", windowHeight);
        canvasWidth = (canvasHeight * 4) / 3;
    }
    
    
    // Création du canvas
    canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('canvas-container');
    
    // Create message container
    messageContainer = createDiv('');
    messageContainer.parent('canvas-container');
    messageContainer.class('message-container');
    
    // Create and style the next button
    nextButton = createButton('Suivant');
    nextButton.parent('canvas-container');
    nextButton.mousePressed(nextImage);
    nextButton.class('control-button');


    // Create and style the restart button
    restartButton = createButton('Recommencer');
    restartButton.parent('canvas-container');
    restartButton.mousePressed(restartExperiment);
    restartButton.class('control-button');

    restartExperiment();
}

function draw() {
    if (etape === 1) {
        displayMessage(intermediateText1);
    } else if (etape === 3) {
        displayMessage(intermediateText2);
    } else if (etape === 5) {
        displayMessage(conclusionText);
        nextButton.hide();restartButton.show();
    } else {
        // Afficher le canvas et masquer le message pour les étapes d'images
        canvas.show();
        messageContainer.hide();
        
        background(255);
        
        if (images[currentImageIndex]) {
            // Calculer les dimensions pour l'image
            let imgAspect = images[currentImageIndex].width / images[currentImageIndex].height;
            let imgWidth = width * 0.9;
            let imgHeight = imgWidth / imgAspect;
            
            // Centrer l'image
            let imgX = (width - imgWidth) / 2;
            let imgY = (height - imgHeight) / 2;
            
            // Dessiner l'image
            image(images[currentImageIndex], imgX, imgY, imgWidth, imgHeight);
            
            // Si nous sommes à l'étape 4, dessiner le rectangle et le texte
            if (etape === 4) {
                let rectCoords = coordonnees_rectangles[currentImageIndex];
                stroke(255, 0, 0);
                strokeWeight(2);
                noFill();
                
                // Dessiner le rectangle avec les coordonnées ajustées
                let rectX = imgX + (rectCoords[0] * imgWidth);
                let rectY = imgY + (rectCoords[1] * imgHeight);
                let rectW = rectCoords[2] * imgWidth;
                let rectH = rectCoords[3] * imgHeight;
                rect(rectX, rectY, rectW, rectH);
                
                // Afficher le texte sous l'image
                noStroke();
                fill(0);
                textAlign(CENTER, TOP);
                textSize(min(width * 0.03, 16));
                text(labels[currentImageIndex], width/2, imgY + imgHeight + 10);
            }
        }
    }
}


function keyPressed() {
    // Code 39 correspond à la flèche droite
    if (keyCode === 39) {
        nextImage();
    }
}

function nextImage() {
    if (etape === 0 || etape === 2 || etape === 4) {
        currentImageIndex++;
        if (currentImageIndex >= images.length) {
            currentImageIndex = 0;
            etape++;
        }
    } else {
        etape++;
    }
}

function restartExperiment() {
    currentImageIndex = 0;
    etape = 0;
    nextButton.show();
    restartButton.hide();
    canvas.show();
    messageContainer.hide();
}


function displayMessage(message) {
    // Masquer le canvas et afficher le conteneur de message
    canvas.hide();
    messageContainer.show();
    
    message = message.split('\n\n').map(p => `<p class="message-text">${p}</p>`).join('');
    message = message.replace(/(https:\/\/[^\s]+)/, '<a href="$1" class="source-link" target="_blank">$1</a>');
    
    messageContainer.html(message);
}


