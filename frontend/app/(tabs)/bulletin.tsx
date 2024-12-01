import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import WriteModal from '../../components/WriteModal';
import StickyNote from '../../components/StickyNote';

const BulletinStack = () => {
    const router = useRouter();
    const [isModalVisible, setModalVisible] = useState(false);
    const [text, setText] = useState('');
    const [pinnedTexts, setPinnedTexts] = useState<{ id: string; text: string; color: string }[]>([]); // Array of pins with colors

    // Predefined colors
    const colors = ['#FFB3DE', '#9FE5A9', '#FFCC26', '#D9D9FF', '#87CEEB'];

    const handleClose = () => {
        router.push('/(tabs)');
    };

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const handlePin = () => {
        if (text.trim() !== '') {
            const randomColor = colors[Math.floor(Math.random() * colors.length)]; // Pick a random color
            setPinnedTexts((prev) => [
                ...prev,
                { id: `${Date.now()}`, text, color: randomColor }, // Add new pin with random color
            ]);
            setText(''); // Clear the input field
            setModalVisible(false); // Close the modal
        }
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

                    {/* Dotted Background */}
                    <View className="absolute inset-0 top-24">
                        {Array.from({ length: 40 }).map((_, rowIndex) => (
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

                    {/* Sticky Notes Container */}
                    <View
                        className="absolute inset-0 mt-12 p-4 pt-16 flex-wrap flex-row"
                        style={{
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            gap: 16, // Adds space between sticky notes
                        }}
                    >
                        {pinnedTexts.map((pin) => (
                            <StickyNote key={pin.id} text={pin.text} color={pin.color} />
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

            {/* WriteModal Component */}
            <WriteModal
                isVisible={isModalVisible}
                text={text}
                setText={setText}
                onClose={toggleModal}
                onPin={handlePin}
            />
        </View>
    );
};

export default BulletinStack;
