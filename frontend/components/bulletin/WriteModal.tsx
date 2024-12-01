import React from 'react';
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

interface WriteModalProps {
  isVisible: boolean;
  text: string;
  setText: (value: string) => void;
  onClose: () => void;
  onPin: () => void;
}

const WriteModal: React.FC<WriteModalProps> = ({
  isVisible,
  text,
  setText,
  onClose,
  onPin,
}) => {
  // Helper function to handle dismissing keyboard or closing modal
  const handleOutsidePress = () => {
    if (Keyboard.isVisible()) {
      Keyboard.dismiss(); // Only dismiss the keyboard if it's visible
    } else {
      onClose(); // Close the modal if the keyboard is not visible
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      {/* Detect touch outside the modal */}
      <TouchableWithoutFeedback onPress={handleOutsidePress}>
        <View className="flex-1 bg-black/50">
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 items-center justify-center"
          >
            {/* Modal content */}
            <View
              onStartShouldSetResponder={() => true} // Prevent touches inside the modal from closing it
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

              {/* Image Upload Icon */}
              <View className="absolute bottom-20 right-8 w-15 h-15 rounded-full items-center justify-center">
                <Image
                  source={require('../../assets/images/camera.png')}
                  className="w-10 h-8"
                />
              </View>

              {/* Pin Button */}
              <TouchableOpacity
                onPress={onPin}
                className="absolute bottom-4 right-4 bg-[#3D00B8] py-1 px-4 rounded-lg"
              >
                <Text className="text-white text-sm">Pin</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default WriteModal;