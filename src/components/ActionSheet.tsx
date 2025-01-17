import React, {useRef, forwardRef, useImperativeHandle} from 'react';
import {View, Text, Pressable, ScrollView} from 'react-native';

import {TrueSheet} from '@lodev09/react-native-true-sheet';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {pxStyles} from '../theme/useTheme';

export interface SheetHandle {
  present: () => Promise<void>;
  dismiss: () => Promise<void>;
}

interface SheetComponentProps {
  children: React.ReactNode;
  title: string;
  sizes?: string[];
  onDismiss?: () => void;
}

const Sheet = forwardRef<SheetHandle, SheetComponentProps>(
  ({children, title, sizes, onDismiss}, ref) => {
    const styles = useStyles();
    const sheet = useRef<TrueSheet>(null);
    const scrollview = useRef<ScrollView>(null);
    useImperativeHandle(ref, () => ({
      present: async () => {
        await sheet.current?.present();
      },
      dismiss: async () => {
        await sheet.current?.dismiss();
      },
    }));

    return (
      <TrueSheet
        ref={sheet}
        sizes={['auto']}
        cornerRadius={7}
        style={styles.sheetContainer}
        onDismiss={onDismiss}
        >
        <View style={styles.sheetContainer}>
          <ScrollView ref={scrollview} nestedScrollEnabled>
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              <Pressable onPress={() => sheet.current?.dismiss()}>
                <Icon name="close-circle-outline" size={28} color="#f32929" />
              </Pressable>
            </View>
            {children}
          </ScrollView>
        </View>
      </TrueSheet>
    );
  },
);

const useStyles = pxStyles(theme => ({
  sheetContainer: {
    marginTop: 15,
    marginBottom: 20,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 20,
  },
  title: {
    flex: 1,
    color: theme.primary,
    fontSize: 24,
    fontWeight: 'bold',
  },
}));

export default Sheet;
