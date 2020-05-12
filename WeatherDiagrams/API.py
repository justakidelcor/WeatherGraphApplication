from flask import Flask
from flask import request
from flask import jsonify
import logging
from Database import SimplePGClass


logging.basicConfig(filename='log.log', level=logging.INFO, format='%(asctime)s %(message)s')

database = SimplePGClass(
                       user="postgres",
                       password="postgres",
                       host="localhost",
                       port="5432",
                       database="weatherdb"
                       )


def runApi(db):
    app = Flask(__name__)  # create the Flask app

    @app.route('/getWeather')
    def returnWeather():
        return getWeatherFromByDateToDate(db)

    @app.route('/')
    def getInfo():
        return "It's work"

    app.run(host='0.0.0.0', debug=True, port=5000)


def getWeatherFromByDateToDate(db):
    fromParam = request.args.get('from')
    toParam = request.args.get('to')
    # По-хорошему нужно ввести проверку на то что получаешь
    logging.log(logging.INFO, f'Getting weather from {fromParam} to {toParam}')
    data = db.getWeather(fromParam, toParam)
    logging.log(logging.INFO, data)
    if len(data) > 0:
        return jsonify(data)
    else:
        return jsonify({'Error': 'Weather data is not found for period'})


if __name__ == '__main__':
    with SimplePGClass(user='postgres', password='postgres', host='localhost', port='5432', database='weatherdb') as db:
        runApi(db)
        # 127.0.0.1:5000/getweather?from=2020-05-13&to=2020-05-23