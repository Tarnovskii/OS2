const parse1 = (value, moneys) => {
    if (moneys.one > 0) {
        if (value <= moneys.one) return {one: value}
    }
    return {enough: false}
}

const parse2 = (value, moneys) => {
    if (moneys.two > 0) {
        if (getRestFromNumber(value, 2) === 0) {
            if (value / 2 <= moneys.two) return {two: value / 2}
            return Object.assign({two: moneys.two}, parse1(value - 2 * moneys.two, moneys))
        }
        let counter = (value - getRestFromNumber(value, 2)) / 2
        if (counter <= moneys.two) {
            return Object.assign({two: counter}, parse1(value - counter * 2, moneys))
        }
    }
    return Object.assign({two: moneys.two}, parse1(value - moneys.two * 2, moneys))
}

const parse5 = (value, moneys) => {
    if (moneys.five > 0) {
        if (getRestFromNumber(value, 5) === 0) {
            if (value / 5 <= moneys.five) return {five: value / 5}
            return Object.assign({five: moneys.five}, parse2(value - 5 * moneys.five, moneys))
        }
        let counter = (value - getRestFromNumber(value, 5)) / 5
        if (counter <= moneys.five) {
            return Object.assign({five: counter}, parse2(value - counter * 5, moneys))
        }
    }
    return Object.assign({five: moneys.five}, parse2(value - moneys.five * 5, moneys))
}

const parse10 = (value, moneys) => {
    if (moneys.ten > 0) {
        if (getRestFromNumber(value, 10) === 0) {
            if (value / 10 <= moneys.ten) return {ten: value / 10}
            return Object.assign({ten: moneys.ten}, parse5(value - 10 * moneys.ten, moneys))
        }
        let counter = (value - getRestFromNumber(value, 10)) / 10
        if (counter <= moneys.ten) {
            return Object.assign({ten: counter}, parse5(value - counter * 10, moneys))
        }
    }
    return Object.assign({ten: moneys.ten}, parse5(value - moneys.ten * 10, moneys))
}

const parse20 = (value, moneys) => {
    if (moneys.twenty > 0) {
        if (getRestFromNumber(value, 20) === 0) {
            if (value / 20 <= moneys.twenty) return {twenty: value / 20}
            return Object.assign({twenty: moneys.twenty}, parse10(value - 20 * moneys.twenty, moneys))
        }
        let counter = (value - getRestFromNumber(value, 20)) / 20
        if (counter <= moneys.twenty) {
            return Object.assign({twenty: counter}, parse10(value - counter * 20, moneys))
        }
    }
    return Object.assign({twenty: moneys.twenty}, parse10(value - moneys.twenty * 20, moneys))
}

const parse50 = (value, moneys) => {
    if (moneys.fifty > 0) {
        if (getRestFromNumber(value, 50) === 0) {
            if (value / 50 <= moneys.fifty) return {fifty: value / 50}
            return Object.assign({fifty: moneys.fifty}, parse20(value - 50 * moneys.fifty, moneys))
        }
        let counter = (value - getRestFromNumber(value, 50)) / 50
        if (counter <= moneys.fifty) {
            return Object.assign({fifty: counter}, parse20(value - counter * 50, moneys))
        }
    }
    return Object.assign({fifty: moneys.fifty}, parse20(value - moneys.fifty * 50, moneys))
}

const parse100 = (value, moneys) => {
    if (moneys.hundred > 0) {
        if (getRestFromNumber(value, 100) === 0) {
            if (value / 100 <= moneys.hundred) return {hundred: value / 100}
            return Object.assign({hundred: moneys.hundred}, parse50(value - 100 * moneys.hundred, moneys))
        }
        let counter = (value - getRestFromNumber(value, 100)) / 100
        if (counter <= moneys.hundred) {
            return Object.assign({hundred: counter}, parse50(value - counter * 100, moneys))
        }
    }
    return Object.assign({hundred: moneys.hundred}, parse50(value - moneys.hundred * 100, moneys))
}

const getRestFromNumber = (dividend, divisor) => dividend % divisor

export const moneyParser = (value, moneys) => {
    switch(`${value}`.length) {
        case 1:
            return parse5(value, moneys);
        case 2:
            return parse50(value, moneys);
        default:
            return parse100(value, moneys);
    }
}


