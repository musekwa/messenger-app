import { View, Text, Pressable, Image } from 'react-native'
import React, { useContext } from 'react'
import { UserType } from '../UserContext'
import { useNavigation } from '@react-navigation/native'

const FriendRequests = ({ item, friendRequests, setFriendRequests }) => {
    const navigation = useNavigation();
    const { userId, setUserId } = useContext(UserType);
    const acceptRequest = async (friendRequestId) => {
        try {
            const response = await fetch("http://10.0.2.2:8000/friend-request/accept", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    senderId: friendRequestId,
                    recipientId: userId,
                })
            })
            if (response.ok){
                setFriendRequests(friendRequests.filter((request)=>request._id !== friendRequestId));
                navigation.navigate("Chats");
            }
            
        } catch (error) {
            console.log("Error accepting the friend request.")
        }
    }
    return (
        <Pressable
            style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginVertical: 10,
            }}
        >
            <Image
                source={{ uri: item.image }}
                style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                }}
            />
            <Text style={{
                fontSize: 15,
                fontWeight: "bold",
                marginLeft: 10,
                flex: 1,
            }}>
                {item.name} sent you a friend request
            </Text>
            <Pressable
                onPress={() => acceptRequest(item._id)}
                style={{
                    backgroundColor: "#0066b2",
                    padding: 10,
                    borderRadius: 6
                }}
            >
                <Text
                    style={{ textAlign: "center", color: "white" }}
                >Accept</Text>
            </Pressable>
        </Pressable>
    )
}

export default FriendRequests