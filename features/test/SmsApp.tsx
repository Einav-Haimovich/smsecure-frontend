// SmsApp.js - Main component for SMS Phishing Analyzer

import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    PermissionsAndroid,
    ActivityIndicator,
    Alert,
} from 'react-native';
import SmsAndroid from 'react-native-get-sms-android';
import axios from 'axios';

const API_ENDPOINT = 'https://your-phishing-analysis-server.com/api/analyze';

const SmsApp = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);

    useEffect(() => {
        requestSmsPermission();
    }, []);

    // Request permission to read SMS messages
    const requestSmsPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_SMS,
                {
                    title: 'SMS Phishing Analyzer Permission',
                    message: 'This app needs to access your SMS messages to analyze them for potential phishing attempts.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('SMS permission granted');
                fetchSmsMessages();
            } else {
                console.log('SMS permission denied');
                Alert.alert(
                    'Permission Required',
                    'This app needs SMS permission to function properly.',
                    [{ text: 'OK' }]
                );
            }
        } catch (err) {
            console.warn(err);
        }
    };

    // Fetch SMS messages from the device
    const fetchSmsMessages = () => {
        setLoading(true);

        // Filter to get only inbox messages
        const filter = {
            box: 'inbox', // 'inbox' (default), 'sent', 'draft', 'outbox', 'failed', 'queued'
            // You can add more filters like read: 0 (unread only)
        };

        SmsAndroid.list(
            JSON.stringify(filter),
            (fail) => {
                console.log('Failed to retrieve SMS messages:', fail);
                setLoading(false);
                Alert.alert('Error', 'Failed to retrieve SMS messages');
            },
            (count, smsList) => {
                console.log('SMS count:', count);
                const rawMessages = JSON.parse(smsList);

                // Process messages and send to server for analysis
                analyzeSmsMessages(rawMessages);
            },
        );
    };

    // Send messages to server for phishing analysis
    const analyzeSmsMessages = async (rawMessages) => {
        setAnalyzing(true);

        try {
            // Prepare messages in batch for server analysis
            const messagesToAnalyze = rawMessages.map(msg => ({
                id: msg._id,
                address: msg.address, // sender
                body: msg.body,      // message content
                date: msg.date      // timestamp
            }));

            // Send to server for analysis
            const response = await axios.post(API_ENDPOINT, {
                messages: messagesToAnalyze
            });

            // Process response - server should return scores for each message
            if (response.data && response.data.results) {
                // Combine original messages with their phishing scores
                const analyzedMessages = rawMessages.map(msg => {
                    const analysisResult = response.data.results.find(r => r.id === msg._id);
                    return {
                        ...msg,
                        phishingScore: analysisResult ? analysisResult.score : 0,
                        analysis: analysisResult ? analysisResult.details : null
                    };
                });

                // Sort by phishing score (highest risk first)
                analyzedMessages.sort((a, b) => b.phishingScore - a.phishingScore);

                setMessages(analyzedMessages);
            } else {
                Alert.alert('Analysis Error', 'Failed to get proper analysis results');
            }
        } catch (error) {
            console.error('Error analyzing messages:', error);
            Alert.alert('Analysis Error', 'Failed to analyze messages');

            // Fallback: Just display messages without scores
            setMessages(rawMessages.map(msg => ({
                ...msg,
                phishingScore: 0
            })));
        } finally {
            setLoading(false);
            setAnalyzing(false);
        }
    };

    // Calculate background color based on phishing score (0-100)
    // Green (low risk) to Red (high risk)
    const getScoreColor = (score) => {
        if (score <= 20) {
            return '#4caf50'; // Green for safe messages (0-20)
        } else if (score <= 40) {
            return '#8bc34a'; // Light green (21-40)
        } else if (score <= 60) {
            return '#ffeb3b'; // Yellow (41-60)
        } else if (score <= 80) {
            return '#ff9800'; // Orange (61-80)
        } else {
            return '#f44336'; // Red for high-risk messages (81-100)
        }
    };

    // Render each message item
    const renderMessageItem = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.messageItem,
                { backgroundColor: getScoreColor(item.phishingScore) }
            ]}
            onPress={() => showMessageDetails(item)}
        >
            <View style={styles.messageHeader}>
                <Text style={styles.sender}>{item.address}</Text>
                <Text style={styles.score}>Risk: {item.phishingScore}%</Text>
            </View>
            <Text style={styles.messageBody} numberOfLines={2}>
                {item.body}
            </Text>
            <Text style={styles.date}>
                {new Date(parseInt(item.date)).toLocaleString()}
            </Text>
        </TouchableOpacity>
    );

    // Show detailed message analysis
    const showMessageDetails = (message) => {
        Alert.alert(
            `Message from ${message.address}`,
            `${message.body}\n\nRisk Score: ${message.phishingScore}%\n${message.analysis ? `Analysis: ${message.analysis}` : ''}`,
            [{ text: 'Close' }]
        );
    };

    // Refresh message list
    const refreshMessages = () => {
        fetchSmsMessages();
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <Text style={styles.title}>SMS Phishing Analyzer</Text>
                <TouchableOpacity
                    style={styles.refreshButton}
                    onPress={refreshMessages}
                    disabled={loading || analyzing}
                >
                    <Text style={styles.refreshButtonText}>Refresh</Text>
                </TouchableOpacity>
            </View>

            {(loading || analyzing) ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text style={styles.loadingText}>
                        {loading ? 'Loading messages...' : 'Analyzing messages...'}
                    </Text>
                </View>
            ) : (
                <>
                    <View style={styles.legendContainer}>
                        <Text style={styles.legendTitle}>Risk Level:</Text>
                        <View style={styles.legendItems}>
                            <View style={styles.legendItem}>
                                <View style={[styles.colorBox, { backgroundColor: '#4caf50' }]} />
                                <Text>Safe</Text>
                            </View>
                            <View style={styles.legendItem}>
                                <View style={[styles.colorBox, { backgroundColor: '#ffeb3b' }]} />
                                <Text>Medium</Text>
                            </View>
                            <View style={styles.legendItem}>
                                <View style={[styles.colorBox, { backgroundColor: '#f44336' }]} />
                                <Text>High</Text>
                            </View>
                        </View>
                    </View>

                    <FlatList
                        data={messages}
                        renderItem={renderMessageItem}
                        keyExtractor={item => item._id.toString()}
                        contentContainerStyle={styles.listContainer}
                        ListEmptyComponent={
                            <Text style={styles.emptyText}>
                                No messages found. Tap Refresh to scan messages.
                            </Text>
                        }
                    />
                </>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#2196f3',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    refreshButton: {
        backgroundColor: 'white',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
    },
    refreshButtonText: {
        color: '#2196f3',
        fontWeight: 'bold',
    },
    listContainer: {
        padding: 16,
    },
    messageItem: {
        marginBottom: 12,
        padding: 16,
        borderRadius: 8,
        elevation: 2,
    },
    messageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    sender: {
        fontWeight: 'bold',
        flex: 1,
    },
    score: {
        fontWeight: 'bold',
    },
    messageBody: {
        marginBottom: 8,
    },
    date: {
        fontSize: 12,
        color: '#555',
        textAlign: 'right',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 40,
        fontSize: 16,
        color: '#666',
    },
    legendContainer: {
        padding: 16,
        backgroundColor: 'white',
        marginBottom: 8,
    },
    legendTitle: {
        fontWeight: 'bold',
        marginBottom: 8,
    },
    legendItems: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    colorBox: {
        width: 16,
        height: 16,
        marginRight: 8,
        borderRadius: 4,
    },
});

export default SmsApp;