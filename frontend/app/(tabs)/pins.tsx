import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import ActivityLog from '../../components/ActivityLog';

interface TimelinePin {
  date: string;
  text: string;
}

const shinyPins: string[] = ['shiny pin that got really popular'];
const timelinePins: TimelinePin[] = [
  { date: 'Today', text: '“bruh the ben franklin statue has a yellow puddle next to it”' },
  { date: 'Month, Date', text: 'Some random thing that happened today.' },
];

const timelineItems = [
  { date: 'just now', text: '“bruh the ben franklin statue has a yellow puddle next to it”' },
  { date: '2 hours ago', text: 'Some random thing that happened today.' },
];

// Sample data for ActivityLog component
const activities = [
  {
    time: 'just now',
    userImage: 'https://via.placeholder.com/40', // Replace with actual image URL
    description: 'Bonnie moved Jese Leos to',
    group: 'Funny Group',
  },
  {
    time: '2 hours ago',
    userImage: 'https://via.placeholder.com/40',
    description: 'Thomas Lean commented on Flowbite Pro',
    comment: "Hi ya'll! I wanted to share a webinar zeroheight is having...",
  },
  {
    time: '1 day ago',
    userImage: 'https://via.placeholder.com/40',
    description: 'Jese Leos has changed Pricing page task status to',
    status: 'Finished',
  },
];

export default function MyPinsScreen() {
  const renderHeader = () => (
    <>
      {/* Header */}
      <Text className="text-2xl font-bold mb-6">My Pins</Text>

      <View className="bg-gray-300 rounded-lg p-6 mb-6">
        <Text className="text-lg font-semibold mb-3">Level XX</Text>
        <View className="h-2 bg-gray-400 rounded-full my-3">
          <View className="w-1/2 h-full bg-gray-600" />
        </View>
        <View className="flex-row justify-between mt-3">
          <Text className="text-sm text-gray-500">XX Pins</Text>
          <Text className="text-sm text-gray-500">XXXX/XXX XP</Text>
        </View>
      </View>

      <Text className="text-lg font-bold mb-4">My Silver Pins</Text>
      {shinyPins.map((pin, index) => (
        <View key={index} className="bg-gray-300 rounded-lg p-4 mb-4">
          <Text>{pin}</Text>
        </View>
      ))}

      <TouchableOpacity className="border border-black rounded-full py-2 px-5 mt-4 mb-6 self-start">
        <Text className="text-xs font-medium">No filter</Text>
      </TouchableOpacity>

      {/* Activity Log */}
      <ActivityLog activities={timelineItems} />
    </>
  );

  return (
    <FlatList
      data={timelinePins}
      keyExtractor={(item, index) => index.toString()}
      ListHeaderComponent={renderHeader}
      renderItem={({ item }) => (
        <View className="mb-6">
          <Text className="text-base font-bold mb-2">{item.date}</Text>
          <View className="bg-gray-300 rounded-lg p-4">
            <Text>{item.text}</Text>
          </View>
        </View>
      )}
      contentContainerStyle={{ padding: 24 }}
    />
  );
}
