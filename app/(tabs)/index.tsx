import React, { useEffect, useState, useCallback } from 'react';
import MessageItem from '../../components/MessageItem';
import { View, FlatList, ActivityIndicator, StyleSheet } from 'react-native';

type Message = {
  id: string;
  score: number;
  content: string;
  sender: string;
  time: string;
};

const RISK_THRESHOLD = 85;
const API_URL = "http://192.168.1.166:8000/messages/bulk/";

const fakeMessages = [
  {
    content: 'שלום Shir, RS113652 משלוח...',
    sender: 'דואר ישראל',
    time: '14:31',
  },
  {
    content: 'בשביל הקלות בזכויות...',
    sender: '052-0000000',
    time: '00:30',
  },
  {
    content: 'החבילה שלך מחכה, לחץ כאן...',
    sender: 'Bit',
    time: '17:32',
  },
] as const;

export default function MessageScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [drafts, setDrafts] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    try {
      const payload = {
        messages: fakeMessages.map((m) => ({
          content: m.content,
          sender: m.sender,
          time: m.time,
        })),
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Accept: 'application/json',
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      const { highRisk, normal } = data.reduce((acc: { highRisk: Message[], normal: Message[] }, msg: Message) => {
        if (msg.score >= RISK_THRESHOLD) {
          acc.highRisk.push(msg);
        } else {
          acc.normal.push(msg);
        }
        return acc;
      }, { highRisk: [], normal: [] });

      setDrafts(highRisk);
      setMessages(normal);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

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
  loader: { marginTop: 50 },
});