import { Text, TextInput, View } from 'react-native';
import React from 'react';

//navigatoin
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../routes/Navigator';

//firebase
import { signUp } from '../services/auth/firebase';

//hooks and functions
import { Formik } from 'formik';
import * as Yup from 'yup';

//components
import { Button } from '../components/Utils';
import { Loader } from '../components/Loading';
import { pxStyles } from '../theme/useTheme';

type SignupProps = NativeStackNavigationProp<RootStackParamList, 'Signup'>;

const Signup = () => {
  const styles = useStyles();

  const navigation = useNavigation<SignupProps>();

  const initialValues = {
    username: '',
    email: '',
    password: ''
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username cannot be empty').min(2, 'Username must be atleast  characters'),
    email: Yup.string().email('Invalid email address').required('Email cannot be empty'),
    password: Yup.string().required('Password cannot be empty').min(6, 'Password must be at least 6 characters')
  });

  const handleSignUp = async (values: typeof initialValues, { setErrors, setSubmitting }: any) => {
    try {
      const { email, password, username } = values;
      await signUp({ email, password, username });
      // console.log('User registered');
      navigation.replace('Tabs');
    } catch (error: any) {
      // handle Firebase errors
      if (error.code === 'auth/email-already-in-use') {
        setErrors({ email: 'This email is already in use' });
      } else if (error.code === 'auth/weak-password') {
        setErrors({ password: 'Password is too weak' });
      } else {
        setErrors({ general: 'Error signing up user' });
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
        onSubmit={handleSignUp}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
          <View style={styles.inputContainer}>
            <Text style={styles.title}>Sign up</Text>
            {touched.username && errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
            <TextInput
              value={values.username}
              onChangeText={handleChange('username')}
              onBlur={handleBlur('username')}
              placeholder='Name'
              placeholderTextColor='#505050'
              style={styles.input}
              cursorColor='#fff'
            />
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
              title={isSubmitting ? <Loader /> : 'SignUp'}
              onPress={handleSubmit}
              style={styles.button}
            />
            <Text style={styles.text}>
              Already have an account?
              <Text style={styles.signupLink} onPress={() => navigation.navigate('Login')}> Login</Text>
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
    color: theme.primary,
  },
  button: {
    marginTop: 20,
    height: 45
  },
  text: {
    marginTop: 15,
    alignSelf: 'center',
    fontSize: 16,
    color: theme.primary,
  },
  signupLink: {
    color: '#ff7b00',
    fontWeight: '900',
    fontSize: 18,
  },
  errorText: {
    color: '#ff1e00',
    fontWeight: '600'
  },
}));

export default Signup;
