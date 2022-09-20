const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

const appid = "5a6321e19dc7d8559632a67fe83bbcbe";
const unit = "metric";



app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {

    res.sendFile(__dirname + "/index.html");
})

app.post("/", (req, res) => {

    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + req.body.cityname + "&appid=5a6321e19dc7d8559632a67fe83bbcbe&units=metric";
    https.get(url, function (response) {
        console.log(response.statusCode);

        response.on("data", (data) => {
            const WeatherData = JSON.parse(data);
            if (WeatherData.cod != "200") {
                res.write(WeatherData.message);
                res.send();
            }
            else {
                const temp = WeatherData.main.temp;
                const icon = WeatherData.weather[0].icon;
                const iconURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

                const WeatherDescription = WeatherData.weather[0].description;
                res.write("<h1>The temperature in " + req.body.cityname + " is " + temp + " deg Celcius.</h1>");
                res.write("<p>The Weather in " + req.body.cityname + " is Currently " + WeatherDescription + "</p>");
                res.write("<img src=" + iconURL + ">");
                res.send();
            }
        })
    }).on('error', function (e) {
            res.write("Api is Not Responding");
            res.send();
    });
})



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
