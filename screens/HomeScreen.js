import { View, Text } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { UserType } from '../UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import { jwtDecode } from 'jwt-decode';
// For the jwt-decode (jwtDecode) to decode the token
import { decode } from "base-64";
import Users from '../components/Users';
global.atob = decode;



const HomeScreen = () => {
  const { userId, setUserId } = useContext(UserType);
  const [users, setUsers] = useState([]);
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <Text style={{ fontSize: 16, fontWeight: "bold", }}>Swift Chat</Text>
      ),
      headerRight: () => (
        <View style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        }}>
          <Ionicons onPress={() => navigation.navigate("Chats")} name="chatbox-ellipses-outline" size={24} color="black" />
          <MaterialIcons onPress={() => navigation.navigate("Friends")} name="people-outline" size={24} color="black" />
        </View>
      )
    })
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decoded = jwtDecode(token);

      const userId = decoded.userId;
      setUserId(userId);
      axios.get(`http://10.0.2.2:8000/users/${userId}`)
        .then((response) => {
          setUsers(response.data);
        })
        .catch((err) => {
          console.log("Error retrieving users", err)
        })
    };

    fetchUsers();

  }, []);


  return (
    <View>
      <View
        style={{
          padding: 10,

        }}
      >
        {
          users.map((item, index) => (
            <Users key={index} item={item} />
          ))
        }
      </View>
    </View>
  )
}

export default HomeScreen
