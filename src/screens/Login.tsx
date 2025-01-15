import { Text, TextInput, View } from 'react-native';
import React from 'react';

//naviagtion
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../routes/Navigator';

//firebase
import { logIn } from '../services/auth/firebase';

//hooks and utils
import { Formik } from 'formik';
import * as Yup from 'yup';

//components
import { Button } from '../components/Utils';
import { Loader } from '../components/Loading';

import { pxStyles } from '../theme/useTheme';

type LoginProps = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const Login = () => {
  const styles = useStyles();
  const navigation = useNavigation<LoginProps>();

  const initialValues = {
    email: '',
    password: ''
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email cannot be empty'),
    password: Yup.string().required('Password cannot be empty').min(6, 'Password must be at least 6 characters')
  });

  const handleLogin = async (values: typeof initialValues, { setErrors, setSubmitting }: any) => {
    try {
      const { email, password } = values;
      await logIn({ email, password });
      // console.log('User Logged in');
      navigation.replace('Tabs');
    } catch (error: any) {
      //handle firebase errors
      if (error.code === 'auth/invalid-email') {
        setErrors({ email: 'Invalid email address' });
      } else if (error.code === 'auth/wrong-password') {
        setErrors({ password: 'Incorrect password' });
      } else if (error.code === 'auth/user-not-found') {
        setErrors({ email: 'User not found' });
      } else if (error.code === 'auth/invalid-credential') {
        setErrors({ email: 'Invalid Credentials' });
      } else {
        setErrors({ general: 'Failed to log in' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
          <View style={styles.inputContainer}>
            <Text style={styles.title}>Login</Text>
            {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            <TextInput
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              placeholder='Email'
              placeholderTextColor='#505050'
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              cursorColor='#fff'
            />
            {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            <TextInput
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              placeholder='Password'
              placeholderTextColor='#505050'
              style={styles.input}
              cursorColor='#fff'
              secureTextEntry
            />
            <Button
              title={isSubmitting ? <Loader /> : 'Login'}
              onPress={handleSubmit}
              style={styles.button}
            />
            <Text style={styles.text}>
              Already have an account?
              <Text style={styles.loginLink} onPress={() => navigation.navigate('Signup')}> Sign up</Text>
            </Text>
          </View>
        )}
      </Formik>

    </View>
  );
};

const useStyles = pxStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginHorizontal: 15,
    marginBottom: 30,
  },
  input: {
    backgroundColor: theme.background,
    padding: 10,
    marginVertical: 10,
    borderRadius: 3,
    color: theme.primary,
    borderWidth: 1,
    borderColor: theme.primary,
    fontWeight: '900',
  },
  title: {
    fontSize: 44,
    marginBottom: 20,
    fontWeight: '900',
    color: theme.primary
  },
  button: {
    marginTop: 20,
    height: 45,

  },
  text: {
    marginTop: 15,
    alignSelf: 'center',
    fontSize: 16,
    color: theme.primary
  },
  loginLink: {
    color: '#ff7b00',
    fontWeight: '900',
    fontSize: 18
  },
  errorText: {
    color: '#ff1e00',
    fontWeight: '600'
  },
}));

export default Login;
