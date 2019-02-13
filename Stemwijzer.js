/*globals subjects, parties, iQ, iQInput, iQLabel*/
// variabele met daarin alle stellingen van de stemwijzer
var currentAppScreenCount = 0;
var answers = [];
var importantQuestions = [];
var importantParties = [];
//0 = skip / 1 = oneens / 2 = geen van beide / 3 = eens
var choiceButtons = document.getElementsByClassName("choiceButton");
var partyExplanationListItems = document.getElementsByClassName("partyExplanationListItem");
var importantPartiesCheckboxes = document.getElementsByClassName('importantPartiesCheckboxes');
var partiesExplanationLists = document.getElementsByClassName('partiesExplanationLists');

function setupVoteGuide(position)  {
    if (position < subjects.length) {
        if (position == 0) {
            document.getElementById('statementsCon').classList.remove('w3-hide');
            document.getElementById('startBtn').classList.add('w3-hide');
            document.getElementById('voteGuideTitle').classList.add('w3-right');
            document.getElementById('backBtn').classList.add('w3-hide');
        } else if (position > 0) {
            document.getElementById('backBtn').classList.remove('w3-hide');
        }
        document.getElementById("q").innerHTML = subjects[currentAppScreenCount].statement;
        document.getElementById("tQ").innerHTML = subjects[currentAppScreenCount].title;
        Array.from(partiesExplanationLists).forEach(function (element) {
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
        });
        fillPartiesExplanations();
        Array.from(partyExplanationListItems).forEach(function(element) {
            element.onclick = function() {
                openPartyExplanation(element);
            };
        });
    } else if(position == subjects.length) {//important questions
        document.getElementById('statementsCon').classList.add('w3-hide');
        subjects.forEach(function(element, index){
            iQ = document.createElement('LI');
            iQInput = document.createElement('INPUT');
            iQInput.className = "w3-check";
            iQInput.dataset.question = index;
            iQInput.onchange = function(){
                toggleElementInArray(this.dataset.question, importantQuestions);
            };
            iQInput.type = "checkbox";
            iQLabel = document.createElement('LABEL');
            iQLabel.innerText = element.title;
            iQ.appendChild(iQInput);
            iQ.appendChild(iQLabel);
            document.getElementById('iQList').appendChild(iQ);
        });
        document.getElementById('importantStatementsCon').classList.remove('w3-hide');
        document.getElementById('nextBtn').onclick = function() {
            currentAppScreenCount++;
            setupVoteGuide(currentAppScreenCount);
        };
    } else if(position == (subjects.length + 1)) {//important parties
        document.getElementById('importantStatementsCon').classList.add('w3-hide');
        parties.forEach(function(element, index){
            iP = document.createElement('LI');
            iPInput = document.createElement('INPUT');
            iPInput.className = "w3-check importantPartiesCheckboxes";
            iPInput.dataset.party = element.name;
            iPInput.dataset.secular = element.secular;
            iPInput.onchange = function(){
                toggleImportantParty(this.dataset.party);
            };
            iPInput.type = "checkbox";
            iPLabel = document.createElement('LABEL');
            iPLabel.innerText = element.name;
            iP.appendChild(iPInput);
            iP.appendChild(iPLabel);
            document.getElementById('iPList').appendChild(iP);
        });
        document.getElementById('importantPartiesCon').classList.remove('w3-hide');
        document.getElementById('finishBtn').onclick = function() {
            currentAppScreenCount++;
            setupVoteGuide(currentAppScreenCount);
        };
    } else if(position == (subjects.length + 2)) {//result
        document.getElementById('importantPartiesCon').classList.add('w3-hide');
        document.getElementById('partiesResults').classList.remove('w3-hide');
		calculateScore();
        parties.sort(function(a, b) {
            return parseFloat(b.partyScore) - parseFloat(a.partyScore);
        });
		parties.forEach(function(element, index){
		    if (element.important === true) {
                var partyResultsScoreCon = document.createElement("DIV");
                partyResultsScoreCon.className = "partyResultsScoreCon";
                var partyResultsScoreConTitle = document.createElement("H3");
                partyResultsScoreConTitle.innerText = element.name;
                var progressBarCon = document.createElement("DIV");
                progressBarCon.className = "w3-light-grey progressBarCon";
                var progressBar = document.createElement("DIV");
                if (document.getElementsByClassName('progressBarCon').length < 3) {
                    progressBar.className = "w3-green w3-center";
                } else {
                    progressBar.className = "w3-grey w3-center";
                }
                progressBar.style.width = element.partyScorePercentage + "%";
                progressBar.innerText = element.partyScorePercentage + "%";
                partyResultsScoreCon.appendChild(partyResultsScoreConTitle);
                progressBarCon.appendChild(progressBar);
                partyResultsScoreCon.appendChild(progressBarCon);
                document.getElementById('partiesResultsScoresCon').appendChild(partyResultsScoreCon);
            }
		});
	}
}

function goBack() {
    if (currentAppScreenCount > 0) {
        currentAppScreenCount--;
        setupVoteGuide(currentAppScreenCount);
    }
}

function processChoice(choice) {
    if(choice == 0) {
        answers[currentAppScreenCount] = 0;
    } else if(choice == "contra") {
        answers[currentAppScreenCount] = "contra";
    } else if(choice == "ambivalent") {
        answers[currentAppScreenCount] = "ambivalent";
    } else if(choice == "pro") {
        answers[currentAppScreenCount] = "pro";
    }
    currentAppScreenCount++;
    setupVoteGuide(currentAppScreenCount);
}

// Zoekt de party waarbij de score omhoog moet
// De find()-methode geeft een waarde terug uit de array wanneer een element in de array aan de opgegeven testfunctie voldoet. In andere gevallen wordt undefined teruggegeven.
function findParty(partiesArray, partyToFind) {
    return partiesArray.find(function(element) {
        return element.name == partyToFind;
    });
}

// Kijkt voor elk antwoord of het overeenkomt met het antwoord van de gebruiker zoja dan word er een punt gegeven.
function calculateScore() {
    parties.forEach(function(currentElement){
        currentElement.partyScore = 0;
        currentElement.partyScorePercentage = 0;
    });
    answers.forEach(function(answersCurrentElement, answersIndex) {
        subjects[answersIndex].parties.forEach(function(subjectsCurrentElement) {
            if (subjectsCurrentElement.position == answersCurrentElement) {
                var currentParty = findParty(parties, subjectsCurrentElement.name);
                currentParty.partyScore++;
                if(importantQuestions.indexOf(answersIndex.toString()) != -1) {
                    currentParty.partyScore++;
                }
            }
        });
    });
	parties.forEach(function (element) {
		element.partyScorePercentage = Math.round(element.partyScore * 100 / (answers.length + importantQuestions.length));
	});
}

// als het element niet in de array staat word het gepusht. anders word het weg gehaald.
function toggleElementInArray(elm, array) {
    if(array.indexOf(elm) == -1){
        array.push(elm);
    } else {
        array.splice( array.indexOf(elm), 1 );
    }
}

function toggleImportantParty(party) {
    let currentParty = findParty(parties, party);
    if (currentParty.important == false) {
        currentParty.important = true;
    } else {
        currentParty.important = false;
    }
}

function selectImportantPartiesCheckboxes(type) {
    Array.from(importantPartiesCheckboxes).forEach(function(element){
        if (type == "all") {
            var currentParty = findParty(parties, element.dataset.party);
            if(element.checked == false) {
                element.checked = true;
                currentParty.important = true;
            }
        } else if(type == "none") {
            element.checked = false;
            parties.forEach(function (currentValue) {
                currentValue.important = false;
            });
        } else if (type === "secular") {
            let currentParty = findParty(parties, element.dataset.party);
            if(currentParty.secular === true) {
                currentParty.important = true;
                if(element.checked === false) {
                    element.checked = true;
                }
            } else {
                if (element.checked === true) {
                    element.checked = false;
                }
            }
        } else if (type === "large") {
            let currentParty = findParty(parties, element.dataset.party);
            if (currentParty.size > 0) {
                currentParty.important = true;
                if (element.checked === false) {
                    element.checked = true;
                }
            } else {
                if (element.checked === true) {
                    element.checked = false;
                }
            }
        }
    });
}

function fillPartiesExplanations() {
    let positionListConnections = {"pro": "proPartiesExplanationList", "ambivalent": "ambivalentPartiesExplanationList", "contra": "contraPartiesExplanationList"};
    subjects[currentAppScreenCount].parties.forEach(function (element) {
        let partyExplanationListItem =  document.createElement("LI");
        partyExplanationListItem.className = "w3-display-container partyExplanationListItem";
        let p1 =  document.createElement("P");
        p1.className = "w3-display-container";
        p1.innerText = element.name;
        let icon = document.createElement("I");
        icon.className = "fas fa-sort-down w3-display-right";
        p1.appendChild(icon);
        let p2 =  document.createElement("P");
        p2.className = "w3-margin-top w3-hide partyExplanation";
        p2.innerText = element.explanation;
        partyExplanationListItem.appendChild(p1);
        partyExplanationListItem.appendChild(p2);
        document.getElementById(positionListConnections[element.position]).appendChild(partyExplanationListItem);
    })
}

function openPartyExplanation(elm) {
    elm.querySelector(".partyExplanation").classList.toggle("w3-hide");
}

Array.from(choiceButtons).forEach(function(element) {
    element.onclick = function() {
        processChoice(element.dataset.choice);
    };
});

document.getElementById('startBtn').onclick = function() {
    setupVoteGuide(0);
};