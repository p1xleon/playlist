import { Linking, Text, TouchableOpacity, View } from 'react-native'
import React, { useRef } from 'react';

//styles
import { pxStyles } from '../theme/useTheme';
import { IconSize } from '../utils/constants/enums/iconEnums';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

//navigation
import { RootStackParamList } from '../routes/Navigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Sheet, { SheetHandle } from '../components/ActionSheet';

type AboutProps = NativeStackScreenProps<RootStackParamList, 'About'>;

const About = ({ navigation }: AboutProps) => {

    const sheetRef = useRef<SheetHandle>(null);
    const librarySheet = () => {
        sheetRef.current?.present();
    };

    const styles = useStyles();

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Icon name="cheese" size={IconSize.m} style={styles.icon} />
                <View>
                    <Text style={styles.superText}>Version</Text>
                    <Text style={styles.subText}>1.2</Text>
                </View>
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('Changelog')} style={styles.card}>
                <Icon name="code-tags" size={IconSize.m} style={styles.icon} />
                <View>
                    <Text style={styles.superText}>Changelog</Text>
                    <Text style={styles.subText}>- Bugs + Features</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Acknowledgements')} style={styles.card}>
                <Icon name="file-document" size={IconSize.m} style={styles.icon} />
                <View>
                    <Text style={styles.superText}>Third Party Notices</Text>
                    <Text style={styles.subText}>Libraries and APIs</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => Linking.openURL('https://github.com/p1xleoff/playlist')} style={styles.card}>
                <Icon name="github" size={IconSize.m} style={styles.icon} />
                <View>
                    <Text style={styles.superText}>Githib Repo</Text>
                    <Text style={styles.subText}>View Source Code</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={librarySheet} style={styles.card}>
                <Icon name="license" size={IconSize.m} style={styles.icon} />
                <View>
                    <Text style={styles.superText}>License</Text>
                    <Text style={styles.subText}>MIT License</Text>
                </View>
            </TouchableOpacity>

            <Sheet ref={sheetRef} title='License'>
                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.licenseText}>
                        MIT License
                    </Text>
                    <Text style={styles.licenseText}>
                        Copyright (c) 2024 p1xleoff
                    </Text>
                    <Text style={styles.licenseText}>
                        Permission is hereby granted, free of charge, to any person obtaining a copy
                        of this software and associated documentation files (the "Software"), to deal
                        in the Software without restriction, including without limitation the rights
                        to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                        copies of the Software, and to permit persons to whom the Software is
                        furnished to do so, subject to the following conditions:
                    </Text>
                    <Text style={styles.licenseText}>
                        The above copyright notice and this permission notice shall be included in all
                        copies or substantial portions of the Software.
                    </Text>
                    <Text style={styles.licenseText}>
                        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                        IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                        FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                        AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                        LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                        OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
                        SOFTWARE.
                    </Text>
                </View>
            </Sheet>

        </View>
    )
}


const useStyles = pxStyles((theme) => ({
    container: {
        flex: 1,
        backgroundColor: theme.background,
        paddingHorizontal: 10
    },
    card: {
        padding: 10,
        backgroundColor: theme.card,
        borderRadius: 3,
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
        elevation: 5
    },
    superText: {
        color: theme.primary,
        fontSize: 18,
        fontWeight: 'bold',
    },
    subText: {
        color: theme.secondary,
        fontSize: 16,
    },
    licenseText: {
        marginHorizontal: 20,
        color: theme.primary,
        fontSize: 16,
        marginVertical: 5
    },
    icon: {
        color: theme.primary,
        marginEnd: 20
    }
}));

export default About;