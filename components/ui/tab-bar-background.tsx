import React from 'react';
import { View } from 'react-native';
import { colors } from '../../src/design/tokens';

export function TabBarBackground() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    />
  );
}
