import { Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

//components
import Card from '../components/Card'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

//navigation
import { RootStackParamList } from '../routes/Navigator'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import { pxStyles } from '../theme/useTheme'

type AcknowledgementsProps = NativeStackScreenProps<RootStackParamList, 'Acknowledgements'>;

const Acknowledgements = ({ navigation }: AcknowledgementsProps) => {
    const styles = useStyles();

    const openLink = (url: string) => {
        Linking.openURL(url)
    };

    return (
        <ScrollView style={styles.container}>
            {/* <FloatBack onPress={() => navigation.goBack()} /> */}

            <View>
                <View style={styles.heading}>
                    <Text style={styles.text}>The following libraries were used in the making of this app</Text>
                </View>

                <Card>
                    <TouchableOpacity style={styles.link} onPress={() => openLink('https://reactnavigation.org/')} >
                        <Text style={styles.text}>React Navigation</Text>
                        <Icon name="chevron-right" size={24} style={styles.icon} />
                    </TouchableOpacity>
                </Card>

                <Card>
                    <TouchableOpacity style={styles.link} onPress={() => openLink('https://sheet.lodev09.com/')} >
                        <Text style={styles.text}>React Native True Sheet</Text>
                        <Icon name="chevron-right" size={24} style={styles.icon}/>
                    </TouchableOpacity>
                </Card>
                <Card>
                    <TouchableOpacity style={styles.link} onPress={() => openLink('https://docs.swmansion.com/react-native-reanimated/')} >
                        <Text style={styles.text}>React Native Reanimated</Text>
                        <Icon name="chevron-right" size={24} style={styles.icon} />
                    </TouchableOpacity>
                </Card>
                <Card>
                    <TouchableOpacity style={styles.link}onPress={() => openLink('https://github.com/callstack/react-native-pager-view')} >
                        <Text style={styles.text}>React Native Pager View</Text>
                        <Icon name="chevron-right" size={24} style={styles.icon} />
                    </TouchableOpacity>
                </Card>
                <Card>
                    <TouchableOpacity style={styles.link} onPress={() => openLink('https://oblador.github.io/react-native-vector-icons/')} >
                        <Text style={styles.text}>React Native Vector Icons</Text>
                        <Icon name="chevron-right" size={24} style={styles.icon} />
                    </TouchableOpacity>
                </Card>
                <Card>
                    <TouchableOpacity style={styles.link} onPress={() => openLink('https://github.com/cooperka/react-native-snackbarform')} >
                        <Text style={styles.text}>React Native Snackbar</Text>
                        <Icon name="chevron-right" size={24} style={styles.icon} />
                    </TouchableOpacity>
                </Card>
                <Card>
                    <TouchableOpacity style={styles.link} onPress={() => openLink('https://formik.org/')} >
                        <Text style={styles.text}>Formik</Text>
                        <Icon name="chevron-right" size={24} style={styles.icon} />
                    </TouchableOpacity>
                </Card>
                <Card>
                    <TouchableOpacity style={styles.link} onPress={() => openLink('https://github.com/jquense/yup')} >
                        <Text style={styles.text}>Yup</Text>
                        <Icon name="chevron-right" size={24} style={styles.icon} />
                    </TouchableOpacity>
                </Card>
                <Card>
                    <TouchableOpacity style={styles.link} onPress={() => openLink('https://github.com/axios/axios')} >
                        <Text style={styles.text}>Axios</Text>
                        <Icon name="chevron-right" size={24} style={styles.icon} />
                    </TouchableOpacity>
                </Card>
                <Card>
                    <TouchableOpacity style={styles.link} onPress={() => openLink('https://rnfirebase.io/')} >
                        <Text style={styles.text}>React Native Firebase</Text>
                        <Icon name="chevron-right" size={24} style={styles.icon} />
                    </TouchableOpacity>
                </Card>                
                <Card>
                    <TouchableOpacity style={styles.link} onPress={() => openLink('https://tanstack.com/')} >
                        <Text style={styles.text}>Tanstack Query</Text>
                        <Icon name="chevron-right" size={24} style={styles.icon} />
                    </TouchableOpacity>
                </Card>
            </View>

            <View style={{ marginTop: 15 }}>
                <View style={styles.heading}>
                    <Text style={styles.text}>The following APIs were used in the making of this app</Text>
                </View>
                <Card>
                    <TouchableOpacity style={styles.link} onPress={() => openLink('https://rawg.io/')} >
                        <Text style={styles.text}>RAWG</Text>
                        <Icon name="chevron-right" size={24} style={styles.icon} />
                    </TouchableOpacity>
                </Card>
            </View>

            <View style={{ marginVertical: 15 }}>
                <View style={styles.heading}>
                    <Text style={styles.text}>Other Acknowledgements</Text>
                </View>
                <Card>
                    <TouchableOpacity style={styles.link} onPress={() => openLink('https://firebase.google.com/')} >
                        <Text style={styles.text}>Google Firebase</Text>
                        <Icon name="chevron-right" size={24} style={styles.icon} />
                    </TouchableOpacity>
                </Card>                

            </View>

        </ScrollView>
    )
}


const useStyles = pxStyles((theme) => ({
    container: {
        flex: 1,
        backgroundColor: theme.background,
        paddingHorizontal: 10,
    },
    heading: {
        margin: 10,
    },
    text: {
        color: theme.primary,
        fontWeight: 'bold',
        fontSize: 16
    },
    link: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    icon: {
        color: theme.primary,
    }
}));

export default Acknowledgements;