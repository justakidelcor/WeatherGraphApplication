import React from "react";
import DateRangePicker from "react-daterange-picker";
import "react-daterange-picker/dist/css/react-calendar.css";
import originalMoment from "moment";
import {extendMoment} from "moment-range";
import {Line} from "react-chartjs-2";
import Async from 'react-async';

const moment = extendMoment(originalMoment);

class Example extends React.Component {
    constructor(props, context) {
        super(props, context);

        const today = moment();

        this.state = {
            isOpen: false,
            value: moment.range(today.clone().subtract(7, "days"), today.clone()),
            weatherData: props.weatherData,
            temperatureData: props.temperatureData,
            pressureData: props.pressureData,
            humidityData: props.humidityData
        };
    }

    onSelect = (value, states) => {
        this.setState({value, states});
    };


    onToggle = () => {
        this.setState({isOpen: !this.state.isOpen});
    };

    renderSelectionValue = () => {
        return (
            <div>
                {this.state.value.start.format("YYYY-MM-DD")}
                {" - "}
                {this.state.value.end.format("YYYY-MM-DD")}
            </div>
        );
    };

    loadData = async (fromDate, toDate) =>
        fetch(`/getWeather?from=${fromDate}&to=${toDate}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
            },
        })
            .then(results => (results.ok ? results : Promise.reject(results)))
            .then(results => results.json())
            .then(weatherData => this.setState({weatherData: weatherData}));

    toggleButtonState = () => {

        let fromDate = this.state.value.start.format("YYYY-MM-DD");
        let toDate = this.state.value.end.format("YYYY-MM-DD");

        this.loadData(fromDate, toDate);

        const res = this.state.weatherData;
        let days = [];
        let temperature = [];
        let pressure = [];
        let humidity = [];

        if (res) {

            res.forEach(day => {

                temperature.push({'x': day.created,'y': day.temperature});
                pressure.push({'x': day.created,'y': day.pressure});
                humidity.push({'x': day.created,'y': day.humidity});
                days.push(day.created);

            });

            this.setState({
                temperatureData: {
                    labels: [fromDate, toDate],
                    datasets: [
                        {
                            label: 'Temperature',
                            data: [temperature],
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.6)',
                            ]
                        }

                    ],

                }
            })

        }

    };

    render() {
        return (
            <div>
                <div>{this.renderSelectionValue()}</div>

                <div>
                    <input
                        type="button"
                        value="Вкл/Выкл выбор диапазона"
                        onClick={this.onToggle}
                    />
                </div>

                {this.state.isOpen && (
                    <DateRangePicker
                        value={this.state.value}
                        onSelect={this.onSelect}
                        singleDateRange={true}
                    />
                )}
                <p/>
                <div>
                    <button onClick={this.toggleButtonState}>Сформировать графики за диапазон</button>
                </div>
                <div className="chart">
                    <Line
                        data={this.state.temperatureData}
                        options={{
                            title: {
                                display: true,
                                text: 'Temperature changes',
                                fontSize: 22
                            },
                            legend: {
                                display: true,
                                position: 'right'
                            },
                            scales: {
                                xAxes: [
                                    {
                                        type: "time",
                                        time: {
                                            tooltipFormat: "MMM D"
                                        }
                                    }
                                ],
                                yAxes: [
                                    {
                                        ticks: {
                                            beginAtZero: false
                                        }
                                    }
                                ]
                            }
                        }}
                    />
                </div>
            </div>
        );
    }
}

export default Example;
