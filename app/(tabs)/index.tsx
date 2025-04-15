import React, { useEffect, useState } from 'react';
import MessageItem from '../../components/MessageItem';
import { useRouter } from 'expo-router';
import { View, FlatList, ActivityIndicator, StyleSheet, Button } from 'react-native';

type Message = {
  id: string;
  score: number;
  content: string;
  sender: string;
  time: string;
};

export default function MessageScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [drafts, setDrafts] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

      const response = await fetch("http://10.0.2.2:8000/messages/bulk/", {
        method: "POST",
        headers: {
          Accept: 'application/json',
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      const highRisk = data.filter((msg: Message) => msg.score >= 85);
      const normal = data.filter((msg: Message) => msg.score < 85);

      setDrafts(highRisk);
      setMessages(normal);
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
      <View style={styles.buttonContainer}>
        <Button
          title="Drafts"
          onPress={() =>
            router.push({
              pathname: "/(tabs)/drafts",
              params: { drafts: JSON.stringify(drafts) }, // מעביר את הדאטה
            })
          }
        />
      </View>

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
  buttonContainer: { marginBottom: 12 },
});
