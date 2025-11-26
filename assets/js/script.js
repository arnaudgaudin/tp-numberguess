// selection node principale
const numberGuessNode = document.getElementById('numberGuess');

//selection des différents composants
const
    guessLevel = numberGuessNode.querySelector('.guess-level'),
    guessBet = numberGuessNode.querySelector('.guess-bet'),
    guessCheck = numberGuessNode.querySelector('.guess-check'),
    guessHistory = numberGuessNode.querySelector('.guess-history'),
    guessResult = numberGuessNode.querySelector('.guess-result'),
    guessHelp = numberGuessNode.querySelector('.guess-help');

//sélection de certains éléments spécifiques
const
    levelSelect = guessLevel.querySelector('select'),
    levelRangeValue = guessLevel.querySelector('.guess-level-help .value'),
    betInput = guessBet.querySelector('input'),
    checkButton = guessCheck.querySelector('button.check'),
    resetButton = guessResult.querySelector('button.reset'),
    historyList = guessHistory.querySelector('.guess-history-list');

//variables de jeu initialisées à leurs valeurs par défaut
let
    level = 1,              //niveau de difficulté,
    range = null,           //étendue des valeurs possibles
    bet = null,             //pari du joueur
    guess = null,           //nombre à deviner
    history = [],           //historique des propositions du joueur
    counter = null,         //nombre de tentative restantes
    helpDiff = null,        //différence entre le nombre deviné et le résultat attendu
    result = false;         //résultat de la partie

//fonction d'initialisation du compteur (en fonction de la difficulté)
const initCounter = () => {
    //multiplicateur pour le calcul du nombre de tentatives
    const rangeMultiply = 2 / 3;
    // logique de calcul du compteur en fonction du niveau (car le range dépend du niveau) :
    counter = Math.floor(range * rangeMultiply);

    //Valeurs possibles :
    // Niveau 1 : range = 3 => 3 * 2/3 = 2
    // Niveau 2 : range = 6 => 6 * 2/3 = 4
    // Niveau 3 : range = 9 => 9 * 2/3 = 6
    // Niveau 4 : range = 12 => 12 * 2/3 = 8
    // Niveau 5 : range = 15 => 15 * 2/3 = 10

    console.log(`Compteur initialisé: ${counter} (Etendue: ${range} x Multiplicateur: ${rangeMultiply})`);
}

//fonction d'initialisation du range (en fonction de la difficulté)
const initRange = () => {
    //multiplicateur pour le calcul de l'étendue des valeurs possibles
    const levelMultiply = 3;
    //mise à jour du range
    range = level * levelMultiply;

    //ajout d'un attribut max au champ input
    betInput.setAttribute('max', Math.floor(range * 1.5));

    //mise à jour de l'affichage de l'étendue dans l'aide au niveau
    levelRangeValue.textContent = range;
    
    console.log(`Range mis à jour: ${range} (Niveau: ${level} x Multiplicateur: ${levelMultiply})`);
}

//fonction de génération du nombre à deviner
const generateGuessNumber = () => {
    return Math.floor(Math.random() * range) + 1;
}

//gestion de l'affichage de l'historique
const updateHistoryDisplay = (forceReset = false) => {
    //vider l'historique avant de le reconstruire
    historyList.innerHTML = '';

    //si reset forcé, on quitte la fonction ici
    if (forceReset) return;

    //parcourir l'historique et créer les éléments de la liste
    history.forEach((entry) => {
        const listItem = document.createElement('li');
        listItem.textContent = entry;
        historyList.appendChild(listItem);
    });
}

//gestion de l'affichage des aides
const updateHelpDisplay = (forceReset = false) => {
    //sélection des helpers
    const
        helpUp = guessHelp.querySelector('.up'),
        helpEqual = guessHelp.querySelector('.equal'),
        helpDown = guessHelp.querySelector('.down');
    
    //cacher toutes les aides à l'initialisation
    helpUp.classList.remove('active');
    helpEqual.classList.remove('active');
    helpDown.classList.remove('active');

    //si reset forcé, on quitte la fonction ici
    if (forceReset) return;

    //affichage de l'aide correspondant au différentiel
    if (helpDiff > 0) {
        helpUp.classList.add('active');
    } else if (helpDiff < 0) {
        helpDown.classList.add('active');
    } else {
        helpEqual.classList.add('active');
    }
}

//gestion de l'affichage du résultat
const updateResultDisplay = (forceReset = false) => {
    const
        messageCounter = guessResult.querySelector('.counter'),
        messageVictory = guessResult.querySelector('.victory'),
        messageDefeat = guessResult.querySelector('.defeat'),
        counterValue = guessResult.querySelector('.counter-value');

    //mise à jour de l'affichage du compteur
    counterValue.textContent = counter;
    
    //cacher tous les messages à l'initialisation
    messageCounter.classList.remove('active');
    messageVictory.classList.remove('active');
    messageDefeat.classList.remove('active');
    resetButton.classList.remove('active');

    //si reset forcé, on quitte la fonction ici
    if (forceReset) return;
    
    //affichage du message correspondant au résultat
    if (result) {
        messageVictory.classList.add('active');

        //affichage du bouton de reset pour recommencer une partie en cas de victoire
        resetButton.classList.add('active');
        resetButton.textContent = 'Recommencer une nouvelle partie';
    } else {
        if (counter > 0) {
            messageCounter.classList.add('active');
        } else {
            messageDefeat.classList.add('active');
            //affichage du bouton de reset pour recommencer une partie en cas de détaite
            resetButton.classList.add('active');
            resetButton.textContent = 'Réessayer une nouvelle partie';
        }
    }
}

//fonction d'initialisation du jeu (permet aussi de le réinitialiser)
const gameInit = () => {
    //application du niveau de dificulté sélectionné
    level = parseInt(levelSelect.value);

    //mise à jour de l'étendue des valeurs possibles
    initRange();

    //mise à jour du compteur
    initCounter();

    //vidage du champ input du pari
    betInput.value = '';
    bet = null;

    //vidage de l'historique
    history = [];

    //réinitialisation du différentiel de résultat
    helpDiff = null;

    //partie perdue par défaut
    result = false;

    //génération du nombre à deviner
    guess = generateGuessNumber();
    console.log('Nombre à deviner:', guess);

    //réinitialisation de l'affichage de l'historique
    updateHistoryDisplay(true);

    //réinitialisation de l'affichage des aides
    updateHelpDisplay(true);

    //réinitialisation de l'affichage du résultat
    updateResultDisplay(true);
}

//initialisation du jeu au changement de niveau, au chargement de la page et au reset du jeu
levelSelect.addEventListener('change', gameInit);
window.addEventListener('load', gameInit);
resetButton.addEventListener('click', gameInit);

//validation de la proposition du joueur à la soumission du formulaire (pour vérifier le remplissage du champ input)
numberGuessNode.addEventListener('submit', (e) => {
    e.preventDefault();
    
    //récupération du pari du joueur
    bet = parseInt(betInput.value);
    
    //décrémentation du compteur si supérieur à 0
    if (counter > 0) {
        counter--;
        console.log(`Tentative validée: ${bet}`, `Tentatives restantes: ${counter}`);

        //stockage du pari dans l'historique
        history.push(bet);

        //calcul de l'aide (différence entre le pari et le nombre à deviner)
        helpDiff = guess - bet;
        console.log(`Différence (aide): ${helpDiff}`);
        
        //vérification du pari
        if (bet === guess) {
            result = true;
        } else {
            result = false;
        }

        //mise à jour de l'affichage des aides
        updateHelpDisplay();

        //mise à jour de l'affichage de l'historique
        updateHistoryDisplay();

    } else {
        console.log('Plus de tentative restante');
        //gérer la fin de partie
        result = false;
    }

    //mise à jour de l'affichage du résultat
    updateResultDisplay();
});