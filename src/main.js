function predict() {
    const inputDate = new Date(document.getElementById('date').value);
    const date = isNaN(inputDate.getTime()) ? new Date(Date.now()) : inputDate;

    const isHoliday = document.getElementById('is-holiday').checked;
    const isWorkingday = document.getElementById('is-workingday').checked;
    const weathersit = parseFloat(document.getElementById('weathersit').value);
    const temp = parseFloat(document.getElementById('temp').value);
    const atemp = parseFloat(document.getElementById('atemp').value);
    const humidity = parseFloat(document.getElementById('humidity').value);
    const windspeed = parseFloat(document.getElementById('windspeed').value);

    let data = {
        season: getSeason(date), 
        yr: date.getFullYear() - 2011,
        mnth: date.getMonth() + 1,
        holiday: Number(isHoliday), 
        weekday: date.getDay(),
        workingday: Number(isWorkingday),
        weathersit: isNaN(weathersit) ? 0 : weathersit, 
        temp: isNaN(temp) ? 0 : temp, 
        atemp: isNaN(atemp) ? 0 : atemp, 
        humidity: isNaN(humidity) ? 0 : humidity, 
        windspeed: isNaN(windspeed) ? 0 : windspeed,
    };

    console.log(data);

    getPrediction(data).then((result) => {
        document.getElementById('result').style.display = 'block';
        document.getElementById('result').textContent = `Dự đoán số người thuê xe đạp: ${Math.round(result)}`;

        console.log(result);
    });
}

async function getPrediction(features) {
    try {
        const response = await fetch("http://localhost:5000/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(features),
        });

        if (!response.ok) {
            throw new Error("Lỗi API");
        }

        const data = await response.json();
        return data.prediction;
    } catch (error) {
        console.error("Có lỗi xảy ra:", error);
        return 0;
    }
}

function getSeason(date) {
    // Lấy tháng của ngày, giá trị trả về từ 0 (tháng 1) đến 11 (tháng 12)
    const month = date.getMonth();

    // Xác định mùa dựa trên tháng
    if (month >= 0 && month <= 2) {
        return 1; // Xuân
    } else if (month >= 3 && month <= 5) {
        return 2; // Hè
    } else if (month >= 6 && month <= 8) {
        return 3; // Thu
    } else {
        return 4; // Đông
    }
}
