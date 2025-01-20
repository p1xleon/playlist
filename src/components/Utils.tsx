import {
  Text,
  View,
  Pressable,
  ViewStyle,
  StyleProp,
  TouchableOpacity,
  TextInput,
  TextInputProps
} from 'react-native';
import React from 'react';

//utils and functions
import { useField } from 'formik';
import { IconSize } from '../utils/constants/enums/iconEnums';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { pxStyles } from '../theme/useTheme';

//SEPARATOR
type SeparatorProps = {
  style?: StyleProp<ViewStyle>;
}
const Separator = ({ style }: SeparatorProps) => {
  const styles = useStyles();
  return <View style={[styles.separator, style]}></View>;
};


//BADGE
type BadgeProps = {
  children: JSX.Element | JSX.Element[];
  style?: StyleProp<ViewStyle>;
};

const Badge = ({ children, style }: BadgeProps) => {
  const styles = useStyles();
  return (
    <View>
      <Pressable style={[styles.badge, style]}>{children}</Pressable>
    </View>
  );
};


//LINK
type LinkProps = {
  children?: JSX.Element | JSX.Element[];
  style?: StyleProp<ViewStyle>;
  iconName: string;
  title: string;
  onPress: () => void;
};

const SettingsLink = ({ children, style, iconName, title, onPress }: LinkProps) => {
  const styles = useStyles();
  return (
    <Pressable onPress={onPress} style={[styles.link, style]}>
      <View style={styles.linkGroup}>
        <Icon name={iconName} size={IconSize.m} style={styles.icon} />
        <Text style={styles.linkText}>{title}</Text>
      </View>
      {/* <Icon name='chevron-right' size={IconSize.m} color="#000000" /> */}
      {children}
    </Pressable>
  );
};


//RADIO BUTTON
type RadioGroupProps = {
  options: Option[];
  selectedOption: string | number | null;
  onChange: (value: string) => void;
  style?: StyleProp<ViewStyle>;
}

const RadioGroup = ({ options, selectedOption, style, onChange }: RadioGroupProps) => {
  const styles = useStyles();
  const handleSelectOption = (value: string) => {
    onChange(value);
  }
  return (
    <View>
      {options.map((option) => (
        <TouchableOpacity key={option.value} onPress={() => handleSelectOption(option.value)} >
          <View style={styles.radioOptions}>
            {<Text style={styles.radioText}>{option.label}</Text>}
            <View style={styles.radioCircle}>
              {selectedOption === option.value && <View style={styles.selectedOption} />}
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  )
}

//////////////TEXT INPUT
interface InputProps extends TextInputProps {
  label: string;
  name: string;
  iconName?: string;
};

const TxtInput: React.FC<InputProps> = ({ label, name, iconName, ...props }) => {
  const styles = useStyles();
  const [field, meta] = useField(name);
  return (
    <View style={styles.inputContainer}>
      <View style={{ flexDirection: 'row' }}>
        {/* {iconName && <Icon name={iconName} size={20} color={'#000'} />} */}
        <Text style={styles.label}>{label}</Text>
      </View>

      <TextInput style={styles.input} onChangeText={field.onChange(name)} onBlur={field.onBlur(name)} value={field.value} {...props} cursorColor='#ffffff' />
      {meta.touched && meta.error && (
        <Text style={styles.inputError}>{meta.error}</Text>
      )}
    </View>
  )
};


////////////BUTTTON
type ButtonProps = {
  title: string | React.ReactElement;
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
  disabled?: boolean;
};
const Button = ({ style, title, onPress }: ButtonProps) => {
  const styles = useStyles();
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};


//FLOATING BACK BUTTON
type FloatBackProps = {
  onPress: () => void;
}
const FloatBack = ({ onPress }: FloatBackProps) => {
  const styles = useStyles();
  return (
    <View style={styles.floatbutton}>
    <TouchableOpacity onPress={onPress}>
        <Icon name="chevron-left" color="#000" size={32} />
    </TouchableOpacity>
</View>
  )
}

const useStyles = pxStyles((theme) => ({
  //separator
  separator: {
    height: 1,
    backgroundColor: '#000000',
    // marginVertical: 10,
    borderRadius: 5,
    marginHorizontal: 5
  },

  //badge
  badge: {
    backgroundColor: theme.primary,
    padding: 7,
    marginRight: 10,
    borderRadius: 3,
    elevation: 3,
  },

  // settings link
  link: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 2,
    // justifyContent: 'space-between'
  },
  linkText: {
    fontSize: 18,
    color: theme.primary,
    fontWeight: '900',
    marginLeft: 25,
  },
  linkGroup: {
    flex: 1,
    flexDirection: 'row',
  },
  icon: {
    color: theme.primary
  },

  //radio button
  radioOptions: {
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 22,
  },
  radioText: {
    fontSize: 20,
    color: theme.primary,
    fontWeight: 'bold'
  },
  
  radioCircle: {
    height: 22,
    width: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#ffae00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedOption: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ffae00',
  },

  //text input
  inputContainer: {
    marginVertical: 8,

  },
  label: {
    color: '#d8d8d8',
    marginBottom: -10,
    marginLeft: 5
  },
  input: {
    // borderBottomWidth: 2,
    borderRadius: 5,
    // borderColor: '#ffffff',
    marginBottom: 4,
    color: theme.primary,
    fontWeight: 'bold',
    fontSize: 18,
    paddingBottom: -2,
    backgroundColor: '111',
  },
  inputError: {
    color: 'red',
  },

  //button
  button: {
    padding: 10,
    backgroundColor: theme.primary,
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 3,
    alignItems: 'center',
    width: '100%',
    alignSelf: 'center',
    elevation: 5
  },
  buttonText: {
    fontSize: 18,
    color: theme.background,
    fontWeight: '900',
    letterSpacing: 1.5,
  },

  //float back
  floatbutton: {
    backgroundColor: theme.primary,
    padding: 5,
    alignSelf: 'flex-start',
    borderRadius: 50,
    margin: 10
},
}));

export { Separator, Badge, SettingsLink, RadioGroup, TxtInput, Button, FloatBack };
