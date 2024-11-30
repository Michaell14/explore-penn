import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, TextInput } from 'react-native';
import { useRouter } from 'expo-router';

const BulletinStack = (navigation: { goBack: () => void }) => {
    const router = useRouter();
    const [isModalVisible, setModalVisible] = useState(false);
    const [text, setText] = useState('');
    const [pinnedText, setPinnedText] = useState('');

    const handleClose = () => {
        router.push('/(tabs)');
    };

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    // const closeModal = () => {
    //     setModalVisible(false);
    // };

    const handlePin = () => {
        setPinnedText(text); // Set the pinned text
        setText(''); // Clear the input field
        setModalVisible(false); // Close the modal
    };

    return (
        <View className="flex-1 justify-center items-center bg-[#D9D9FF]">
            {/* X Button in Top Right Corner */}
            <TouchableOpacity
                onPress={handleClose}
                className="absolute top-16 right-4"
            >
                <Image
                    source={require('../../assets/images/xout.png')}
                    className="w-12 h-12"
                />
            </TouchableOpacity>

            {/* Outer View */}
            <View className="flex justify-center items-center w-[390px] h-[620px] bg-[#BFBFEE] rounded-lg p-4 overflow-hidden">
                {/* Inner View */}
                <View className="w-[370px] h-[600px] bg-[#F2F3FD] rounded-lg p-4 relative">
                    {/* Rounded Rectangle */}
                    <View className="absolute -top-8 left-0 right-0 items-center">
                        <View className="w-[300px] h-[40px] bg-[#BFBFEE] opacity-100 rounded-full" />
                    </View>

                    {/* Title Section */}
                    <View className="flex-row justify-between border-b border-gray-300 pb-2 py-4 mb-4">
                        <Text className="text-lg font-bold text-[#535353]">
                            Talk with Ben Franklin
                        </Text>
                        <View className="flex items-center justify-center">
                            <View className="px-3 py-1 bg-[#EF6A56] rounded-full">
                                <Text className="text-white text-xs">4:00 PM</Text>
                            </View>
                        </View>
                    </View>

                    {/* Content */}
                    <Text className="text-xs text-[#373737] mb-4">
                        Come to the Ben Franklin statue to speak with UPenn founder Ben
                        Franklin!
                    </Text>

                    {/* Corner Dots */}
                    <Image
                        source={require('../../assets/images/bulletincircle.png')}
                        className="absolute top-2 left-2 w-2 h-2"
                    />
                    <Image
                        source={require('../../assets/images/bulletincircle.png')}
                        className="absolute top-2 right-2 w-2 h-2"
                    />
                    <Image
                        source={require('../../assets/images/bulletincircle.png')}
                        className="absolute bottom-2 left-2 w-2 h-2"
                    />
                    <Image
                        source={require('../../assets/images/bulletincircle.png')}
                        className="absolute bottom-2 right-2 w-2 h-2"
                    />

                    {/* Pinned Text Display */}
                    {pinnedText ? (
                        <View className="mb-4 p-3 bg-green-500 rounded-md">
                            <Text className="text-white text-sm">{pinnedText}</Text>
                        </View>
                    ) : null}

                    {/* Dotted Background */}
                    <View className="flex-1 mt-2">
                        {Array.from({ length: 35 }).map((_, rowIndex) => (
                            <View key={rowIndex} className="flex-row justify-center">
                                {Array.from({ length: 18 }).map((_, colIndex) => (
                                    <View
                                        key={colIndex}
                                        className="w-1 h-1 bg-gray-300 rounded-full mx-2 my-1"
                                    />
                                ))}
                            </View>
                        ))}
                    </View>

                    {/* Swipe Up Section */}
                    <TouchableOpacity
                        onPress={toggleModal}
                        className="absolute bottom-12 left-0 right-0 items-center"
                    >
                        <Image
                            source={require('../../assets/images/swipeup.png')}
                            className="w-6 h-6 mb-2"
                        />
                        <Text className="text-xs text-[#808080]">Swipe Up To Write</Text>
                    </TouchableOpacity>

                    {/* Yellow Component for swipeup */}
                    <View className="absolute bottom-0 left-20 right-20 h-12 bg-[#FFCC26] rounded-t-lg items-center justify-center">
                        <View className="w-40 mt-1 h-1 bg-customBlack opacity-60 rounded-full" />
                        <View className="w-40 mt-1 h-1 bg-customBlack opacity-60 rounded-full" />
                    </View>
                </View>
            </View>

            {/* Modal Component */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={toggleModal}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={toggleModal}
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
                            //className="flex-1 bg-[#3D00B805] text-[#7A67CE] placeholder-[#7A67CE] rounded-lg px-4 py-3 text-base border border-[rgba(0,0,0,0.1)] shadow-lg"
                            placeholder="Type here"
                            placeholderTextColor="#7A67CE"
                            maxLength={200}
                            multiline={true}
                            value={text}
                            onChangeText={(val) => setText(val)}
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
                            onPress={handlePin}
                            className="absolute bottom-4 right-4 bg-[#3D00B8] py-1 px-4 rounded-lg"
                        >
                            <Text className="text-white text-sm">Pin</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

export default BulletinStack;
