import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { API_ENDPOINTS } from '@/config/api';
import * as SecureStore from 'expo-secure-store';

export default function Chat() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "안녕하세요! 무엇을 도와드릴까요?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState('');
  const [loadingDots, setLoadingDots] = useState('');
  const flatListRef = useRef(null);

  useEffect(() => {
    // 새 메시지가 추가될 때마다 스크롤을 맨 아래로
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // 로딩 애니메이션
  useEffect(() => {
    const hasLoadingMessage = messages.some(msg => msg.isLoading);
    if (hasLoadingMessage) {
      const interval = setInterval(() => {
        setLoadingDots(prev => {
          if (prev === '...') return '';
          return prev + '.';
        });
      }, 500);
      return () => clearInterval(interval);
    } else {
      setLoadingDots('');
    }
  }, [messages]);

  const handleSend = async () => {
    const token = await SecureStore.getItemAsync("accessToken");
    if (!token) {
      console.log("토큰이 없습니다.");
      return;
    }
    if (inputText.trim() === "") return;

    const newMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");

    // 로딩 메시지 추가
    const loadingMessageId = Date.now().toString() + '_loading';
    setMessages(prev => [...prev, {
      id: loadingMessageId,
      isBot: true,
      isLoading: true,
      timestamp: new Date()
    }]);

    // 봇 응답 시뮬레이션 (실제로는 API 호출)
    const response = await fetch(API_ENDPOINTS.AI_CHATBOT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userMessage: inputText }),
    });
    const result = await response.json();
    if (response.ok && result.success && result.data && result.data.answer) {
      // 로딩 메시지를 실제 응답으로 교체
      setMessages(prev => prev.map(msg =>
        msg.id === loadingMessageId
          ? { ...msg, text: result.data.answer, isLoading: false, timestamp: new Date() }
          : msg
      ));
      setOutputText(result.data.answer);
    } else {
      // 에러 발생 시 로딩 메시지를 에러 메시지로 교체
      setMessages(prev => prev.map(msg =>
        msg.id === loadingMessageId
          ? { ...msg, text: '죄송합니다. 응답을 생성하는데 실패했습니다.', isLoading: false, timestamp: new Date() }
          : msg
      ));
      console.error('AI 챗봇 응답 실패:', response.status);
    }
  };

  const renderMessage = ({ item }) => {
    return (
      <View
        key={item.id}
        style={[
          styles.messageContainer,
          item.isBot ? styles.botMessage : styles.userMessage,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            item.isBot ? styles.botBubble : styles.userBubble,
          ]}
        >
          {item.isLoading ? (
            <Text
              style={[
                styles.messageText,
                styles.botText,
              ]}
            >
              {item.text}{loadingDots}
            </Text>
          ) : (
            <Text
              style={[
                styles.messageText,
                item.isBot ? styles.botText : styles.userText,
              ]}
            >
              {item.text}
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("./home")}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Image
          source={require("@/assets/images/dreame1.png")}
          style={styles.botAvatar}
          contentFit="contain"
        />
        <Text style={styles.screenTitle}>드림이 챗봇</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {/* 메시지 리스트 */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />

        {/* 입력 영역 */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="메시지를 입력하세요..."
            placeholderTextColor="#999"
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              inputText.trim() === "" && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={inputText.trim() === ""}
          >
            <Text style={styles.sendButtonText}>전송</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: 60,
  },
  headerBar: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 10,
  },
  backButton: {
    padding: 8,
    position: "absolute",
    left: 20,
    zIndex: 1,
  },
  backButtonText: {
    fontSize: 28,
    color: "#000",
    fontWeight: "bold",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  botAvatar: {
    width: 32,
    height: 32,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
    fontFamily: "Pretendard-SemiBold",
  },
  keyboardView: {
    flex: 1,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    marginBottom: 12,
  },
  botMessage: {
    alignItems: "flex-start",
  },
  userMessage: {
    alignItems: "flex-end",
  },
  messageBubble: {
    maxWidth: "75%",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
  },
  botBubble: {
    backgroundColor: "#F5F5F5",
    borderTopLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: "#3E6AF4",
    borderTopRightRadius: 4,
  },
  messageText: {
    fontSize: 15,
    fontFamily: "Pretendard-Regular",
    lineHeight: 20,
  },
  botText: {
    color: "#000",
  },
  userText: {
    color: "#FFFFFF",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    backgroundColor: "#FFFFFF",
    gap: 8,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 20,
    borderRadius: 22,
    backgroundColor: "#F5F5F5",
    fontSize: 15,
    fontFamily: "Pretendard-Regular",
    color: "#000",
  },
  sendButton: {
    height: 40,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 22,
    marginBottom: 20,
    backgroundColor: "#3E6AF4",
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#CCCCCC",
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: "Pretendard-SemiBold",
  },
});
