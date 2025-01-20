import { View, ViewStyle, StyleProp } from 'react-native'
import React from 'react'

import { pxStyles } from '../theme/useTheme';

type CardProps = {
  children: JSX.Element | JSX.Element[];
  style?: StyleProp<ViewStyle>;
}

const Card = ({ children, style }: CardProps) => {
  const styles = useStyles();
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  )
}

const useStyles = pxStyles((theme) => ({
  card: {
    padding: 10,
    marginVertical: 3,
    borderRadius: 3,

    justifyContent: 'center',
  },
}));

export default Card;