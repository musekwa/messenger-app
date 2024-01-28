import { View, Text, KeyboardAvoidingView, ScrollView, TextInput, Pressable, Image } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { Entypo, Feather, Ionicons } from '@expo/vector-icons';
import EmojiSelector from 'react-native-emoji-selector';
import * as ImagePicker from "expo-image-picker";
import { UserType } from '../UserContext';
import { useNavigation, useRoute } from '@react-navigation/native';

const ChatMessagesScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { recipientId } = route.params;
  const { userId, setUserId } = useContext(UserType);
  const [showEmojiSelector, setShowEmojiSelector] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [recipientData, setRecipientData] = useState();

  const handleSend = async (messageType, imageUrl) => {
    try {
      const formData = new FormData();
      formData.append("senderId", userId);
      formData.append("recipientId", recipientId);

      // check if the messageType is an image or a normal text
      if (messageType === "image") {
        formData.append("messageType", "image");
        formData.append("imageFile", {
          uri: imageUrl,
          name: "image.jpg",
          type: "image/jpeg",
        });
      }
      else {
        formData.append("messageType", "text");
        formData.append("message", message);
      }
      const response = await fetch("http://10.0.2.2:8000/messages", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setMessage("");
        selectedImage("");
      }
    } catch (error) {
      console.log("Error in sending the message", error)
    }
  }



  const handleEmojiPress = () => {
    setShowEmojiSelector(!showEmojiSelector);
  }

  const fetchMessages = async () => {
    try {
      const response = await fetch(`http://10.0.2.2:8000/messages/${userId}/${recipientId}`);
      const data = await response.json();
      if (response.ok) {
        setMessages(data);
      }
      else {
        console.log("Error showing messages", response.status.message)
      }
    } catch (error) {
      console.log("Error fetching messages", error);
    }

  }

  useEffect(() => {
    fetchMessages();
  }, [message])

  useEffect(() => {
    const fetchRecipientData = async () => {
      try {
        const response = await fetch(`http:10.0.2.2:8000/user/${recipientId}`)
        const data = await response.json();
        setRecipientData(data);
      } catch (error) {
        console.log("Error fetching recipient details", error);
      }
    }

    fetchRecipientData();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Ionicons
            onPress={() => navigation.goBack()}
            name="arrow-back" size={24} color="black" />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Image
              source={{ uri: recipientData?.image }}
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                resizeMode: "cover",

              }}
            />
            <Text
              style={{
                marginLeft: 5,
                fontSize: 15,
                fontWeight: "bold",
              }}
            >{recipientData?.name}</Text>
          </View>
        </View>
      )

    })
  }, [recipientData]);

  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric", };
    return new Date(time).toLocaleString("en-US", options)
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }


  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#F0F0F0" }}>
      <ScrollView>
        {
          // all the chat messages go here
          messages.map((item, index) => {
            if (item.messageType === "text") {
              return (<Pressable key={index} style={[
                item?.senderId?._id === userId ?
                  {
                    alignSelf: "flex-end",
                    backgroundColor: "#DCF8C6",
                    padding: 8,
                    margin: 10,
                    maxWidth: "60%",
                    borderRadius: 7,
                  }
                  :
                  {
                    alignSelf: "flex-start",
                    backgroundColor: "white",
                    padding: 8,
                    margin: 10,
                    maxWidth: "60%",
                    borderRadius: 7,
                  }
              ]}>
                <Text
                  style={{
                    fontSize: 13,
                    textAlign: "left",
                  }}
                >{item.message}</Text>
                <Text
                  style={{
                    textAlign: "right",
                    fontSize: 9,
                    color: "gray",
                    marginTop: 5,

                  }}
                >{formatTime(item.timeStamp)}</Text>
              </Pressable>)
            }
          })

        }
      </ScrollView>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderTopWidth: 1,
          borderTopColor: "#dddddd",
          marginBottom: showEmojiSelector ? 0 : 25,
        }}
      >
        <Entypo
          onPress={handleEmojiPress}
          style={{
            marginRight: 5,
          }}
          name="emoji-happy" size={24} color="gray"
        />
        <TextInput
          onChangeText={(text) => setMessage(text)}
          value={message}
          style={{
            flex: 1,
            height: 40,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: "#dddddd",
            paddingHorizontal: 10,
          }}
          placeholder='Type your message'
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 7,
            marginHorizontal: 8,
          }}
        >
          <Entypo
            onPress={pickImage}
            style={{
              marginLeft: 5,
            }}
            name="camera" size={24} color="gray"
          />
          <Feather
            name="mic" size={24} color="gray"
          />

        </View>
        <Pressable
          onPress={() => handleSend("text")}
          style={{
            backgroundColor: "#007bff",
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 20,
          }}
        >
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
            }}
          >
            Send
          </Text>
        </Pressable>
      </View>
      {
        showEmojiSelector && <EmojiSelector
          style={{
            height: 250,
          }}
          onEmojiSelected={(emoji) => {
            setMessage(prev => prev + emoji)
          }}

        />
      }
    </KeyboardAvoidingView>
  )
}

export default ChatMessagesScreen