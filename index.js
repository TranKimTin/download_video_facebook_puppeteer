const puppeteer = require('puppeteer');
const express = require("express");
const app = express();
const port = process.env.PORT || 6543;
const cors = require("cors");

app.use(cors({ origin: true, credentials: true }));
app.use("/", express.static("public"));

let browser = null;
let page = null;
app.get("/getlink", async (req, res) => {
    try {
        let url = req.query.url;
        console.log(url);
        browser = browser || await puppeteer.launch({ headless: true, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' });
        if (!page) {
            page = await browser.newPage();
            page.setDefaultNavigationTimeout(60000);
            await page.goto('https://saveas.co/');
            await page.addScriptTag({ content: `${getLink}` });
        }
        let link = await page.evaluate(url => getLink(url), url);
        link = link.links;
        link.sort((a, b) => b.bytes - a.bytes);
        //await browser.close();
        console.log(link[0].url);
        res.json({ url: link[0].url });
    }
    catch (err) {
        console.log(err)
        res.json({ url: 'error' });
    }
});

app.listen(port, () =>
    console.log(`Example app listening at http://localhost:${port}`)
);

function getLink(url) {
    console.log(url);
    return fetch("https://saveas.co/system/action.php", {
        "headers": {
            "accept": "*/*",
            "accept-language": "vi-VN,vi;q=0.9,ko-KR;q=0.8,ko;q=0.7,fr-FR;q=0.6,fr;q=0.5,en-US;q=0.4,en;q=0.3",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
            "sec-ch-ua-mobile": "?0",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest"
        },
        "referrer": "https://saveas.co/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": `url=${url}`,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    }).then(response => response.json())
        .catch(err => console.log(err));
}
