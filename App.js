import React from 'react';
import { createStackNavigator } from 'react-navigation';
import Speedometer from './src/components/Speedometer';
import Maps from './src/components/Maps';

const Application = createStackNavigator(
    {
        Speedometer: {
            screen: Speedometer,
            navigationOptions: ({ navigation }) => ({
                header: null,
            })
        },
        Maps
    },
    {
        initialRouteName: 'Speedometer',
    }
)

export default class App extends React.Component {
    render() {
        return (
            <Application />
        );
    }
}