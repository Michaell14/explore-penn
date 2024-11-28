import React from 'react';
import { View, Text } from 'react-native';

const BulletinStack = () => {
    return (
        <View className="flex-1 justify-center items-center bg-[#D9D9FF]">
            {/* Outer View */}
            <View className="flex justify-center items-center w-[370px] h-[620px] bg-[#BFBFEE] rounded-lg border border-gray-300 p-4">
                {/* Inner View */}
                <View className="w-[350px] h-[600px] bg-[#F2F3FD] rounded-lg border border-gray-300 p-4 relative">
                    {/* Title Section */}
                    <View className="flex-row justify-between border-b border-gray-300 pb-2 mb-4">
                        <Text className="text-lg font-bold text-gray-800">Talk with Ben Franklin</Text>
                        <Text className="text-sm text-orange-500 font-medium">4:00 PM</Text>
                    </View>

                    {/* Content */}
                    <Text className="text-xs text-[#373737] mb-4">
                        Come to the Ben Franklin statue to speak with UPenn founder Ben Franklin!
                    </Text>

                    {/* Dotted Background */}
                    <View className="flex-1 mt-2">
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
                </View>
            </View>
        </View>
    );
};

export default BulletinStack;
