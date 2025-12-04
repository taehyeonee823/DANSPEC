import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Swipeable } from 'react-native-gesture-handler';
import { useWebSocket } from '@/hooks/useWebSocket';
import AlarmTab from './alarmTab';

// ⚠️ 실제로는 로그인 상태에서 가져온 사용자 ID를 사용해야 합니다.
const CURRENT_USER_ID = 'user-123'; 

const NotificationScreen = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    // 웹소켓 훅을 통해 실시간 알림 데이터를 가져옴
    const { notifications, deleteNotification } = useWebSocket(CURRENT_USER_ID);

    // 읽지 않은 알림 개수 계산 ('read: false'인 항목)
    const unreadCount = notifications.filter(n => !n.read).length;

    // 스와이프 시 삭제 버튼 렌더링
    const renderRightActions = (item) => (
        <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteNotification(item.id)}
        >
            <Text style={styles.deleteButtonText}>삭제</Text>
        </TouchableOpacity>
    );

    const renderItem = ({ item }) => (
        <Swipeable renderRightActions={() => renderRightActions(item)}>
            <View style={[styles.notificationItem, item.read ? styles.read : styles.unread]}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.message}>{item.message}</Text>
                <Text style={styles.time}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
            </View>
        </Swipeable>
    );

    return (
        <View style={[styles.mainContainer, { paddingTop: insets.top }]}>
            <View style={styles.headerBar}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.push('/My/my')}
                >
                    <Text style={styles.backButtonText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.screenTitle}>
                    수신함
                </Text>
            </View>

            <View style={styles.fixedAlarmTab}>
                <AlarmTab />
            </View>
            
            <FlatList
                style={styles.flatList}
                contentContainerStyle={styles.flatListContent}
                data={notifications}
                renderItem={renderItem}
                // KeyExtractor는 알림의 고유 ID를 사용해야 하지만, 모의 데이터에서는 index 사용
                keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
                ListEmptyComponent={<Text style={styles.empty}>도착한 알림이 없습니다.</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    headerBar: {
        height: 44, 
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        paddingHorizontal: 10,
    },
    backButton: {
        padding: 8,
        position: 'absolute', 
        left: 20,
        zIndex: 1,
    },
    backButtonText: {
        fontSize: 28,
        color: '#000',
        fontWeight: 'bold',
    },
    screenTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000',
        textAlign: 'center',
    },
    fixedAlarmTab: {
        backgroundColor: '#FFFFFF',
        zIndex: 10, 
    },
    flatList: {
        flex: 1,
    },
    flatListContent: {
        paddingBottom: 100,
    },
    notificationItem: { 
        padding: 15, 
        marginVertical: 5, 
        marginHorizontal: 10, 
        borderRadius: 8, 
        elevation: 1 
    },
    unread: { 
        backgroundColor: '#e6f7ff', 
        borderLeftWidth: 5, 
        borderLeftColor: '#1890ff' 
    },
    read: { 
        backgroundColor: '#ffffff', 
        borderLeftWidth: 5, 
        borderLeftColor: '#ddd' 
    },
    itemTitle: { 
        fontWeight: 'bold', 
        marginBottom: 3 
    },
    message: { 
        fontSize: 14, 
        color: '#333' 
    },
    time: { 
        fontSize: 10, 
        marginTop: 5, 
        textAlign: 'right', 
        color: '#999' 
    },
    empty: { 
        textAlign: 'center', 
        marginTop: 50, 
        color: '#aaa' 
    },
    deleteButton: {
        backgroundColor: '#FF3B30',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        marginVertical: 5,
        marginRight: 10,
        borderRadius: 8,
    },
    deleteButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 16,
    }
});

export default NotificationScreen;