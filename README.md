# WeatherGraphApplication
python-react-docker application


WeatherDiagrams - pyhton application (backend)
WeatherFrontend - react app.


To run application step-by-step:

1) clone or download back and front. 
2) Download and install docker - if you don't have it already. Run docker official https://hub.docker.com/_/postgres postgres image.
3) Connect to it via any preferable db manager, like dbeaver or smth - create new db with name "weatherdb"
4) run cmd (if windows) and input: python <PATH_TO_WeatherDiagrams>\API.py
5) check new created table in weatherdb by python app - weatherdata
6) check the main api route go to : http://localhost:5000/getweather?from=2020-05-13&to=2020-05-23 - if you see response like that:
[
  {
    "created" : "2020-05-20",
    "temperature": "16.7"
    "humidity" : "0.3",
    "pressure" : "760"

  },
  ..
]

then all fine.

7) run web app by npm start in cmd in project folder.
8) by going to localhost:3000 you will web page with buttons to choose date range and then create graphs for choosen date range for the temperature.
