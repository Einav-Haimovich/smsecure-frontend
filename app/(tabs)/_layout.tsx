import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
      <Tabs>
        <Tabs.Screen
            name="index"
            options={{
              title: 'Messages',
              tabBarIcon: ({ color, size }) => (
                  <Ionicons name="chatbubbles" size={size} color={color} />
              ),
            }}
        />
        <Tabs.Screen
            name="drafts"
            options={{
              title: 'Drafts',
              tabBarIcon: ({ color, size }) => (
                  <Ionicons name="document-text" size={size} color={color} />
              ),
            }}
        />
        <Tabs.Screen
            name="retriever"
            options={{
              title: 'Retriever',
              tabBarIcon: ({ color, size }) => (
                  <Ionicons name="search" size={size} color={color} />
              ),
            }}
        />
      </Tabs>
  );
}