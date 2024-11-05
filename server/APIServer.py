from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib


app = Flask(__name__)
CORS (
    app, 
    resources={r"/predict": {"origins": "http://127.0.0.1:5500"}}, 
    methods=["POST"],
    allow_headers=["Content-Type"]
)

# Tải mô hình
model = joblib.load("model.joblib")
scaler = joblib.load("scaler.joblib")

@app.route("/predict", methods=["POST"])
def predict():
    # Nhận dữ liệu từ yêu cầu POST
    req_data = request.get_json()
    
    # Chuyển dữ liệu thành định dạng phù hợp với mô hình 
    # Ví dụ: Nếu mô hình yêu cầu một mảng giá trị
    input_data = [
        req_data['season'], 
        req_data['yr'],
        req_data['mnth'], 
        req_data['holiday'],
        req_data['weekday'],
        req_data['workingday'],
        req_data['weathersit'],
        req_data['temp'],
        req_data['atemp'],
        req_data['humidity'],
        req_data['windspeed'],
    ]  # Tùy chỉnh dựa trên số lượng đặc trưng (feature)
    
    data = scaler.transform([input_data])
    
    print('data:', data)
    # Thực hiện dự đoán
    prediction = model.predict(data)[0]
    
    # Trả kết quả dự đoán
    return jsonify({"prediction": prediction})

if __name__ == "__main__":
    app.run(debug=True)
