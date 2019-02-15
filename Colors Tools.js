function getMinInObject(object) {
    
}
function getElementBackgroundColor(element) {
    return window.getComputedStyle(element).backgroundColor;
}
function getColorChannelsArrayFromRgb(rgb) {
    let rgbArray = rgb.slice(rgb.indexOf("(") + 1, rgb.length - 1).replace(/\s/g, '').split(",");
    rgbArray.forEach(function (element, index) {
        rgbArray[index] = Number(element);
    })
    return rgbArray;
}
function getColorChannelsObjectFromRgb(rgb/*rgba(255, 0, 0, 0.5) of array met kanalen*/) {
    let colorsObj = {};//de object die terug gegeven gaat worden
    let rgbArray = rgb; // de array met de kanalen (ik ga vanuit dat een array gepasst wordt)
    if (!Array.isArray(rgb)) {//als rgb geen array is maak ik een array van
        //eerst de "rgba" en de "()" weghalen
        //daarna de spaties verwijderen
        //daarna een array van maken door te splitten op elke "," dan is elk element een channel
        rgbArray = rgb.slice(rgb.indexOf("(") + 1, rgb.length - 1).replace(/\s/g, '').split(",");
    }
    //dan loop ik door die array (eerst declare ik een array met namen van de channels) en ik voeg elk element aan een index die bepaald staat in channelsNames
    rgbArray.forEach(function (channelValue, channelIndex) {
        let channelsNames = ["r", "g", "b", "a"];
        colorsObj[channelsNames[channelIndex]] = Number(channelValue);
    });
    return colorsObj;
}

function rgbaToHsla(rgbaObject) {
    if (Array.isArray(rgbaObject) || typeof rgbaObject === 'string') {
        rgbaObject = getColorChannelsObjectFromRgb(rgbaObject);
    }
    for (var key in rgbaObject) {
        rgbaObject[key] = Math.round((rgbaObject[key] / 255) * 100) / 100;
    }
}
function rgbaToHsla(rgbaArray) {
    rgbaArray.for(function (element, index) {
        rgbaArray[index] = Math.round((element / 255) * 100) / 100;
    });
    let channelsNames = ["r", "g", "b", "a"];
    let minChannel = Math.min(...rgbaArray);
    let minChannelName = channelsNames[rgbaArray.indexOf(minChannel)];
    let maxChannel = Math.max(...rgbaArray);
    let maxChannelName = channelsNames[rgbaArray.indexOf(maxChannel)];
}



