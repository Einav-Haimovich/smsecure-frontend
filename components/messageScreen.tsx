// app/MessageScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, ActivityIndicator, StyleSheet } from 'react-native';

type Message = {
  score: number;
  message: string;
  phone: string;
  time: string;
};

export default function MessageScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated fetch until backend is ready
    const fetchMessages = async () => {
      // Simulated response from backend
      const fakeData: Message[] = [
        { score: 99, message: 'שלום Shir, RS113652 משלוח...', phone: 'דואר ישראל', time: '14:31' },
        { score: 28, message: 'בשביל הקלות בזכויות...', phone: '052-0000000', time: '00:30' },
        { score: 94, message: 'יש לשלם 50 ש"ח בלינק הבא...', phone: '052-2323233', time: '13:20' },
      ];
      setMessages(fakeData);
      setLoading(false);
    };

    fetchMessages();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.messageItem}>
            <Text>{item.phone}</Text>
            <Text>{item.message}</Text>
            <Text>{item.score}% - {item.time}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  messageItem: {
    backgroundColor: '#eee',
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
  },
});
