import { View, Text, Pressable, Image } from 'react-native'
import React, { useContext, useState } from 'react'
import { UserType } from '../UserContext';

const Users = ({ item }) => {
  const {userId, setUserId} = useContext(UserType);
  const [requestSent, setRequestSent] = useState(false);

  const sendFriendRequest = async (currentUserId, selectedUserId)=>{
    try {
      const response = fetch("http://10.0.2.2:8000/friend-request", {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({currentUserId, selectedUserId})
      });

      if(response.ok){
        setRequestSent(true);
      }

    } catch (error) {
      console.log("Error sending friend request", error);
    }
  }

  return (
    <Pressable
        style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 10,
        }}
    >
      <View>
        <Image 
            source={{ uri: item?.image }}
            style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                resizeMode: "cover",
            }}
        />
      </View>
      <View 
        style={{
            marginLeft: 12,
            flex: 1,
        }}
      >
        <Text style={{ fontWeight: "bold", }}>{item?.name}</Text>
        <Text style={{ marginTop: 4, color: "gray", }}>{item?.email}</Text>
      </View>

      <Pressable
        style={{
            backgroundColor: "#567189",
            padding: 10,
            borderRadius: 6,
            width: 105,
        }}
        onPress={()=>sendFriendRequest(userId, item._id)}
      >
        <Text
            style={{
                textAlign: "center",
                color: "white",
                fontSize: 13,
            }}
        >Add friend</Text>
      </Pressable>
    </Pressable>
  )
}

export default Users