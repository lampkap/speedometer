import React from 'react';
import { StyleSheet, Text, View, Dimensions, Animated, TouchableHighlight } from 'react-native';

const device_height = Dimensions.get('window').height;

console.log(device_height);

export default class Speedometer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            previousSpeed: 0,
            currentSpeed: 12,
            currentSpeedValue: 12,
            currentSpeedAnim: new Animated.Value(12),
            recommendedSpeed: 12,
            outerRingRadius: 124,
            digitRingRadius: 165,
        }
    }

    setCurrentSpeed() {
        return this.setSpeed(this.state.currentSpeed);
    }

    setRecommendedSpeed() {
        let transforms = this.setSpeed(this.state.recommendedSpeed);
        let borderColor = {borderTopColor: this.getRecommendedColor()};

        return {...transforms, ...borderColor};
    }

    getRecommendedColor() {
        return (this.state.recommendedSpeed < this.state.currentSpeed) ? '#A73F3A' : '#A1C064'
    }

    setRecommendedSpeedValue() {
        let angle = this.resetSpeedValueAngle(this.state.recommendedSpeed);
        let color = {color: this.getRecommendedColor()};

        return {...angle, ...color};
    }
    
    setSpeed(value) {
        let angle = 230 - (value * 2) * 7,
            theta = (angle * Math.PI) / 180,
            radius = this.state.outerRingRadius + 4,
            x = Math.cos(theta) * radius,
            y = Math.sin(theta) * -radius;

        return {
            transform: [{translateX: x}, {translateY: y}, {rotate: -angle + 'deg'}]
        }
    }

    resetSpeedValueAngle(value) {
        let angle = 230 - (value * 2) * 7;

        return {
            transform: [{rotate: angle + 'deg'}]
        }
    }

    createTicks() {
        let ticks = [], angle, theta, radius, x, y;

        for(let i = 0; i < 41; i++) {

            angle = 230 - i * 7;
            theta = (angle * Math.PI) / 180;
            radius = this.state.outerRingRadius + 4;
            x = Math.cos(theta) * radius;
            y = Math.sin(theta) * -radius;

            let currentSpeedTickIndex = this.state.currentSpeed * 2;
            let recommendedSpeedTickIndex = this.state.recommendedSpeed * 2;
            let color = '#fff';

            if(recommendedSpeedTickIndex > currentSpeedTickIndex) {
                if(i > currentSpeedTickIndex && i < recommendedSpeedTickIndex) {
                    color = '#A1C064';
                }
            } else {
                if(i < currentSpeedTickIndex && i > recommendedSpeedTickIndex) {
                    color = '#A73F3A';
                }
            }

            ticks.push(
                <View 
                    key={i}
                    style={[styles.tick, { borderTopColor: color, transform: [ {translateX: x}, {translateY: y}, {rotate: -angle + 'deg'} ] } ]}>
                </View>
            )
        }
        return ticks;
    }

    createDigits() {
        let digits = [], angle, theta, x, y;
        for(let i = 0; i < 5; i++) {

            angle = 230 - i * 70;
            theta = (angle * Math.PI) / 180;
            x = Math.cos(theta) * this.state.digitRingRadius;
            y = Math.sin(theta) * -this.state.digitRingRadius;

            digits.push(
                <Text 
                    key={i}
                    style={[styles.digit, { transform: [ {translateX: x}, {translateY: y}] }]}>
                    {i * 5}
                </Text>)
        }
        return digits;
    }

    componentDidMount() {
        setInterval(() => {
            let randNumber = Math.random(), newSpeed;

            // speed change between -.5 & .5
            if(randNumber > .4 && randNumber < .6) {
                newSpeed = this.state.currentSpeed;
            } else if(randNumber > .8) {
                newSpeed = this.state.currentSpeed + 1;
            } else if(randNumber > .6){
                newSpeed = this.state.currentSpeed + .5;
            } else if(randNumber < .2) {
                newSpeed = this.state.currentSpeed - 1;
            } else {
                newSpeed = this.state.currentSpeed - .5;
            }

            // speeds between 8 and 12
            // const speeds = [8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12];
            // let newSpeed = speeds[Math.floor(Math.random() * 9)];

            // all speeds 
            //let newSpeed = parseFloat((Math.round(Math.random() * 40) / 2).toFixed(1))

            this.setState({
                previousSpeed: this.state.currentSpeed,
                currentSpeed: newSpeed
            });
            this.state.currentSpeedAnim.addListener(({value}) => {
                if(parseFloat((Math.round(value * 2) / 2).toFixed(1)) !== this.state.currentSpeedValue) {
                    this.setState({currentSpeedValue: parseFloat((Math.round(value * 2) / 2).toFixed(1))})
                }
            });
            Animated.timing(
                this.state.currentSpeedAnim,
                {
                toValue: newSpeed,
                duration: 1000,
                }
            ).start();
            this.state.currentSpeedAnim.removeListener();
        }
        , 1500) 
    }

    calculateOffsets() {
        let xs = [], ys = [], angles = [], angle, theta, radius, x, y;

        for(let i = 0; i < 21; i++) {
            angle = 230 - (i * 2) * 7;
            theta = (angle * Math.PI) / 180;
            radius = this.state.outerRingRadius + 4;
            x = Math.cos(theta) * radius;
            y = Math.sin(theta) * -radius;

            xs.push(x);
            ys.push(y);
            angles.push(-angle + 'deg');
        }

        return {
            xs, ys, angles
        };
    }

    render() {

        const offsets = this.calculateOffsets();

        let { currentSpeedAnim } = this.state;

        let currentSpeedX = currentSpeedAnim.interpolate({
            inputRange: [...Array(21).keys()],
            outputRange: offsets.xs
        })

        let currentSpeedY = currentSpeedAnim.interpolate({
            inputRange: [...Array(21).keys()],
            outputRange: offsets.ys
        })

        let currentSpeedRot = currentSpeedAnim.interpolate({
            inputRange: [...Array(21).keys()],
            outputRange: offsets.angles
        })

        return (
            <View style={styles.speedometerContainer}>
                <View>
                    <View style={styles.outerRing}>
                        <View>
                            {this.createTicks()}
                        </View>
                        <View className="digit-ring">
                            {this.createDigits()}
                        </View>
                        <View>
                            <Animated.View style={[styles.currentSpeed, {transform: [ {translateX: currentSpeedX}, {translateY: currentSpeedY}, {rotate: currentSpeedRot} ]}]}></Animated.View>
                            {/* <View style={[styles.currentSpeed, this.setCurrentSpeed()]}></View> */}
                        </View>
                        <View>
                            <View style={[styles.recommendedSpeed, this.setRecommendedSpeed()]}> 
                                <Text style={[styles.recommendedSpeedValue, this.setRecommendedSpeedValue()]}>{this.state.recommendedSpeed}</Text>
                            </View>
                        </View>
                        <View style={styles.speedWrapper}>
                            <Text style={styles.speed}>{this.state.currentSpeedValue}</Text>
                            <Text style={styles.speedText}>knopen</Text>
                        </View>
                    </View>
                </View>
                <TouchableHighlight style={styles.button} onPress={() => this.props.navigation.navigate('Maps')}>
                    <Text>Go to map</Text>
                </TouchableHighlight>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    speedometerContainer: {
        maxWidth: 400,
        height: '100%',
        backgroundColor: '#A6D4D0',
    },
    outerRing: {
        width: 300,
        height: 300,
        borderRadius: 300/2,
        backgroundColor: '#5FA49D',
        display: 'flex',
        justifyContent: 'center',
        alignSelf: 'center',
        position: 'relative',
        top: 150,
    },
    tick: {
        width: 20,
        borderTopWidth: 2,
        borderTopColor: '#fff',
        position: 'absolute',
        top: 40, 
        alignSelf: 'center',
    },
    currentSpeed: {
        width: 100,
        borderTopWidth: 3,
        borderTopColor: '#fff',
        position: 'absolute',
        top: 40, 
        alignSelf: 'center',
    },
    recommendedSpeed: {
        width: 100,
        borderTopWidth: 3,
        position: 'absolute',
        top: 40, 
        alignSelf: 'center',
    },
    recommendedSpeedValue: {
        color: '#A1C064',
        fontSize: 16,
        fontWeight: 'bold',
        position: 'absolute',
        top: -15,
        right: -20,
    },
    digit: {
        position: 'absolute',
        top: 30,
        alignSelf: 'center',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
    speedWrapper: {
        alignSelf: 'center',
    },
    speed: {
        fontSize: 52,
        color: '#fff',
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    speedText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    button: {
        alignSelf: 'center',
        top: device_height / 2,
        display: 'none'
    }
});