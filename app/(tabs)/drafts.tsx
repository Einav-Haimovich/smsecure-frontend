import {View, FlatList, StyleSheet, Button} from 'react-native';
import {useLocalSearchParams, useRouter} from 'expo-router';
import MessageItem from '../../components/MessageItem';

type Message = {
    id: string;
    score: number;
    content: string;
    sender: string;
    time: string;
};

export default function DraftsScreen() {
    const params = useLocalSearchParams();
    const drafts: Message[] = params.drafts ? JSON.parse(params.drafts as string) : [];
    const router = useRouter();

    return (
        <>
            <View style={styles.container}>
                <Button title={"Back"} onPress={() => router.back()}/>
                <FlatList
                    data={drafts}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => (
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



        </>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, padding: 16},
});
