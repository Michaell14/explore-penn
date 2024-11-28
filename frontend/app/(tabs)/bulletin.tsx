import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const BulletinStack = (navigation: { goBack: () => void; }) => {
    const router = useRouter();

    const handleClose = () => {
        router.push('/(tabs)');
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
            <View className="flex justify-center items-center w-[370px] h-[620px] bg-[#BFBFEE] rounded-lg border border-gray-300 p-4 overflow-hidden">

                {/* Inner View */}
                <View className="w-[350px] h-[600px] bg-[#F2F3FD] rounded-lg border border-gray-300 p-4 relative">
                    {/* Rounded Rectangle at top for visual indent FINALLY DIS BISH WORKS HOLY SHART */}
                    <View className="absolute -top-8 left-0 right-0 items-center">
                        <View className="w-[300px] h-[40px] bg-[#BFBFEE] opacity-100 rounded-full" />
                    </View>

                    {/* Title Section */}
                    <View className="flex-row justify-between border-b border-gray-300 pb-2 py-4 mb-4">
                        <Text className="text-lg font-bold text-[#535353]">Talk with Ben Franklin</Text>
                        <View className="flex items-center justify-center">
                            <View className="px-3 py-1 bg-[#EF6A56] rounded-full">
                                <Text className="text-white text-xs">4:00 PM</Text>
                            </View>
                        </View>

                    </View>

                    {/* Content */}
                    <Text className="text-xs text-[#373737] mb-4">
                        Come to the Ben Franklin statue to speak with UPenn founder Ben Franklin!
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
                    <View className="absolute bottom-12 left-0 right-0 items-center">
                        <Image
                            source={require('../../assets/images/swipeup.png')}
                            className="w-6 h-6 mb-2"
                        />
                        <Text className="text-xs text-[#808080]">Swipe Up To Write</Text>
                    </View>

                    {/* Yellow Component for swipeup */}
                    <View className="absolute bottom-0 left-20 right-20 h-12 bg-[#FFCC26] rounded-t-lg items-center justify-center">
                        <View className="w-40 mt-1 h-1 bg-customBlack opacity-60 rounded-full" />
                        <View className="w-40 mt-1 h-1 bg-customBlack opacity-60 rounded-full" />
                    </View>
                </View>
            </View>
        </View>
    );
};

export default BulletinStack;
