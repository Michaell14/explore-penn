// import React, { useState, useRef } from 'react';
// import { View, Text, TouchableOpacity, FlatList, Animated, Easing } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import ActivityLog from '../../components/ActivityLog';
// import { useFonts } from 'expo-font';

// interface TimelinePin {
//   date: string;
//   text: string;
// }

// const shinyPins: string[] = ['RAWRAWR RARARWR WMARMEOW MEOWMEOWMEKOW'];
// const timelinePins: TimelinePin[] = [
//   { date: 'Today', text: 'that someone was katherine....' },
//   { date: 'November 2nd', text: 'bruh i saw someone piss and shart on the bench in real time....' },
//   { date: 'October 31st', text: 'eric lee dressed up as a stussy playboy' },
// ];

// export default function MyPinsScreen() {
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [sortOption, setSortOption] = useState('Latest');
//   const dropdownAnim = useRef(new Animated.Value(0)).current;

//   const toggleDropdown = () => {
//     if (showDropdown) {
//       // Close animation
//       Animated.timing(dropdownAnim, {
//         toValue: 0,
//         duration: 300,
//         useNativeDriver: false,
//         easing: Easing.ease,
//       }).start(() => setShowDropdown(false));
//     } else {
//       // Open animation
//       setShowDropdown(true);
//       Animated.timing(dropdownAnim, {
//         toValue: 1,
//         duration: 300,
//         useNativeDriver: false,
//         easing: Easing.ease,
//       }).start();
//     }
//   };

//   const selectOption = (option: string) => {
//     setSortOption(option);
//     setShowDropdown(false);
//     // need to add sorting logic here later
//   };

//   const renderHeader = () => (
//     <>
//       {/* Header */}
//       <Text className="text-5xl font-bold text-[#ECEEF2] mb-6">My Pins</Text>

//       <LinearGradient
//         colors={['#8E2DE2', '#4A00E0']}
//         style={{ borderRadius: 12, padding: 16, marginBottom: 16 }}
//       >
//         <Text className="text-[#ECEEF2] text-lg font-semibold mb-3">Level 5</Text>
//         <View className="h-2 bg-gray-700 rounded-2xl my-3">
//           <View style={{ width: '50%', height: '100%', backgroundColor: '#CEF7A0', borderRadius: 15 }} />
//         </View>
//         <View className="flex-row justify-between mt-3">
//           <Text className="text-[#ECEEF2] text-sm">32 Pins</Text>
//           <Text className="text-[#ECEEF2] text-sm">200/400 XP</Text>
//         </View>
//       </LinearGradient>

//       <Text className="text-2xl text-[#ECEEF2] mb-4">My Silver Pins</Text>
//       {shinyPins.map((pin, index) => (
//         <LinearGradient
//           key={index}
//           colors={['#FFFFFF', '#ECEEF2', '#ABABAB', '#808080']}
//           start={{ x: 0.5, y: 0 }}
//           end={{ x: 0.5, y: 1 }}
//           style={{ borderRadius: 12, padding: 16, marginBottom: 0 }}
//         >
//           <Text className="text-black font-medium">{pin}</Text>
//         </LinearGradient>
//       ))}


//       <View className="flex-1 bg-[#1B1B1B] p-4">
//         {/* Main Dropdown Button */}
//         <TouchableOpacity
//           onPress={toggleDropdown}
//           className="bg-gray-600 rounded-xl py-2 px-6 self-start mt-6 mb-6"
//         >
//           <Text className="text-[#CEF7A0] text-xs font-medium text-center">
//             {sortOption}
//           </Text>
//         </TouchableOpacity>

//         {/* Expanded Dropdown Menu */}
//         {showDropdown && (
//           <Animated.View
//             style={{
//               opacity: dropdownAnim,
//               transform: [{ scaleY: dropdownAnim }],
//             }}
//             className="bg-gray-600 rounded-xl py-2 px-6 absolute top-20 left-4 z-15"
//           >
//             <TouchableOpacity onPress={() => selectOption('Latest')} className="py-1">
//               <Text className="text-[#CEF7A0] text-xs font-medium text-center">Latest</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => selectOption('Oldest')} className="py-1">
//               <Text className="text-[#CEF7A0] text-xs font-medium text-center">Oldest</Text>
//             </TouchableOpacity>
//           </Animated.View>
//         )}
//       </View>

//       {/* Activity Log
//       <ActivityLog activities={timelinePins} /> */}
//     </>
//   );

//   return (
//     //making entire background dark
//     <View style={{ flex: 1, backgroundColor: '#1B1B1B' }}>
//       <FlatList
//         data={timelinePins}
//         keyExtractor={(item, index) => index.toString()}
//         ListHeaderComponent={renderHeader}
//         renderItem={({ item }) => (
//           <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 24 }}>
//             {/* Timeline Dot and Line */}
//             <View style={{ alignItems: 'center', marginRight: 12 }}>
//               {/* Dot */}
//               <View
//                 style={{
//                   width: 8,
//                   height: 8,
//                   backgroundColor: '#CEF7A0',
//                   borderRadius: 4,
//                   marginBottom: 4,
//                 }}
//               />
//               {/* Line */}
//               <View
//                 style={{
//                   width: 2,
//                   flex: 1,
//                   backgroundColor: '#333',
//                 }}
//               />
//             </View>

//             {/* Content */}
//             <View style={{ flex: 1 }}>
//               <Text className="text-[#CEF7A0] text-base mb-2" style={{ marginTop: -10 }}>
//                 {item.date}
//               </Text>
//               <View className="bg-[#232323] bg-800 rounded-2xl p-6">
//                 <Text className="text-gray-300 text-sm">{item.text}</Text>
//               </View>
//             </View>
//           </View>
//         )}
//         contentContainerStyle={{ padding: 24, paddingTop: 72 }}
//       />
//     </View>

//   );
// }

