import React from 'react';
import { StyleSheet, Text, View, Dimensions, Animated, TouchableHighlight, Easing } from 'react-native';
// import Svg, { Ellipse } from 'react-native-svg';
import { Svg, LinearGradient } from 'expo';

const AnimatedCircle = Animated.createAnimatedComponent(Svg.Circle);

// Notificaties sluiten met code?

const device_height = Dimensions.get('window').height;
const device_width = Dimensions.get('window').width;

export default class Speedometer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentSpeed: 0,
            currentSpeedAnim: new Animated.Value(0),
            recommendedSpeed: 0,
            recommendedSpeedAnim: new Animated.Value(0),
            angle: 270,
            circumferenceOuter: Math.PI * 2 * 40,
            circumferenceInner: Math.PI * 2 * 37,
        }

        this.state.currentSpeedAnim.addListener( (speed) => {
            let percent = speed.value * 2,
                value = percent / 100 * this.state.circumferenceInner;

            this._circle.setNativeProps({ strokeDasharray: [(value.toString()), this.state.circumferenceInner] })
        })

        this.state.recommendedSpeedAnim.addListener( (speed) => {
            let percent = speed.value * 2,
                value = percent / 100 * this.state.circumferenceOuter;

            this._circleRecommended.setNativeProps({ strokeDasharray: [(value.toString()), this.state.circumferenceOuter] })

            this.setState({
                angle: 270 - (speed.value * 2) * 3.6,
            })

            if(parseFloat(speed.value.toFixed(0)) !== this.state.recommendedSpeed) {
                this.setState({
                    recommendedSpeed: parseFloat(speed.value.toFixed(0)),
                })
            }
        })
    }

    createTick = () => {
        let percent = 31 * 2, angle, theta, radius, x, y;

        theta = (this.state.angle * Math.PI) / 180;
        radius = 130;
        x = Math.cos(theta) * radius;
        y = Math.sin(theta) * -radius;
        
        return [<View
            key={0} 
            style={[styles.tick, { borderTopColor: '#000', transform: [ {translateX: x}, {translateY: y}, {rotate: -this.state.angle + 'deg'} ] } ]}>
        </View>];
    }

    componentDidMount() {

        setInterval(() => {
            let randNumber = Math.random(), newSpeed;

            // if(this.state.currentSpeed <= 0) {
            //     newSpeed = this.state.currentSpeed + .1;
            // } else if(this.state.currentSpeed >= 20) {
            //     newSpeed = this.state.currentSpeed - .1;
            // } else {
            //     if(randNumber > .4 && randNumber < .6) {
            //         newSpeed = this.state.currentSpeed;
            //     } else if(randNumber > .6) {
            //         newSpeed = this.state.currentSpeed + .1;
            //     } else {
            //         newSpeed = this.state.currentSpeed - .1;
            //     } 
            // }

            // speeds between 8 and 12
            // const speeds = [8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12];
            // let newSpeed = speeds[Math.floor(Math.random() * 9)];

            // all speeds 
            newSpeed = parseFloat((Math.round(Math.random() * 50)));
            newRecommended = parseFloat((Math.round(Math.random() * 50)));

            this.state.currentSpeedAnim.addListener(({value}) => {
                if(parseFloat(value.toFixed(0)) !== this.state.currentSpeed) {
                    this.setState({
                        currentSpeed: parseFloat(value.toFixed(0)),
                    })
                }
            });

            Animated.timing(
                this.state.currentSpeedAnim,
                {
                toValue: newSpeed,
                duration: 1000,
                easing: Easing.easeOut
                }
            ).start();

            if(newRecommended !== this.state.recommendedSpeedAnim) {
                Animated.timing(
                    this.state.recommendedSpeedAnim,
                    {
                    toValue: newRecommended,
                    duration: 1000,
                    easing: Easing.easeOut
                    }
                ).start();
            }

            this.state.currentSpeedAnim.removeListener();
        }
        , 2000) 
    }

    render() {

        let colors;

        if(Math.abs(this.state.currentSpeed - this.state.recommendedSpeed) >= 5) {
            colors = ['#D86B55', '#D64B5A'];
        } else {
            colors = ['#87B36B', '#85B9D2'];
        }

        return (
            <LinearGradient colors={colors} style={styles.speedometerContainer}>
                <View style={styles.wrapper}>
                    <View style={styles.circles}>
                        <Svg width={device_width - 50} height={device_width - 50} viewBox="-50 -50 100 100" style={styles.circle}>
                            <Svg.Circle 
                                r="40"
                                stroke="rgba(255,255,255,.1)"
                                fill="none"
                                transform="rotate(90)"
                            />
                        </Svg>

                        <Svg width={device_width - 50} height={device_width - 50} viewBox="-50 -50 100 100" style={styles.circle}>
                            <AnimatedCircle 
                                r="40"
                                stroke="#000"
                                fill="none"
                                transform="rotate(90)"
                                ref={ref => this._circleRecommended = ref}
                                strokeDasharray={[0, this.state.circumferenceOuter]}
                            />
                            {this.createTick()}
                        </Svg>

                        <Svg width={device_width - 50} height={device_width - 50} viewBox="-50 -50 100 100" style={styles.circle}>
                            <AnimatedCircle 
                                r="37"
                                stroke="#FFF"
                                fill="none"
                                transform="rotate(90)"
                                ref={ref => this._circle = ref}
                                strokeDasharray={[0, this.state.circumferenceInner]}
                            />
                        </Svg>

                        <View style={styles.speedWrapper}>
                            <Text style={styles.speedText}>Huidige snelheid</Text>
                            <Text style={styles.speed}>{this.state.currentSpeed}</Text>
                            <Text style={styles.speedText}>knopen</Text>
                        </View>

                        <View style={styles.speedDifference}>
                            <Text style={styles.speedDifferenceText}>{this.state.recommendedSpeed - this.state.currentSpeed}</Text>
                        </View>

                    </View>

                    <Text style={styles.recommendedSpeedValue}>Aanbevolen snelheid: <Text style={styles.bigger}>{this.state.recommendedSpeed}</Text> knopen</Text>

                </View>

                {/* <TouchableHighlight style={styles.button} onPress={() => this.props.navigation.navigate('Maps')}>
                    <Text>Go to map</Text>
                </TouchableHighlight> */}
            </LinearGradient>
        );
    }
}

const styles = StyleSheet.create({
    speedometerContainer: {
        maxWidth: 400,
        height: '100%',
        backgroundColor: '#88B89C',
        display: 'flex',
        alignItems: 'center',
    },
    wrapper: {
        position: 'relative',
        top: 30,
    },
    circles: {
        justifyContent: 'center',
        width: device_width - 50,
        height: device_width - 50,
        alignSelf: 'center',
    },
    circle: {
        position: 'absolute',
        alignSelf: 'center',
    },
    speedWrapper: {
        alignSelf: 'center',
    },
    tick: {
        width: 15,
        borderTopWidth: 3,
        borderTopColor: '#000',
        position: 'absolute',
        alignSelf: 'center',
        top: 162
    },
    recommendedSpeedValue: {
        color: '#000',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 30,
    },
    bigger: {
        fontSize: 30
    },
    speedWrapper: {
        alignSelf: 'center',
    },
    speed: {
        fontSize: 82,
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
        // display: 'none'
    },
    speedDifference: {
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center',
        backgroundColor: '#000',
        borderRadius: 70 / 2,
        width: 70,
        height: 70,
        display: 'flex',
        justifyContent: 'center',
    },
    speedDifferenceText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 24,
        textAlign: 'center',
    }
});