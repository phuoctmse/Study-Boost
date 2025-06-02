declare module 'react-native-slider' {
  import { Component } from 'react';
  import { StyleProp, ViewStyle } from 'react-native';

  export interface SliderProps {
    /**
     * Initial value of the slider
     */
    value?: number;
    /**
     * Initial minimum value of the slider
     */
    minimumValue?: number;
    /**
     * Initial maximum value of the slider
     */
    maximumValue?: number;
    /**
     * Step value of the slider. The value should be between 0 and maximumValue - minimumValue)
     */
    step?: number;
    /**
     * The color used for the track to the left of the button
     */
    minimumTrackTintColor?: string;
    /**
     * The color used for the track to the right of the button
     */
    maximumTrackTintColor?: string;
    /**
     * The color used for the thumb
     */
    thumbTintColor?: string;
    /**
     * The size of the touch area that allows moving the thumb.
     * The touch area has the same center as the visible thumb.
     * This allows to have a visually small thumb while still allowing the user
     * to move it easily.
     */
    thumbTouchSize?: { width: number, height: number };
    /**
     * Callback continuously called while the user is dragging the slider
     */
    onValueChange?: (value: number) => void;
    /**
     * Callback called when the user starts changing the value (e.g. when the slider is pressed)
     */
    onSlidingStart?: (value: number) => void;
    /**
     * Callback called when the user finishes changing the value (e.g. when the slider is released)
     */
    onSlidingComplete?: (value: number) => void;
    /**
     * The style applied to the slider container
     */
    style?: StyleProp<ViewStyle>;
    /**
     * The style applied to the track
     */
    trackStyle?: StyleProp<ViewStyle>;
    /**
     * The style applied to the thumb
     */
    thumbStyle?: StyleProp<ViewStyle>;
    /**
     * Set this to true to visually see the thumb touch rect in debug mode
     */
    debugTouchArea?: boolean;
    /**
     * Set to true if you want to use the default 'spring' animation
     */
    animateTransitions?: boolean;
    /**
     * Custom Animation type. 'spring' or 'timing'
     */
    animationType?: 'spring' | 'timing';
    /**
     * Used to configure the animation parameters. These are the same parameters in the Animated library
     */
    animationConfig?: object;
  }

  export default class Slider extends Component<SliderProps> {}
}
