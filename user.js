import User from '../models/user';
const { GoogleSpreadsheet } = require('google-spreadsheet');

const PRIVATE_KEY = '-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQD5VZvPRw2l/Wu+\nYCWGU9hzmsGisn0G3uAw7aEHmNAcsWCvOMoNpZTqDymTy5LyTgRHyJaIQ89EnKek\nzfXQcwNOJlYl22s9CJPVGF4OrntQ7Hf8jcbK2eLWyNYs62ctNI/jsLqJWvsGvAd+\nagUZvZB8vvnZlJhWTS5IZOLFXco8LZUwQrIFb3TjILelD4O7fE73/nfbZuKwT/8a\nOnCLo5PH9ffQBmgggW2XQi3S2ZkffHMupz+wdRTks+2PG3rBTP1Bo6KB7T4xkNPi\nOAa8vVcWgJ5H7JCgBchEMhIcLGxSEnZ8x6WOONExUVgY+QP5BY4zMHbw7Zh6UHL9\nX10hXP+RAgMBAAECggEATe7Uwy6V1QbHmRtLT1fAxa2fDaAVlUKvt4tm9E1u6zEE\nI/CvsyFI0PoJSGFunl8FVnyblJ8BV5RRkCEyTsPMSi6QacfSFqMqNgamS5d9AvfO\nrzmPY9ND5FelHig8OTR/Ly+Ltqgh42J9QyWXT4rhcSRuSvR3wy3fpBAok4Ez16fX\n1C8G3zraEQ4NW23mE1KG7jn0zS0IIfJCD9dU8cluOiRRvDhvujX1rJJjgPNHNqJ7\nLrbzak0bU/YgqHwXKaePxXDXKA+SB7a/HnKztzV99EsN0w85WC7TtwOYK2xevUeG\nGBIM1nJzJ+ak0TT95FIbEwnnGb64/L5Q2tCDlWBYawKBgQD9FB0IQOWJKF2ytIIi\nn9apWCcGl6QoqdLyP3c4NVla+w/ZnhGZg/fcPIywLAoZeQIf/6fLCyPEWGfBVrcy\nE/JsXsSWn4i3Irv0Xo6e04SmF2V26WP5PRziZXBJiRGjjcDej38QAYAXCDj/mKYK\n5/WUvtkpMuMQhvJ9VajAoGof0wKBgQD8Nm4/G1Efk1gOcBPJiEQCTp35NUp5Zv5f\nJ2py0QVRbntHzEn5/NONj58dEY799HO3VyMr0jUehUsb5cAjCeMLC/351VLvwaHu\nHWruGfVJENbuB8u3HjkDSmkjX4pbkfuVK4lry+EN9nVvXepR1kTjnRt73JL6u2tW\nMEQmd/BoiwKBgQCBn26rTooCcUFkiZ3p3BJXlEYQ01SKW0knOKh4iqKkvdjFbne3\nOGeYTw8EINpfZ6JV/1zS23bLVzh1R1P3e038gaGRQE8G9exs4o2L/eyAIZWfjTTe\ncJW9w5T6pRD6w10Y4UiESzBvG5AOIgJRrbMUJ5gUyPKSAXxsA5a2arNQbwKBgQDM\na1mD8KIZ05TlbtW63KUysYG8wQKxz1aQzSOsF9oVnFRzZxL2eYMGE8hFCTw6fW1k\nxk2NcPz41dSAsgC+5X6OL5QUcGCeTvTuSA2pGoUCSZHKr6rfqrFPB3qb3w4HFhUx\nXG4vXrn0VTPtpdMLrX18dpQWGjtO2aUv4EL8Yu4J7QKBgQDq9XRUT1IhJOjwmyS7\nZUTgOYdhyfGM7/0kNOwn2S/0VmlNwumdW7PpHZyTniZy4sqvGFcSMaO7AOqgWnE8\nSWsrxpMJpIoT/ioJUsjWKDblGtyaIasdxwdM17BFDXWgYF/j+rlvmtKoiFemZdwY\nMd7hBJpFA99hjBu4DD0OmUyU/A==\n-----END PRIVATE KEY-----\n'
const CLIENT_EMAIL = 'demo-info-form@testinfo-425610.iam.gserviceaccount.com'
// const SHEET_ID = '17sZDGqjwY7XRutzGcc243bVfjdQkqMeOWKqIQ2zcqfA'; // sheet test
const SHEET_ID = '1Osrd_YJNwTtWHlWBBu_ntVSOv8_7kZyaZ88sDNvIzPs';

class UserClass {
    async addUser(req, res) {
        const { name, address, phone } = req.body;
        try {
            const newUser = new User({ name, address, phone });
            await newUser.save();
            const doc = new GoogleSpreadsheet(SHEET_ID);

            await doc.useServiceAccountAuth({
                client_email: CLIENT_EMAIL,
                private_key: PRIVATE_KEY,
            });
            await doc.loadInfo();
            const sheet = doc.sheetsByIndex[0];
            await sheet.addRow(
                {
                    "name": name,
                    "address": address,
                    "phone": phone
                });
            res.status(200).send('Data submitted successfully');
        } catch (error) {
            console.log('addUser', error);
            res.status(500).send('Error submitting data');
        }
    }

    async home(req, res) {
        const doc = new GoogleSpreadsheet(SHEET_ID);
        await doc.useServiceAccountAuth({
            client_email: CLIENT_EMAIL,
            private_key: PRIVATE_KEY,
        });

        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[0];

        const range = 'B:C7';
        const cells = await sheet.getCellsInRange(range);
        console.log(cells)

        const data = [];
        const playerDefaultZero = new Player("zero", 0);
        data.push(playerDefaultZero)

        for (let i = 1; i < cells.length; i++) {
            const row = cells[i];
            const player = new Player(row[0], Number(row[1]));
            data.push(player);
        }
        const players = data;
        console.log(players)
        divineTeam(players)
        // res.render('index');
        res.status(200).send('okokoko');
    }
}

class Player {
    constructor(name, score) {
        this.name = name;
        this.score = score;
    }
}

function divineTeam(listPlayers) {
    const numberOfArray = listPlayers.length - 1;
    let totalMaxOfEachTeam = 0;
    const funtionDynamic = new Array(15001).fill(0);
    const mark = new Array(15001).fill(false);

    for (let i = 1; i <= numberOfArray; i++) {
        totalMaxOfEachTeam += listPlayers[i].score;
    }
    totalMaxOfEachTeam = Math.floor(totalMaxOfEachTeam / 2);

    for (let i = 1; i <= totalMaxOfEachTeam; i++) {
        funtionDynamic[i] = 100000;
        for (let j = 1; j <= numberOfArray; j++) {
            if (i >= listPlayers[j].score && j > funtionDynamic[i - listPlayers[j].score]) {
                funtionDynamic[i] = j;
                break;
            }
        }
    }

    while (funtionDynamic[totalMaxOfEachTeam] > numberOfArray) {
        totalMaxOfEachTeam -= 1;
    }
    while (totalMaxOfEachTeam > 0) {
        mark[funtionDynamic[totalMaxOfEachTeam]] = true;
        totalMaxOfEachTeam -= listPlayers[funtionDynamic[totalMaxOfEachTeam]].score;
    }

    let firstTotal = 0;
    let secondTotal = 0;
    for (let i = 1; i <= numberOfArray; i++) {
        if (mark[i]) {
            process.stdout.write(`${listPlayers[i].name}\n`);
            firstTotal += listPlayers[i].score;
        }
    }
    console.log(`total score team 1 = ${firstTotal}\n`);
    for (let i = 1; i <= numberOfArray; i++) {
        if (!mark[i]) {
            process.stdout.write(`${listPlayers[i].name}\n`);
            secondTotal += listPlayers[i].score;
        }
    }
    console.log(`total score team 2 = ${secondTotal}\n`);
}

export default new UserClass();

//7169592991:AAFtFnDoODGsdE3079EvzqgHdzZIC_xbIvc