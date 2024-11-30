import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue } from 'react-native-reanimated';
import { styled } from 'tailwindcss-react-native';

const StyledView = styled(View);

type Sticker = {
    id: number;
    uri: string;
};

const stickers: Sticker[] = [
    { id: 1, uri: 'https://example.com/sticker1.png' },
    { id: 2, uri: 'https://example.com/sticker2.png' },
    { id: 3, uri: 'https://example.com/sticker3.png' },
];

const StickerTray: React.FC<{
    onDragSticker: (sticker: Sticker) => ReturnType<typeof Gesture.Pan>;
}> = ({ onDragSticker }) => {
    return (
        <StyledView className="h-24 bg-gray-200 border-t border-gray-300 p-2">
            {stickers.map((sticker) => (
                <GestureDetector gesture={onDragSticker(sticker)} key={sticker.id}>
                    <Animated.View className="m-2 w-20 h-20 items-center justify-center">
                        <Image source={{ uri: sticker.uri }} className="w-16 h-16" />
                    </Animated.View>
                </GestureDetector>
            ))}
        </StyledView>
    );
};

const BulletinStack: React.FC = () => {
    const router = useRouter();
    const [boardStickers, setBoardStickers] = useState<
        { sticker: Sticker; x: number; y: number; id: string }[]
    >([]);

    const handleClose = () => {
        router.push('/(tabs)');
    };

    const addStickerToBoard = (sticker: Sticker, x: number, y: number) => {
        setBoardStickers((prev) => [
            ...prev,
            { sticker, x, y, id: `${sticker.id}-${Date.now()}` },
        ]);
    };

    const handleDragSticker = (sticker: Sticker) => {
        const translateX = useSharedValue(0);
        const translateY = useSharedValue(0);

        return Gesture.Pan()
            .onUpdate((event) => {
                translateX.value = event.translationX;
                translateY.value = event.translationY;
            })
            .onEnd(() => {
                addStickerToBoard(sticker, translateX.value + 150, translateY.value + 300); // Adjust positions as needed
            });
    };

    return (
        <GestureHandlerRootView className="flex-1">
            <View className="flex-1 justify-center items-center bg-[#D9D9FF]">
                {/* X Button in Top Right Corner */}
                <TouchableOpacity
                    onPress={handleClose}
                    className="absolute top-16 right-4"
                >
                    <Image
                        source={require('../assets/images/xout.png')}
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

                        {/* Render Stickers on the Board */}
                        {boardStickers.map(({ sticker, x, y, id }) => (
                            <Animated.Image
                                key={id}
                                source={{ uri: sticker.uri }}
                                style={[
                                    {
                                        position: 'absolute',
                                        left: x,
                                        top: y,
                                        width: 64,
                                        height: 64,
                                    },
                                ]}
                            />
                        ))}

                        {/* Corner Dots */}
                        <Image
                            source={require('../assets/images/bulletincircle.png')}
                            className="absolute top-2 left-2 w-2 h-2"
                        />
                        <Image
                            source={require('../assets/images/bulletincircle.png')}
                            className="absolute top-2 right-2 w-2 h-2"
                        />
                        <Image
                            source={require('../assets/images/bulletincircle.png')}
                            className="absolute bottom-2 left-2 w-2 h-2"
                        />
                        <Image
                            source={require('../assets/images/bulletincircle.png')}
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
                    </View>
                </View>
            </View>

            {/* Sticker Tray */}
            <StickerTray onDragSticker={handleDragSticker} />
        </GestureHandlerRootView>
    );
};

export default BulletinStack;
