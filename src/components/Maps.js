import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';

export default class Maps extends React.Component {

    constructor(props) {
        super(props);
    }

    goToSpeedometer() {
        this.props.navigation.navigate('Speedometer');
    }

    render() {
        return (
            <View>
                <Text>Here comes the map component</Text>
                <TouchableHighlight onPress={() => this.props.navigation.navigate('Speedometer')}>
                    <Text>Go to speedometer</Text>
                </TouchableHighlight>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    
});