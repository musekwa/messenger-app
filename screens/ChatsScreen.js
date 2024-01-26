import { View, Text, ScrollView, Pressable } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { UserType } from "../UserContext";
import { useNavigation } from '@react-navigation/native';
import UserChat from '../components/UserChat';

const ChatsScreen = () => {
  const [acceptedFriends, setAcceptedFriends] = useState([]);
  const { userId, setUserId } = useContext(UserType);
  const navigation = useNavigation();

  useEffect(() => {
    const acceptedFriendsList = async () => {
      try {
        const response = await fetch(`http://10.0.2.2:8000/accepted-friends/${userId}`, {
          method: "GET",
        });
        const data = await response.json();
        if (response.ok) {
          setAcceptedFriends(data);
        }
      } catch (error) {
        console.log("Error showing accepted friends", error);
      }
    }

    acceptedFriendsList();

  }, []);

  return (
    <ScrollView showsVerticalScrollIndicator={false}
      style={{ flex: 1, }}
    >
      <Pressable>
        {
          acceptedFriends.map((item, index)=>(
            <UserChat key={index} item={item} />
          ))
        }
      </Pressable>
    </ScrollView>
  )
}

export default ChatsScreen