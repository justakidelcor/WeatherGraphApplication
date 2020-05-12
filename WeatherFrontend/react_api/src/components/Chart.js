import React, {Component} from 'react';
import {Line} from 'react-chartjs-2';
import DateRangeExample from './DateRangeExample';


class Chart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            temperatureData: props.temperatureData,
            pressureData: props.pressureData,
            humidityData: props.humidityData
        }
    }

    render() {
        return (
            <div className="chart">

                <Line
                    data={this.state.temperatureData}
                    options={{
                        title: {
                            display: true,
                            text: 'Temperature changes',
                            fontSize: 25
                        },
                        legend: {
                            display: true,
                            position: 'right'
                        },
                    }}
                />

                {/*<Line
                    data={this.state.PressureData}
                    options={{
                        title: {
                            display: true,
                            text: 'Pressure changes',
                            fontSize: 25
                        },
                        legend: {
                            display: true,
                            position: 'right'
                        },
                    }}
                />

                <Line
                    data={this.state.HumidityData}
                    options={{
                        title: {
                            display: true,
                            text: 'Humidity changes',
                            fontSize: 25
                        },
                        legend: {
                            display: true,
                            position: 'right'
                        },
                    }}
                />*/}

            </div>
        )
    }
}

export default Chart;