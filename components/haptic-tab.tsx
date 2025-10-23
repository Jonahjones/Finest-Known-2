import React from 'react';
import { TouchableOpacity } from 'react-native';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';

export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <TouchableOpacity
      {...props}
      onPress={(e) => {
        if (props.onPress) {
          // Add haptic feedback
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          props.onPress(e);
        }
      }}
    />
  );
}
