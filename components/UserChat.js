import { View, Text, Pressable, Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

const UserChat = ({ item }) => {
    const navigation = useNavigation();

    return (
        <Pressable
            onPress={() => navigation.navigate("Messages", {
                recipientId: item._id,
            })}
            style={{
                flexDirection: "row", alignItems: "center", gap: 10, borderWidth: 0.7, borderColor: "#D0D0D0",
                borderTopWidth: 0,
                borderLeftWidth: 0,
                borderRightWidth: 0,
                padding: 10,

            }}
        >
            <Image
                source={{ uri: item.image }}
                style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    resizeMode: "cover",
                }}
            />
            <View
                style={{
                    flex: 1,
                }}
            >
                <Text
                    style={{
                        fontSize: 15,
                        fontWeight: "500",
                    }}
                >{item.name}</Text>
                <Text
                    style={{
                        marginTop: 5,
                        color: "gray",
                        fontWeight: "500"
                    }}
                >last message comes here</Text>
            </View>
            <View>
                <Text
                    style={{
                        fontSize: 11,
                        fontWeight: "400",
                        color: "#585858"
                    }}
                >
                    3:00 pm
                </Text>
            </View>
        </Pressable>
    )
}

export default UserChat