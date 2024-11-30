import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { styled } from 'tailwindcss-react-native';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

const CenterModal = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [text, setText] = useState('');

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <StyledView className="flex-1 items-center justify-center bg-[#D9D9FF]">
      {/* Button to open the modal */}
      <StyledTouchableOpacity
        onPress={toggleModal}
        className="bg-purple-600 py-2 px-4 rounded-lg"
      >
        <StyledText className="text-white font-bold">Open Modal</StyledText>
      </StyledTouchableOpacity>

      {/* Modal Component */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <StyledView className="flex-1 items-center justify-center bg-black/50">
          <StyledView className="w-[320px] h-[400px] bg-[#BFBFEE] rounded-2xl p-4">
            {/* Text Input Box */}
            <StyledTextInput
              className="flex-1 bg-[#F2F3FD] text-[#7A67CE] rounded-lg px-4 py-3 text-base"
              placeholder="Type here"
              placeholderTextColor="#B5A8D6"
              maxLength={200}
              multiline={true}
              value={text}
              onChangeText={(val) => setText(val)}
            />

            {/* Character Count */}
            <StyledText className="text-xs text-gray-500 mt-2">
              {`${text.length}/200 characters`}
            </StyledText>

            {/* Image Upload Icon */}
            <StyledView className="absolute bottom-20 right-8 bg-[#D9D9FF] w-10 h-10 rounded-full items-center justify-center">
              <StyledText className="text-purple-600 text-xl">📷</StyledText>
            </StyledView>

            {/* Pin Button */}
            <StyledTouchableOpacity
              className="absolute bottom-4 right-4 bg-purple-600 py-2 px-6 rounded-md"
              onPress={toggleModal}
            >
              <StyledText className="text-white font-bold">Pin</StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>
      </Modal>
    </StyledView>
  );
};

export default CenterModal;
