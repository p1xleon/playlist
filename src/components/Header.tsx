import { StyleProp, Text, TouchableOpacity, View, ViewStyle } from 'react-native'
import React from 'react'

//navigation
import { RootStackParamList } from '../routes/Navigator';
import { NavigationProp, useNavigation } from '@react-navigation/native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { pxStyles } from '../theme/useTheme';

type HeaderProps = {
    title?: string;
    children?: JSX.Element | JSX.Element[];
    style?: StyleProp<ViewStyle>;
}

const Header = ({ title, children, style }: HeaderProps) => {
    const styles = useStyles();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                <Icon name='cog-outline' size={28} style={styles.icon} />
            </TouchableOpacity>
        </View>
    )
}


const useStyles = pxStyles((theme) => ({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 4,
        marginVertical: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: '900',
        color: theme.tertiary
    },
    icon: {
        color: theme.tertiary
    }
}));

export default Header;