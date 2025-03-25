// app/MessageScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import MessageItem from '../components/MessageItem';

type Message = {
  id: string; // מזהה ייחודי
  score: number;
  message: string;
  phone: string;
  time: string;
};

export default function MessageScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      const fakeData: Message[] = [
        {
          id: '1',
          score: 99,
          message: 'שלום Shir, RS113652 משלוח...',
          phone: 'דואר ישראל',
          time: '14:31',
        },
        {
          id: '2',
          score: 48,
          message: 'בשביל הקלות בזכויות...',
          phone: '052-0000000',
          time: '00:30',
        },
        {
          id: '3',
          score: 10,
          message: 'החבילה שלך מחכה, לחץ כאן...',
          phone: 'Bit',
          time: '17:32',
        },
      ];
      setMessages(fakeData);
      setLoading(false);
    };

    fetchMessages();
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MessageItem
            id={item.id}
            score={item.score}
            message={item.message}
            phone={item.phone}
            time={item.time}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
});