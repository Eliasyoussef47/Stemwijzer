function getMinInObject(object) {
    
}
function getObjectKeyName(object, objectProperty) {
    return Object.keys(object).find(function(element) {
        return object[element] === objectProperty;
    });
}
function objectToArray(object) {
    let arr = [];
    for (let key in object) {
        arr.push(object[key]);
    }
    return arr;
}
function getElementBackgroundColor(element) {
    return window.getComputedStyle(element).backgroundColor;
}
function getColorChannelsArrayFromRgb(rgb) {
    let rgbArray = rgb.slice(rgb.indexOf("(") + 1, rgb.length - 1).replace(/\s/g, '').split(",");
    rgbArray.forEach(function (element, index) {
        rgbArray[index] = Number(element);
    });
    return rgbArray;
}
function getColorChannelsObjectFromRgb(rgb) {/*rgba(255, 0, 0, 0.5) of array met kanalen*/
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

// function rgbaToHsla(rgbaObject) {
//     if (Array.isArray(rgbaObject) || typeof rgbaObject === 'string') {
//         rgbaObject = getColorChannelsObjectFromRgb(rgbaObject);
//     }
//     for (var key in rgbaObject) {
//         rgbaObject[key] = Math.round((rgbaObject[key] / 255) * 100) / 100;
//     }
// }
function rgbaToHsla(rgbaArray) {
    let h, s, l;
    let a = rgbaArray[3] || 1;
    rgbaArray.forEach(function (element, index) {
        rgbaArray[index] = element / 255;
    });
    let channelsNames = ["r", "g", "b", "a"];
    let minChannel = Math.min(rgbaArray[0], rgbaArray[1], rgbaArray[2]);
    let maxChannel = Math.max(rgbaArray[0], rgbaArray[1], rgbaArray[2]);
    let maxChannelName = channelsNames[rgbaArray.indexOf(maxChannel)];
    l = (minChannel + maxChannel) / 2;
    if (minChannel === maxChannel) {
        s = 0;
    } else {
        if (l < 0.5) {
            s = (maxChannel - minChannel) / (maxChannel + minChannel);
        } else if (l >= 0.5) {
            s = (maxChannel - minChannel) / (2 - maxChannel - minChannel);
        }
    }
    if (maxChannelName === "r") {
        h = (rgbaArray[1] - rgbaArray[2]) / (maxChannel - minChannel);
    } else if (maxChannelName === "g") {
        h = 2 + (rgbaArray[2] - rgbaArray[0]) / (maxChannel - minChannel);
    } else if (maxChannelName === "b") {
        h = 4 + (rgbaArray[0] - rgbaArray[1]) / (maxChannel - minChannel);
    }
    h = h * 60;
    return  "hsla(" + (Math.round(h)) + ", " + (Math.round(s * 100)) + "%, " + (Math.round(l * 100)) + "%, " + a + ")";
}

function changeHslColor(hsl, channel, opperation, factor) {
    let hslArray = hsl.slice(hsl.indexOf("(") + 1, hsl.length - 1).replace(/\s/g, '').split(",");
    let a = hslArray[3] || 1;
    let channelIndex = ["h", "s", "l", "a"];
    hslArray[1] = hslArray[1].replace("%", ""); hslArray[2] = hslArray[2].replace("%", "");
    hslArray.forEach(function (element, index) {
        hslArray[index] = Number(element);
    });
    if (opperation === "+") {
        hslArray[channelIndex.indexOf(channel)] += factor;
    } else if (opperation === "-") {
        hslArray[channelIndex.indexOf(channel)] -= factor;
    } else if (opperation === "=") {
        hslArray[channelIndex.indexOf(channel)] = factor;
    }
    return  "hsla(" + hslArray[0] + ", " + hslArray[1] + "%, " + hslArray[2] + "%, " + a + ")";
}

