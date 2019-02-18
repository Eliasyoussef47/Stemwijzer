/*globals subjects, parties, iQ, iQInput, iQLabel*/
// variabele met daarin alle stellingen van de stemwijzer
let currentAppScreenCount = 0;
let maxAppScreenCount = subjects.length + 2;//omdat na de vragen komen er nog 3 schermen
let answers = [];
let importantQuestions = [];
let partiesCopy;
//0 = skip / 1 = oneens / 2 = geen van beide / 3 = eens
let mainAppScreens = document.getElementsByClassName("mainAppScreens");
let choiceButtons = document.getElementsByClassName("choiceButton");
let partyExplanationListItems = document.getElementsByClassName("partyExplanationListItem");
let importantPartiesCheckboxes = document.getElementsByClassName('importantPartiesCheckboxes');
let partiesExplanationLists = document.getElementsByClassName('partiesExplanationLists');

function setupVoteGuide(AppScreenCount)  {
    if (AppScreenCount < subjects.length) {
        setupProgressbar(AppScreenCount);
        if (AppScreenCount === 0) {
            document.getElementById('voteGuideTitle').classList.add('w3-right');
            hideElement([document.getElementById('startBtn'), document.getElementById('backBtn')]);
        } else if (AppScreenCount > 0) {
            showElement(document.getElementById('backBtn'));
        }
        showOnlyMainAppScreens(document.getElementById('statementsCon'));
        document.getElementById("q").innerHTML = subjects[AppScreenCount].statement;
        document.getElementById("tQ").innerHTML = subjects[AppScreenCount].title;
        Array.from(partiesExplanationLists).forEach(function (element) {
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
        });
        fillPartiesExplanations(AppScreenCount);
        Array.from(partyExplanationListItems).forEach(function(element) {
            element.onclick = function() {
                openPartyExplanation(element);
            };
        });
    } else if(AppScreenCount === subjects.length) {//important questions
        setupProgressbar(AppScreenCount);
        removeChildElements(document.getElementById('iQList'));
        subjects.forEach(function(element, index){
            let iQ = document.createElement('LI');
            let iQInput = document.createElement('INPUT');
            iQInput.className = "w3-check";
            iQInput.dataset.question = index;
            iQInput.onchange = function(){
                toggleElementInArray(this.dataset.question, importantQuestions);
            };
            iQInput.type = "checkbox";
            iQInput.checked = (importantQuestions.indexOf(index.toString()) !== -1);
            let iQLabel = document.createElement('LABEL');
            iQLabel.innerText = element.title;
            iQ.appendChild(iQInput);
            iQ.appendChild(iQLabel);
            document.getElementById('iQList').appendChild(iQ);
        });
        showOnlyMainAppScreens(document.getElementById('importantStatementsCon'));
        document.getElementById('nextBtn').onclick = function() {
            currentAppScreenCount++;
            setupVoteGuide(currentAppScreenCount);
        };
    } else if(AppScreenCount === (subjects.length + 1)) {//important parties
        setupProgressbar(AppScreenCount);
        removeChildElements(document.getElementById('iPList'));
        parties.forEach(function(element){
            let iP = document.createElement('LI');
            let iPInput = document.createElement('INPUT');
            iPInput.className = "w3-check importantPartiesCheckboxes";
            iPInput.dataset.party = element.name;
            iPInput.dataset.secular = element.secular;
            iPInput.onchange = function(){
                toggleImportantParty(this.dataset.party);
            };
            iPInput.type = "checkbox";
            iPInput.checked = element.important;
            let iPLabel = document.createElement('LABEL');
            iPLabel.innerText = element.name;
            iP.appendChild(iPInput);
            iP.appendChild(iPLabel);
            document.getElementById('iPList').appendChild(iP);
        });
        showOnlyMainAppScreens(document.getElementById('importantPartiesCon'));
        document.getElementById('finishBtn').onclick = function() {
            currentAppScreenCount++;
            setupVoteGuide(currentAppScreenCount);
        };
    } else if(AppScreenCount === (subjects.length + 2)) {//result
        setupProgressbar(AppScreenCount);
        showOnlyMainAppScreens(document.getElementById('partiesResults'));
        removeChildElements(document.getElementById('partiesResultsScoresCon'));
        setUpFeedbackBox(document.getElementById("feedbackBox-info"), ['Gelukt', 'Dit zijn uw resultaten']);
        showElement(document.getElementById("feedbackBox-info"));
		calculateScore();
        partiesCopy = parties.slice();
        partiesCopy.sort(function(a, b) {
            return parseFloat(b.partyScore) - parseFloat(a.partyScore);
        });
        partiesCopy.forEach(function(element){
		    if (element.important === true) {
                let partyResultsScoreCon = document.createElement("DIV");
                partyResultsScoreCon.className = "partyResultsScoreCon";
                let partyResultsScoreConTitle = document.createElement("H3");
                partyResultsScoreConTitle.innerText = element.name;
                let partyScoreProgressBarCon = document.createElement("DIV");
                partyScoreProgressBarCon.className = "w3-light-grey partyScoreProgressBarCon";
                let progressBar = document.createElement("DIV");
                if (document.getElementsByClassName('partyScoreProgressBarCon').length < 3) {
                    progressBar.className = "w3-green w3-center";
                } else {
                    progressBar.className = "w3-grey w3-center";
                }
                progressBar.style.width = element.partyScorePercentage + "%";
                progressBar.innerText = element.partyScorePercentage + "%";
                partyResultsScoreCon.appendChild(partyResultsScoreConTitle);
                partyScoreProgressBarCon.appendChild(progressBar);
                partyResultsScoreCon.appendChild(partyScoreProgressBarCon);
                document.getElementById('partiesResultsScoresCon').appendChild(partyResultsScoreCon);
            }
		});
	}
    console.log("%c " + getTimeForConsole(), "color: white; font-size: 15px");
    console.log("setupVoteGuide uitgevoerd. AppScreenCount: " + AppScreenCount);
}

function showElement(element) {
    if (Array.isArray(element)) {
        element.forEach(function (currentElement) {
            currentElement.classList.remove('w3-hide');
        })
    } else {
        element.classList.remove('w3-hide');
    }
    console.log("%c " + getTimeForConsole(), "color: white; font-size: 15px");
    console.log("showElement uitgevoerd. Element: " + element.id);
}

function hideElement(element) {
    if (Array.isArray(element)) {
        element.forEach(function (currentElement) {
            currentElement.classList.add('w3-hide');
        })
    } else {
        element.classList.add('w3-hide');
    }
    console.log("%c " + getTimeForConsole(), "color: white; font-size: 15px");
    console.log("hideElement uitgevoerd. Element: " + element.id);
}

function showOnlyMainAppScreens(element) {
    Array.from(mainAppScreens).forEach(function (currentMainAppScreen) {
        if (currentMainAppScreen === element) {
            showElement(currentMainAppScreen);
        } else {
            hideElement(currentMainAppScreen);
        }
    });
    console.log("%c " + getTimeForConsole(), "color: white; font-size: 15px");
    console.log("showOnlyMainAppScreens uitgevoerd. Element: " + element.id);
}

function removeChildElements(parentElement) {
    while (parentElement.firstChild) {
        parentElement.removeChild(parentElement.firstChild);
    }
    console.log("%c " + getTimeForConsole(), "color: white; font-size: 15px");
    console.log("removeChildElements uitgevoerd. Element: " + parentElement.id);
}

function setUpFeedbackBox(element, [title, body]) {
    element.querySelector('.feedbackBoxTitle').innerText = title;
    element.querySelector('.feedbackBoxBody').innerText = body;
    console.log("%c " + getTimeForConsole(), "color: white; font-size: 15px");
    console.log("setUpFeedbackBox uitgevoerd. Element: " + element.id);
}

function goBack() {
    if (currentAppScreenCount > 0) {
        currentAppScreenCount--;
        setupVoteGuide(currentAppScreenCount);
    }
    console.log("%c " + getTimeForConsole(), "color: white; font-size: 15px");
    console.log("goBack uitgevoerd. Element:");
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
    console.log("%c " + getTimeForConsole(), "color: white; font-size: 15px");
    console.log("processChoice uitgevoerd. keuze: " + choice);
}

// Zoekt de party waarbij de score omhoog moet
// De find()-methode geeft een waarde terug uit de array wanneer een element in de array aan de opgegeven testfunctie voldoet. In andere gevallen wordt undefined teruggegeven.
function findParty(partiesArray, partyToFind) {
    return partiesArray.find(function(element) {
        return element.name === partyToFind;
    });
    console.log("%c " + getTimeForConsole(), "color: white; font-size: 15px");
    console.log("findParty uitgevoerd. Te vinden partij: " + partyToFind);
}

// Kijkt voor elk antwoord of het overeenkomt met het antwoord van de gebruiker zoja dan word er een punt gegeven.
function calculateScore() {
    parties.forEach(function(currentElement){
        currentElement.partyScore = 0;
        currentElement.partyScorePercentage = 0;
    });
    answers.forEach(function(answersCurrentElement, answersIndex) {
        subjects[answersIndex].parties.forEach(function(subjectsCurrentElement) {
            if (subjectsCurrentElement.position === answersCurrentElement) {
                let currentParty = findParty(parties, subjectsCurrentElement.name);
                currentParty.partyScore++;
                if(importantQuestions.indexOf(answersIndex.toString()) !== -1) {
                    currentParty.partyScore++;
                }
            }
        });
    });
	parties.forEach(function (element) {
		element.partyScorePercentage = Math.round(element.partyScore * 100 / (answers.length + importantQuestions.length));
	});
    console.log("%c " + getTimeForConsole(), "color: white; font-size: 15px");
    console.log("calculateScore uitgevoerd.");
}

// als het element niet in de array staat word het gepusht. anders word het weg gehaald.
function toggleElementInArray(elm, array) {
    if(array.indexOf(elm) === -1){
        array.push(elm);
    } else {
        array.splice( array.indexOf(elm), 1 );
    }
    console.log("%c " + getTimeForConsole(), "color: white; font-size: 15px");
    console.log("toggleElementInArray uitgevoerd. Array: " + array + " element: " + elm);
}

function toggleImportantParty(party) {
    let currentParty = findParty(parties, party);
    currentParty.important = currentParty.important === false;
    console.log("%c " + getTimeForConsole(), "color: white; font-size: 15px");
    console.log("toggleImportantParty uitgevoerd. Array: " + array + " element: " + elm);
}

function selectImportantPartiesCheckboxes(type) {
    Array.from(importantPartiesCheckboxes).forEach(function(element){
        if (type === "all") {
            let currentParty = findParty(parties, element.dataset.party);
            if(element.checked === false) {
                element.checked = true;
                currentParty.important = true;
            }
        } else if(type === "none") {
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
    console.log("%c " + getTimeForConsole(), "color: white; font-size: 15px");
    console.log("selectImportantPartiesCheckboxes uitgevoerd. Type: " + type);
}

function fillPartiesExplanations(AppScreenCount) {
    let positionListConnections = {"pro": "proPartiesExplanationList", "ambivalent": "ambivalentPartiesExplanationList", "contra": "contraPartiesExplanationList"};
    subjects[AppScreenCount].parties.forEach(function (element) {
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
    });
    console.log("%c " + getTimeForConsole(), "color: white; font-size: 15px");
    console.log("fillPartiesExplanations uitgevoerd. AppScreenCount: " + AppScreenCount);
}

function openPartyExplanation(elm) {
    elm.querySelector(".partyExplanation").classList.toggle("w3-hide");
    console.log("%c " + getTimeForConsole(), "color: white; font-size: 15px");
    console.log("openPartyExplanation uitgevoerd. element: " + elm.id);
}

function getTimeForConsole() {
    let date = new Date();
    let y = date.getFullYear();
    let mon = date.getMonth();
    let d = date.getDate();
    let h = date.getHours();
    let min = date.getMinutes();
    let s = date.getSeconds();
    return y + "-" + mon + "-" + d + " " + h + ":" + min + ":" + s;
}

function setupProgressbar(AppScreenCount) {
    document.getElementById("progressBar").style.width = Math.round((AppScreenCount + 1) * 100 / (maxAppScreenCount + 1)) + "%";
    document.getElementById("progressBar").innerText = (AppScreenCount + 1) + "/" + (maxAppScreenCount + 1);
}

Array.from(choiceButtons).forEach(function(element) {
    element.onclick = function() {
        processChoice(element.dataset.choice);
    };
});

document.getElementById('startBtn').onclick = function() {
    setupVoteGuide(0);
};

document.getElementById("backgroundColorPicker").onchange = function () {
    document.getElementsByTagName("BODY")[0].style.backgroundColor = this.value;
};