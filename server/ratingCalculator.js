const util = require('util');

function calculateRating(ratingList) {
    let count1 = 0;
    let count2 = 0;
    let count3 = 0;
    let count4 = 0;
    let count5 = 0;
    let rating = 0;

    for (let i = 0; i < ratingList.length; i++) {
        switch (ratingList[i]) {
            case 1:
                count1++;
                break;
            case 2:
                count2++;
                break;
            case 3:
                count3++;
                break;
            case 4:
                count4++;
                break;
            case 5:
                count5++;
                break;
        }
    }

    function get1() {
        let result = 0;
        switch (count1) {
            case 1:
                result = 1;
                break;
            case 2:
                result = 0.7;
                break;
            case 3:
                result = 0.4;
                break;
            case 4:
                result = 0.2;
            default:
                break;
        }
        return result;
    }

    function get2() {
        let result = 0;
        switch (count2) {
            case 1:
                result = 2;
                break;
            case 2:
                result = 1.8;
                break;
            case 3:
                result = 1.6;
                break;
            case 4:
                result = 1.4;
            default:
                break;
        }
        return result;
    }
    
    function get4() {
        let result = 0;
        switch (count4) {
            case 1:
                result = 4;
                break;
            case 2:
                result = 4.2;
                break;
            case 3:
                result = 4.4;
                break;
            default:
                break;
        }
        return result;
    }

    if (count1 === 0 && count2 === 0 && count4 === 0 && count5 === 0) {
        rating = 3;
    } else if (count1 === 0 && count2 === 0) {
        if (count5 === 0) {
            rating = get4();
        } else {
            rating = 5;
        }
    } else if (count4 === 0 && count5 === 0) {
        if (count1 === 0) {
            rating = get2();
        } else {
            rating = get1();
        }
    } else if (count5 === 0) {
        if (count1 === 0) {
            rating = (get2() + get4() - 1) / 2;
        } else {
            rating = (get1() + get4() - 2) / 2;
        }
    } else {
        if (count1 === 0) {
            rating = (get2() + 5 - 1) / 2;
        } else {
            rating = (get1() + 5 - 2) / 2;
        }
    }
    return rating;
}

module.exports = {calculateRating}