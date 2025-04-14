// app/message/[messageId].tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, Text, View, StyleSheet, Pressable } from 'react-native';
import { useEffect, useState } from 'react';

export default function MessageDetails() {
  const router = useRouter();
  const { score, message, phone, time } = useLocalSearchParams();
  const [allowOpen, setAllowOpen] = useState(false);
  const scoreNum = parseInt(score as string);

  useEffect(() => {
    if (scoreNum >= 85) {
      Alert.alert(
        'אזהרה!',
        'ההודעה זוהתה כזדונית. האם להמשיך בכל זאת?',
        [
          { text: 'ביטול', style: 'cancel' },
          { text: 'המשך', onPress: () => setAllowOpen(true) },
        ]
      );
    } else if (scoreNum >= 40) {
      Alert.alert(
        'שימו לב',
        'ייתכן שההודעה מזיקה. לא ללחוץ על קישורים!',
        [{ text: 'הבנתי' }]
      );
      setAllowOpen(true);
    } else {
      setAllowOpen(true);
    }
  }, []);

  if (!allowOpen) return null;

  return (
    <View style={[styles.container, scoreNum >= 85 && { backgroundColor: '#ffe6e6' }]}>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}> חזור</Text>
      </Pressable>
      <Text style={styles.phone}>{phone}</Text>
      <Text style={styles.time}>{time}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    marginBottom: 10,
  },
  backText: {
    color: '#007AFF',
    fontSize: 16,
  },
  phone: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  time: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
  },
});