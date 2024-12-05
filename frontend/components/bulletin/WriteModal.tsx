import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

interface WriteModalProps {
  isVisible: boolean;
  text: string;
  pin_id: string;
  setText: (value: string) => void;
  onClose: () => void;
  onPin: (imageUri?: string) => void; 
}

const WriteModal: React.FC<WriteModalProps> = ({
  isVisible,
  text,
  pin_id,
  setText,
  onClose,
  onPin,
}) => {
  const [imageUri, setImageUri] = useState<string | undefined>(undefined); 
  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    // console.log('ImagePicker Result:', result); // Debugging the result

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;

      // check if the selected image is a .heic file
      if (uri.toLowerCase().endsWith('.heic')) {
        // console.log('HEIC files are not supported. Please select a different image.');
        alert('HEIC files are not supported. Please select a different image.');
        return;
      }

      setImageUri(uri);
      console.log('Image URI:', uri);
      let URL;
      try{
          console.log('Uploading Image...');
          const response = await fetch(uri);
          const blob = await response.blob();
          const storageRef = firebase.storage().ref();
          const path = `images/${pin_id}_${new Date().getTime()}_${uri.split('/').pop()}`;
          const upload = storageRef.child(path);
          await upload.put(blob);
          await upload.getDownloadURL().then((url: any) => {
              URL = url;
          });
          console.log('URL:', URL);
          return URL;
      }catch(e){
         throw e;
      }
    }
  };
  

  const handlePin = () => {
    // console.log('Pinning Text:', text);
    // console.log('Pinning Image URI:', imageUri); 
    onPin(imageUri);
    setImageUri(undefined);
    setText('');
    onClose();
  };

  const handleOutsidePress = () => {
    if (Keyboard.isVisible()) {
      Keyboard.dismiss(); 
    } else {
      onClose();
    }
  };


  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={handleOutsidePress}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 items-center justify-center bg-black/50"
        >
          <View
            onStartShouldSetResponder={() => true}
            className="w-[320px] h-[450px] bg-[#BFBFEE] rounded-2xl p-4 border border-2 border-dashed border-[#7A67CE] shadow-lg"
          >
            {/* Text Input Box */}
            <TextInput
              style={{
                flex: 1,
                backgroundColor: 'rgba(61, 0, 184, 0.03)',
                color: '#7A67CE',
                borderRadius: 10,
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderWidth: 1,
                borderColor: 'rgba(0, 0, 0, 0.1)',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1.19 },
                shadowOpacity: 0.1,
                shadowRadius: 2.975,
                elevation: 3,
                maxHeight: 380,
              }}
              placeholder="Type here"
              placeholderTextColor="#7A67CE"
              maxLength={200}
              multiline={true}
              value={text}
              onChangeText={setText}
            />

            {/* Character Count */}
            <Text className="text-xs text-[#3D00B86E] mt-2">
              {`${text.length}/200 characters`}
            </Text>

            {/* Selected Image Preview */}
            {imageUri && (
              <View className="mt-2">
                <Image
                  source={{ uri: imageUri }}
                  className="w-20 h-20 rounded-md"
                  style={{ resizeMode: 'cover' }}
                />
              </View>
            )}

            {/* Image Upload Icon */}
            <TouchableOpacity
              onPress={handleImagePick}
              className="absolute bottom-20 right-8 w-15 h-15 rounded-full items-center justify-center"
            >
              <Image
                source={require('../../assets/images/camera.png')}
                className="w-10 h-8"
              />
            </TouchableOpacity>

            {/* Pin Button */}
            <TouchableOpacity
              onPress={handlePin}
              className="absolute bottom-4 right-4 bg-[#3D00B8] py-1 px-4 rounded-lg"
            >
              <Text className="text-white text-sm">Pin</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default WriteModal;
