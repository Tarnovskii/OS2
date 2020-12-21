import React, {Fragment} from "react";
import s from './atm.module.css'
import {generateFromTo} from "./utils/random";
import {moneyParser} from "./utils/moneyValueParser";

export default class extends React.Component {
    constructor(props) {

        super(props);
        this.state = {
            atmStatus: "idle",
            pin: "",
            sum: "",
            rest: 850,
            loggerState: '',
            money: {
                one: generateFromTo(0, 50),
                two: generateFromTo(0, 50),
                five: generateFromTo(0, 50),
                ten: generateFromTo(0, 50),
                twenty: generateFromTo(0, 50),
                fifty: generateFromTo(0, 50),
                hundred: generateFromTo(0, 50),
            },
            toGive: false,
            approveGive: false,
            moneyTransferRequest: false,
            moneyTransferConfirm: false,
        }
    }

    delay = 50;
    _turn = 1;
    _trayFlag = false;
    _transferFlag = false;
    _atmTrayProcess = null;
    _transferCreatingProcess = null;

    componentDidMount() {
        window.onkeydown = (e) => {
            if (e.key === 'Escape') {
                clearInterval(this._atmTrayProcess)
                clearInterval(this._transferCreatingProcess)
            }
        }
    }

    _getUpdatedMoney = () => {
        let money = this.state.money;
        for (const key in this.state.toGive) {
            money[key] -= this.state.toGive[key]
        }

        return money
    }

    _calcAtmBalance = () => {
        let atm_balance = 0;
        for (const key in this.state.money) {
            switch (key) {
                case 'one':
                    atm_balance += this.state.money[key]
                    break;
                case 'two':
                    atm_balance += 2 * this.state.money[key]
                    break;
                case 'five' :
                    atm_balance += 5 * this.state.money[key]
                    break;
                case 'ten' :
                    atm_balance += 10 * this.state.money[key]
                    break;
                case 'twenty' :
                    atm_balance += 20 * this.state.money[key]
                    break;
                case 'fifty' :
                    atm_balance += 50 * this.state.money[key]
                    break;
                case 'hundred' :
                    atm_balance += 100 * this.state.money[key]
                    break;
                default:
                    break;
            }
        }
        return atm_balance;
    }

    _addToLogger = (str) => {
        this.setState({
            loggerState: this.state.loggerState + '\n' + str
        })
    }

    _buttonsHandler = (buttonID) => {
        if (buttonID === 0) {
            switch (this.state.atmStatus) {
                case "idle":
                    this.setState({atmStatus: "pin"});
                    this._addToLogger(`ATM GENERATED: ${JSON.stringify(this.state.money, null, 4)}\nUSER BALANCE: ${this.state.rest}\nATM BALANCE: ${this._calcAtmBalance()}`)
                    this._atmTrayProcess = setInterval(async () => {
                        this._trayFlag = true;
                        while (this._transferFlag) {
                            if (this._turn) {
                                this._trayFlag = false;
                                while (this._turn) {}
                                this._trayFlag = true;
                            }
                        }

                        this._addToLogger('\n==============\nA-PROCESS (TRAY) GOT LOCKED ZONE');

                        if (this.state.toGive === false) {
                            this._addToLogger('Заявки на виплату не знайдено. Вихід із критичної зони.\n==============')
                            this._turn = 1;
                            this._trayFlag = false;
                        } else {
                            this._addToLogger('Надійшла заявка на виплату\nОбробка...')
                            if (+this.state.sum <= this.state.rest) {
                                this.setState({
                                    approveGive: true
                                }, () => {
                                    this._addToLogger('Запит схвалено. Вихід із критичної зони.\n==============')
                                    this._turn = 1;
                                    this._trayFlag = false;
                                })
                            }
                        }
                    }, this.delay + 10)

                    this._transferCreatingProcess = setInterval(async () => {
                        this._transferFlag = true;
                        while (this._trayFlag) {
                            if (!this._turn) {
                                this._transferFlag = false;
                                while (!this._turn) {}
                                this._transferFlag = true;
                            }
                        }
                        this._addToLogger('\n==============\nB-PROCESS (TRANSFER) GOT LOCKED ZONE');

                        if (this.state.approveGive === false) {
                            this._addToLogger('Запланованих виплат немає. Вихід із критичної зони\n==============')
                            this._turn = 0;
                            this._transferFlag = false;
                        } else {
                            this._addToLogger('В наявності 1 запланована виплата. Обробка...')

                            const toGive = moneyParser(+this.state.sum, this.state.money);

                            this._addToLogger(toGive.enough === false
                                ? 'Неможливо виплатити сумму. Вихід із критичної зони\n=============='
                                : 'Є Можливість виплати. Обробка...'
                            )
                            this.setState({
                                money: this._getUpdatedMoney(),
                                rest: this.state.rest - +this.state.sum,
                            }, () => {
                                this._addToLogger('Видача пройшла успішно. Вихід із критичної зони\n==============')
                                this.setState({
                                    sum: "",
                                    atmStatus: 'idle',
                                    toGive: false,
                                    approveGive: false,
                                }, () => {
                                    this._turn = 0;
                                    this._transferFlag = false;
                                })
                            })
                        }
                    }, this.delay)
                    break;
                case "menu":
                    this.setState({atmStatus: "watch_rest"});
                    break;
                default:
                    break;
            }
        } else if (buttonID === 1) {
            switch (this.state.atmStatus) {
                case "menu":
                    this.setState({atmStatus: "my_sum"});
                    break;
                default:
                    break;
            }
        } else if (buttonID === 2) {
            switch (this.state.atmStatus) {
                case "menu":
                    this.setState({atmStatus: "pre_sum"});
                    break;
                default:
                    break;
            }
        } else if (buttonID === 3) {
            switch (this.state.atmStatus) {
                case "menu":
                    this.setState({atmStatus: "idle"});
                    break;
                case "watch_rest":
                    this.setState({atmStatus: "menu"});
                    break;
                default:
                    break;
            }
        } else if (buttonID === 4) {
            switch (this.state.atmStatus) {
                case "pre_sum":
                    break;
                default:
                    break;
            }
        } else if (buttonID === 5) {
            switch (this.state.atmStatus) {
                case "my_sum":
                    // action
                    this._addToLogger(`Запит на зняття ${this.state.sum}`)
                    this.setState({
                        toGive: true
                    })
                    break;
                case "pin":
                    this.setState({atmStatus: "menu"});
                    break;
                default:
                    break;
            }
        } else if (buttonID === 6) {
            switch (this.state.atmStatus) {
                case "my_sum":
                    this.setState({sum: "", atmStatus: "menu"});
                    break;
                case "pin":
                    this.setState({pin: "", atmStatus: "idle"});
                    break;
                default:
                    break;
            }
        } else if (buttonID === 7) {
            switch (this.state.atmStatus) {
                case "my_sum":
                    this.setState({sum: this.state.sum.substr(0, this.state.sum.length - 1)});
                    break;
                case "pin":
                    this.setState({pin: this.state.pin.substr(0, this.state.pin.length - 1)});
                    break;
                case "pre_sum":
                    this.setState({atmStatus: "menu"})
                    break;
                default:
                    break;
            }
        }
    }

    _screenContent = () => {
        switch (this.state.atmStatus) {
            case "idle":
                return (<p>{`<--- СТАРТ`}</p>)
            case "pin":
                return (
                    <Fragment>
                        <input className={s.pin} value={this.state.pin} disabled={true}/>
                        <div className={s.pinFields}>
                            <p>{`Підтв. ---->`}</p>
                            <p>{`Відм. ---->`}</p>
                            <p>{`Стерт. ---->`}</p>
                        </div>
                    </Fragment>
                )
            case "menu":
                return (
                    <div className={s.menuFields}>
                        <p>{`<--- баланс`}</p>
                        <p>{`<--- Зняти свою сум.`}</p>
                        <p>{`<--- Зняти задану сум.`}</p>
                        <p>{`<--- Відм.`}</p>
                    </div>

                )
            case "watch_rest":
                return (
                    <div className={s.restScreen}>
                        <p>Залишок: {this.state.rest} грн.</p>
                        <p>{`<--- Назад.`}</p>
                    </div>
                )
            case "my_sum":
                return (
                    <Fragment>
                        <input className={s.pin} value={this.state.sum} disabled={true}/>
                        <div className={s.pinFields}>
                            <p>{`Підтв. ---->`}</p>
                            <p>{`Відм. ---->`}</p>
                            <p>{`Стерт. ---->`}</p>
                        </div>
                    </Fragment>

                )
            case "pre_sum":
                return (
                    <div className={s.presum}>
                        <tr>
                            <td>5грн.</td>
                            <td>10грн.</td>
                        </tr>
                        <tr>
                            <td>20грн.</td>
                            <td>50грн.</td>
                        </tr>
                        <tr>
                            <td>100грн.</td>
                            <td>200грн.</td>
                        </tr>
                        <tr>
                            <td>Max.</td>
                            <td>Назад</td>
                        </tr>
                    </div>
                )
            default:
                return "404 Page not found"
        }
    }

    _updatePin = (value) => {
        if (value.length > 1) return false;
        if (this.state.pin.length < 4) this.setState({pin: this.state.pin + value})
    }

    _updateSum = (value) => {
        if (value.length > 1) return false;
        if (this.state.sum.length < 9) this.setState({sum: this.state.sum + value})
    }

    _keyboardListener = (value) => {
        switch (this.state.atmStatus) {
            case "pin":
                this._updatePin(value);
                break;
            case "my_sum":
                this._updateSum(value);
                break;
            default:
                break;
        }
    }

    render() {
        return (
            <Fragment>
                <div className={s.atmWrapper}>
                    <h1>ATM</h1>
                    <div className={s.display}>
                        <div className={s.buttons}>
                            <button onClick={() => this._buttonsHandler(0)}/>
                            <button onClick={() => this._buttonsHandler(1)}/>
                            <button onClick={() => this._buttonsHandler(2)}/>
                            <button onClick={() => this._buttonsHandler(3)}/>
                        </div>
                        <div className={s.screen}>
                            {this._screenContent()}
                        </div>
                        <div className={s.buttons}>
                            <button onClick={() => this._buttonsHandler(4)}/>
                            <button onClick={() => this._buttonsHandler(5)}/>
                            <button onClick={() => this._buttonsHandler(6)}/>
                            <button onClick={() => this._buttonsHandler(7)}/>
                        </div>
                    </div>
                    <table className={s.keyboard} onClick={(e) => {
                        this._keyboardListener(e.target.textContent);
                    }}>
                        <tbody>
                        <tr>
                            <td>7</td>
                            <td>8</td>
                            <td>9</td>
                        </tr>
                        <tr>
                            <td>4</td>
                            <td>5</td>
                            <td>6</td>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>2</td>
                            <td>3</td>
                        </tr>
                        <tr>
                            <td>*</td>
                            <td>0</td>
                            <td>#</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div className={s.atmLogger}>
                    <h1>ATM LOGGER</h1>
                    <textarea value={this.state.loggerState} disabled/>
                </div>
            </Fragment>
        );
    }
}
