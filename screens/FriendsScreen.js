import { View, Text } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { UserType } from '../UserContext';
import FriendRequests from '../components/FriendRequests';

const FriendsScreen = () => {
    const { userId, setUserId } = useContext(UserType);
    const [friendRequests, setFriendRequests] = useState([]);

    useEffect(() => {
        fetchFriendRequests();
    }, []);

    const fetchFriendRequests = async () => {
        try {
            const response = await axios.get(
                `http://10.0.2.2:8000/friend-request/${userId}`
            );
            if (response.status === 200) {
                const friendRequestsData = response.data.map(friendRequest => ({
                    _id: friendRequest._id,
                    name: friendRequest.name,
                    email: friendRequest.email,
                    image: friendRequest.image,
                }));

                setFriendRequests(friendRequestsData);
            }
        } catch (error) {
            console.log("Error requesting friends requests", error)
        }
    }

    // console.log("friendRequests", friendRequests)

    return (
        <View style={{ padding: 10, marginHorizontal: 12 }}>
            {
                friendRequests.length > 0 && <Text>Your Friend Requests</Text>
            }
            {
                friendRequests.map((item, index) => (
                    <FriendRequests 
                        key={index} 
                        item={item} 
                        friendRequests={friendRequests} 
                        setFriendRequests={setFriendRequests} 
                    />
                ))
            }
        </View>
    )
}

export default FriendsScreen