import { View, Text, KeyboardAvoidingView, TextInput, Pressable, Alert } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const RegisterScreen = () => {
    const [email, setEmail] = useState("");
    const [image, setImage] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const navigation = useNavigation();

    const handleRegister = () => {
        const user = {
            name, email, password, image,
        };

        // send a post request to the backend to register the user
        axios.post("http://10.0.2.2:8000/register", user)
            .then((response) => {
                console.log(response);
                Alert.alert(
                    "Registration Successful",
                    "You have been registered successfully"
                );
                setName("");
                setEmail("");
                setPassword("");
                setImage("");
            })
            .catch((err) => {
                console.log("Error registering user", err);
                Alert.alert(
                    "Registration Error",
                    "An error occurred while registering"
                )
            })

    }

    return (
        <View style={{
            flex: 1,
            backgroundColor: 'white',
            padding: 10,
            alignItems: "center",
        }}>
            <KeyboardAvoidingView>
                <View style={{ marginTop: 100, justifyContent: "center", alignItems: "center" }}>
                    <Text
                        style={{
                            color: "#4A55A2",
                            fontSize: 17,
                            fontWeight: "600",
                        }}
                    >
                        Register
                    </Text>
                    <Text
                        style={{
                            // color: "#4A55A2",
                            fontSize: 17,
                            fontWeight: "600",
                            marginTop: 15,
                        }}
                    >
                        Register To Your Account
                    </Text>
                </View>

                <View style={{ marginTop: 50 }}>
                    <View>
                        <Text style={{
                            fontSize: 18, fontWeight: "600", color: "gray"
                        }}>Name</Text>
                        <TextInput
                            style={{
                                fontSize: name ? 18 : 16,
                                borderBottomColor: "gray",
                                borderBottomWidth: 1,
                                marginVertical: 10,
                                width: 300,
                            }}
                            type="text"
                            onChangeText={(text) => setName(text)}
                            value={name}
                            placeholder='Enter Your Name'
                            placeholderTextColor={'black'}
                        />
                    </View>

                    <View>
                        <Text style={{
                            fontSize: 18, fontWeight: "600", color: "gray"
                        }}>Email</Text>
                        <TextInput
                            style={{
                                fontSize: email ? 18 : 16,
                                borderBottomColor: "gray",
                                borderBottomWidth: 1,
                                marginVertical: 10,
                                width: 300,
                            }}
                            type="email"
                            onChangeText={(text) => setEmail(text)}
                            value={email}
                            placeholder='Enter Your Email'
                            placeholderTextColor={'black'}
                        />
                    </View>

                    <View
                        style={{
                            marginTop: 10,
                        }}
                    >
                        <Text style={{
                            fontSize: 18, fontWeight: "600", color: "gray"
                        }}>Password</Text>
                        <TextInput
                            style={{
                                fontSize: password ? 18 : 16,
                                borderBottomColor: "gray",
                                borderBottomWidth: 1,
                                marginVertical: 10,
                                width: 300,
                            }}
                            type="password"
                            secureTextEntry={true}
                            onChangeText={(text) => setPassword(text)}
                            value={password}
                            placeholder='Enter Your Password'
                            placeholderTextColor={'black'}
                        />
                    </View>

                    <View>
                        <Text style={{
                            fontSize: 18, fontWeight: "600", color: "gray"
                        }}>Image</Text>
                        <TextInput
                            style={{
                                fontSize: image ? 18 : 16,
                                borderBottomColor: "gray",
                                borderBottomWidth: 1,
                                marginVertical: 10,
                                width: 300,
                            }}
                            // type="email"
                            onChangeText={(text) => setImage(text)}
                            value={image}
                            placeholder='Image'
                            placeholderTextColor={'black'}
                        />
                    </View>

                    <Pressable
                        onPress={handleRegister}
                        style={{
                            width: 200,
                            backgroundColor: "#4A55A2",
                            padding: 15,
                            marginTop: 50,
                            marginLeft: "auto",
                            marginRight: "auto",
                            borderRadius: 6,
                        }}
                    >
                        <Text
                            style={{
                                color: "white",
                                fontWeight: "bold",
                                fontSize: 16,
                                textAlign: "center"
                            }}
                        >
                            Register
                        </Text>
                    </Pressable>

                    <Pressable
                        style={{
                            marginTop: 15,
                        }}
                        onPress={() => navigation.goBack()}
                    >
                        <Text
                            style={{
                                textAlign: "center",
                                color: "gray",
                                fontSize: 15,
                            }}
                        >
                            Alredy have an account? Sign In
                        </Text>
                    </Pressable>

                </View>

            </KeyboardAvoidingView>
        </View>
    )
}

export default RegisterScreen