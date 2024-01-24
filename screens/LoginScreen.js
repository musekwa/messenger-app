import { View, Text, KeyboardAvoidingView, TextInput, Pressable, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigation = useNavigation();

    const handleLogIn = ()=>{
        const user = {
            email, password,
        }
        axios.post("http://10.0.2.2:8000/login", user)
            .then((response)=>{
                console.log(response);
                const token = response.data.token;
                AsyncStorage.setItem("authToken", token);
                navigation.replace("Home");
            })
            .catch((err)=>{
                console.log("Login Error", err);
                Alert.alert(
                    "Login Error",
                    "Invalid email or password"
                );
            })
    }

    useEffect(()=>{
        const checkLoginStatus = async ()=>{
            try {
                const token = await AsyncStorage.getItem("authToken");
                console.log("token", token);
                if (token){
                    navigation.navigate("Home")
                }
                else {
                    // token not found, show the login screen 
                }
            }
            catch(err){
                console.log("Error", err);
            }
        }

        checkLoginStatus();
    }, [ ]);


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
                        Sing In
                    </Text>
                    <Text
                        style={{
                            // color: "#4A55A2",
                            fontSize: 17,
                            fontWeight: "600",
                            marginTop: 15,
                        }}
                    >
                        Sign In To Your Account
                    </Text>
                </View>

                <View style={{ marginTop: 50 }}>
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
                            onChangeText={(text)=>setEmail(text)}
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
                            onChangeText={(text)=>setPassword(text)}
                            value={password}
                            placeholder='Enter Your Password'
                            placeholderTextColor={'black'}
                        />
                    </View>

                    <Pressable 
                    onPress={handleLogIn}
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
                        >Login</Text>
                    </Pressable>

                    <Pressable
                        style={{
                            marginTop: 15, 
                        }}
                        onPress={()=>navigation.navigate("Register")}
                    >
                        <Text
                            style={{
                                textAlign: "center",
                                color: "gray",
                                fontSize: 15,
                            }}
                        >
                            Don't have an account? Sign Up
                        </Text>
                    </Pressable>

                </View>

            </KeyboardAvoidingView>
        </View>
    )
}

export default LoginScreen