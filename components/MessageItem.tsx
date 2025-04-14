// components/MessageItem.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

type Props = {
  id: string;
  score: number;
  message: string;
  phone: string;
  time: string;
};

export default function MessageItem({ id, score, message, phone, time }: Props) {
  const router = useRouter();

  const getBarColor = () => {
    if (score >= 85) return '#FF4C4C';
    if (score >= 40) return '#FFA500';
    return '#32CD32';
  };

  const handlePress = () => {
    router.push({
      pathname: '/message/[messageId]',
      params: {
        messageId: id,
        score: score.toString(),
        message,
        phone,
        time,
      },
    });
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <View style={styles.container}>
        <View style={[styles.colorBar, { backgroundColor: getBarColor() }]} />
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.phone}>{phone}</Text>
            <Text style={styles.time}>{time}</Text>
          </View>
          <Text numberOfLines={2} style={styles.message}>{message}</Text>
          <View style={styles.footer}>
            <Text style={[styles.score, { color: getBarColor() }]}>{score}% זדוניות</Text>
            {score >= 85 && (
              <Text style={styles.warning}>⚠️ נא לא להיכנס להודעה</Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  colorBar: {
    width: 8,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  content: {
    flex: 1,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  phone: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  time: {
    color: 'gray',
    fontSize: 12,
  },
  message: {
    marginVertical: 6,
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  score: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  warning: {
    color: '#FF4C4C',
    fontWeight: 'bold',
    fontSize: 12,
  },
});