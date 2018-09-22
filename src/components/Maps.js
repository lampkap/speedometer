import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, Platform } from 'react-native';
import MapView, { AnimatedRegion, Marker, Polyline } from 'react-native-maps';
import haversine from 'haversine';

export default class Maps extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            latitude: 50.9827782,
            longitude: 5.4898227,
            routeCoordinates: [],
            distanceTravelled: 0,
            prevLatLng: {},
            coordinate: new AnimatedRegion({
                latitude: 50.9827782,
                longitude: 5.4898227,
            })
        }
    }

    goToSpeedometer() {
        this.props.navigation.navigate('Speedometer');
    }

    componentWillMount() {
        navigator.geolocation.getCurrentPosition(
          position => {},
          error => alert(error.message),
          {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 1000
            }
        );
    }

    componentDidMount() {
        this.watchID = navigator.geolocation.watchPosition(
            position => {
                const { coordinate, routeCoordinates, distanceTravelled } = this.state;
                const { latitude, longitude } = position.coords;

                const NewCoordinate = {
                    latitude,
                    longitude
                };

                if(Platform.OS === "android") {
                    if(this.marker) {
                        this.marker._component.animateMarkerToCoordinate(NewCoordinate, 500);
                    }
                } else {
                    coordinate.timing(NewCoordinate).start();
                }

                this.setState({
                    latitude,
                    longitude,
                    routeCoordinates: routeCoordinates.concat([NewCoordinate]),
                    distanceTravelled: distanceTravelled + this.calcDistance(NewCoordinate),
                    prevLatLng: NewCoordinate
                });
            },
            error => console.log(error),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        )
    }

    calcDistance = newLatLng => {
        const { prevLatLng } = this.state;
        return haversine(prevLatLng, newLatLng) || 0;
    };

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
    }

    render() {
        return (
            <View style={styles.container}>
                <MapView 
                    style={styles.map}
                    region={{
                        latitude: this.state.latitude,
                        longitude: this.state.longitude,
                        latitudeDelta: 0.1,
                        longitudeDelta: 0.1,
                    }}
                    followsUserLocation
                    showsUserLocation
                    loadingEnabled
                >
                    {/* <Polyline coordinates={this.state.routeCoordinates} strokeWidth={5} /> */}
                </MapView>
                <TouchableHighlight onPress={() => this.props.navigation.navigate('Speedometer')}>
                    <Text>Go to speedometer</Text>
                </TouchableHighlight>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    }
});