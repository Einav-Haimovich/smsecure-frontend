// app/MessageScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import MessageItem from '../../components/MessageItem';

type Message = {
  id: string;
  score: number;
  content: string;
  sender: string;
  time: string;
};

export default function MessageScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fakeMessages = [
    {
      message: 'שלום Shir, RS113652 משלוח...',
      phone: 'דואר ישראל',
      time: '14:31',
    },
    {
      message: 'בשביל הקלות בזכויות...',
      phone: '052-0000000',
      time: '00:30',
    },
    {
      message: 'החבילה שלך מחכה, לחץ כאן...',
      phone: 'Bit',
      time: '17:32',
    },
  ];

  const fetchMessages = async () => {
    try {
      const payload = {
        messages: fakeMessages.map((m) => ({
          content: m.message,
          sender: m.phone,
          time: m.time,
        })),
      };

      const response = await fetch("http://localhost:8000/messages/bulk/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
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
            message={item.content}
            phone={item.sender}
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