import React from 'react';
import { View, Text, Image } from 'react-native';

const BulletinStack = () => {
    return (
        <View className="flex-1 justify-center items-center bg-[#D9D9FF]">
            {/* Outer View */}
            <View className="flex justify-center items-center w-[370px] h-[620px] bg-[#BFBFEE] rounded-lg border border-gray-300 p-4">
                {/* Inner View */}
                <View className="w-[350px] h-[600px] bg-[#F2F3FD] rounded-lg border border-gray-300 p-4 relative">
                    {/* Title Section */}
                    <View className="flex-row justify-between border-b border-gray-300 pb-2 mb-4">
                        <Text className="text-lg font-sf font-bold text-[#535353]">Talk with Ben Franklin</Text>
                        <Text className="text-sm text-orange-500 font-medium">4:00 PM</Text>
                    </View>

                    {/* Content */}
                    <Text className="text-xs font-sf  text-[#373737] mb-4">
                        Come to the Ben Franklin statue to speak with UPenn founder Ben Franklin!
                    </Text>

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
                    <View className="absolute bottom-16 left-0 right-0 items-center">
                        <Image
                            source={require('../../assets/images/swipeup.png')}
                            className="w-6 h-6 mb-2"
                        />
                        <Text className="text-sm font-sf text-[#808080]">Swipe Up To Write</Text>
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
