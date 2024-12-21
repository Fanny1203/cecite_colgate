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
const coordonnees_rectangles = [[0.75, 0.6, 0.4, 0.4], [0.65, 0.35, 0.35, 0.35], [0.37, 0.3, 0.1, 0.3]];

// Tableau des légendes pour chaque image
const labels = [
    "Cette main a vraiment trop de doigts !",
    "A qui appartient cette main ?",
    "Hu, ce monsieur n'a pas d'oreille droite !"
];

const intermediateText1 = "Vous avez vu les bouts de salade dans les dents des gens ? Mais avez-vous vu le reste ?!";

const intermediateText2 = "Vérifions ensemble !";

const conclusionText = `La cécité attentionnelle est un phénomène psychologique où notre cerveau peut complètement manquer des éléments pourtant visibles quand notre attention est focalisée sur une tâche spécifique.
Le rectangle rouge que vous avez vu dans le troisième tour était présent pour vous permettre de mettre en évidence une zone importante que vous avez peut-être manquée lors des premiers visionnages.
Il s'agit d'une campagne publicitaire pour Colgate: quel est le message, à votre avis ?
Source: https://www.publicidadeuskadi.com/ingeniosa-campana-de-publicidad-de-colgate`;

function preload() {
    // Load the three Colgate images
    images[0] = loadImage('assets/colgate_1.jpg');
    images[1] = loadImage('assets/colgate_2.jpg');
    images[2] = loadImage('assets/colgate_3.jpg');
}

function setup() {
    canvas = createCanvas(800, 600);
    canvas.parent('canvas-container');
    
    // Create message container
    messageContainer = createDiv('');
    messageContainer.parent('canvas-container');
    messageContainer.class('message-container');
    messageContainer.hide();
    
    // Create the Next button and add it to the canvas container
    nextButton = createButton('Suivant');
    nextButton.parent('canvas-container');
    nextButton.mousePressed(nextImage);
    
    // Create the restart button
    restartButton = createButton('Recommencer l\'expérience');
    restartButton.parent('canvas-container');
    restartButton.mousePressed(restartExperiment);
    restartButton.hide();
    

}

function draw() {
    if (etape === 1 || etape === 3 || etape === 5) {
        // Cacher le canvas pour les étapes de texte
        canvas.hide();
        messageContainer.show();
        
        // Afficher le message approprié
        let message = '';
        if (etape === 1) message = intermediateText1;
        else if (etape === 3) message = intermediateText2;
        else if (etape === 5) {
            // Formater le texte de conclusion avec des paragraphes HTML
            message = conclusionText.split('\n\n').map(p => `<p class="message-text">${p}</p>`).join('');
            // Convertir le dernier lien en vrai lien HTML
            message = message.replace(/(https:\/\/[^\s]+)/, '<a href="$1" class="source-link" target="_blank">$1</a>');
        }
        messageContainer.html(message);
    } else {
        // Montrer le canvas et cacher le conteneur de message pour les étapes d'images
        canvas.show();
        messageContainer.hide();
        
        background(220);
        if (images[currentImageIndex]) {
            let img = images[currentImageIndex];
            let imgX = (width - img.width) / 2;
            let imgY = (height - img.height) / 2;
            
            image(img, imgX, imgY);
            
            if (etape === 4) {
                noFill();
                stroke(255, 0, 0);
                strokeWeight(3);
                const [rectX, rectY, rectWidth, rectHeight] = coordonnees_rectangles[currentImageIndex];
                rect(rectX*img.width, rectY*img.height, rectWidth*img.width, rectHeight*img.height);
                
                textAlign(CENTER);
                textSize(18);
                fill(0);
                noStroke();
                text(labels[currentImageIndex], width/2, imgY + img.height + 30);
            }
        }
    }
}

function splitTextIntoLines(text, maxWidth) {
    let words = text.split(' ');
    let lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        let testLine = currentLine + ' ' + words[i];
        if (textWidth(testLine) < maxWidth) {
            currentLine = testLine;
        } else {
            lines.push(currentLine);
            currentLine = words[i];
        }
    }
    lines.push(currentLine);
    return lines;
}

function nextImage() {
    // Si on est sur un message intermédiaire, passer directement à l'étape suivante
    if (etape === 1 || etape === 3) {
        etape++;
        return;
    }
    
    currentImageIndex++;
    
    // Si on a fini de montrer toutes les images du passage actuel
    if (currentImageIndex >= images.length) {
        currentImageIndex = 0;
        etape++;
        
        // Si on arrive à la conclusion
        if (etape === 5) {
            nextButton.hide();
            restartButton.show();
        }
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
