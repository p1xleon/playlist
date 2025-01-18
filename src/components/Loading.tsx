import { ActivityIndicator, StyleProp, View, ViewStyle } from 'react-native'
import React from 'react'

import { pxStyles } from '../theme/useTheme';

interface LoadingProps {
  style?: StyleProp<ViewStyle>;
}

export const Loading = ({ style }: LoadingProps) => {
  const styles = useStyles();
  return (
    <View style={[styles.loader, style]}>
      <ActivityIndicator size='large' color='#ff5e00' />
    </View>
  )
}

export const SmallLoader = () => {
  const styles = useStyles();
  return (
    <View style={styles.smolLoader}>
      <ActivityIndicator size='small' color='#7700ff' />
    </View>
  )
}

export const Loader = () => {
  const styles = useStyles();
  return (
    <View style={styles.ReLoader}>
      <ActivityIndicator size={30} color={'#ff1e00'} />
    </View>
  )
}

export const OverlayLoader = () => {
  const styles = useStyles();
  return (
    <View style={styles.ReLoader}>
      <ActivityIndicator size={30} color={'#ffd100'} />
    </View>
  )
}

const useStyles = pxStyles((theme) => ({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.background
  },
  smolLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ReLoader: {
    flex: 1,
    alignItems: 'center',
    padding: 0
  },
  overlayLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  }
}));
