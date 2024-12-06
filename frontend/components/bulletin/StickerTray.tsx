import React from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';

const stickers = [
    require('../../assets/images/sticker1.png'),
    require('../../assets/images/sticker2.png'),
    require('../../assets/images/sticker3.png'),
    require('../../assets/images/sticker4.png'),
    require('../../assets/images/sticker5.png'),
    require('../../assets/images/sticker6.png'),
    require('../../assets/images/sticker7.png'),
];

interface StickerTrayProps {
    onAddSticker: (uri: string) => void;
}

const StickerTray: React.FC<StickerTrayProps> = ({ onAddSticker }) => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {stickers.map((sticker, index) => (
                <TouchableOpacity key={index} onPress={() => onAddSticker(stickers[index])} style={{ marginRight: 10 }}>
                    <Image
                        source={stickers[index]}
                        style={{
                            width: 50,
                            height: 50,
                            objectFit: 'contain',
                        }}
                    />
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default StickerTray;
