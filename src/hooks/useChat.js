import { useState, useRef, useEffect } from 'react';
import { createChatWebSocket, deleteChatHistory, refreshAccessToken } from '../api';
import { THEME_LOCAL_STORAGE_KEY } from '../components/ThemeSelector';

const LOCAL_STORAGE_KEY = 'chatMessages';

const useChat = () => {
    const [userQuery, setUserQuery] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [theme, setTheme] = useState('dark');
    const [webSocketOpen, setWebSocketOpen] = useState(false);

    const textareaRef = useRef(null);
    const messagesEndRef = useRef(null);
    const websocketRef = useRef(null);

    useEffect(() => {
        const savedMessages = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
        setMessages(savedMessages);
    }, []);

    useEffect(() => {
        const savedTheme = localStorage.getItem(THEME_LOCAL_STORAGE_KEY);
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));
    }, [messages]);

    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        adjustTextareaHeight();
        scrollToBottom();
    }, [messages]);

    const handleInputChange = (event) => {
        setUserQuery(event.target.value);
        adjustTextareaHeight();
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSubmit(event);
        }
    };

    const handleSubmit = async (event, authToken = null) => {
        if (event) event.preventDefault();
        if (authToken) {
            localStorage.setItem('accessToken', authToken);
        }

        if (!userQuery.trim()) return;

        const newMessages = [
            ...messages,
            { text: userQuery, type: 'user' },
            { text: '', type: 'bot', isLoading: true },
        ];
        setMessages(newMessages);
        setError(null);
        setUserQuery('');
        setLoading(true);
        setWebSocketOpen(true);

        const openWebSocket = () => {
            websocketRef.current = createChatWebSocket(localStorage.getItem('accessToken'));

            // Handle incoming messages
            websocketRef.current.onmessage = (event) => {
                let data;
                const rawData = event.data;
            
                // Attempt to parse the initial part of the message as JSON
                try {
                    data = JSON.parse(rawData);
                } catch (error) {
                    // If parsing fails, treat the whole message as a regular message
                    data = { text: rawData }; // Default to handling rawData as text
                }
            
                // Check if the parsed JSON contains a reauth property
                if (data.reauth) {
                    const newAccessToken = data.new_access_token;
            
                    if (newAccessToken) {
                        // Update the access token in state and local storage
                        localStorage.setItem('accessToken', newAccessToken);
            
                        // Close the current WebSocket and reopen it with the new access token
                        websocketRef.current.close();
                        handleSubmit(null, newAccessToken); // Resend the last message with the new token
            
                        return; // Early return to prevent further processing
                    }
                }
            
                // Handle regular messages (non-JSON or after JSON part)
                setMessages((prevMessages) => {
                    const lastMessageIndex = prevMessages.length - 1;
                    const lastMessage = prevMessages[lastMessageIndex];
            
                    // If JSON parsing fails or no reauth, treat the entire message as regular text
                    const chunk = data.text || rawData; 
            
                    if (chunk === '[END]') {
                        setLoading(false);
                        setWebSocketOpen(false);
                        return prevMessages.map((message, index) =>
                            index === lastMessageIndex
                                ? { ...message, isLoading: false }
                                : message
                        );
                    }
            
                    const updatedMessages = [...prevMessages];
                    updatedMessages[lastMessageIndex] = {
                        ...lastMessage,
                        text: (lastMessage.text || '') + chunk,
                    };
            
                    return updatedMessages;
                });
            };

            websocketRef.current.onclose = async (event) => {
                if (event.code === 4001) {  // Reauthentication required
                    try {
                        const newAccessToken = await refreshAccessToken();
                        if (newAccessToken) {
                            localStorage.setItem('accessToken', newAccessToken);
                            openWebSocket();  // Reopen WebSocket with the new token
                            websocketRef.current.send(userQuery);
                            return;
                        }
                    } catch (error) {
                        setError('Reauthentication failed. Please try again.');
                        setLoading(false);
                        setWebSocketOpen(false);
                    }
                } else {
                    setLoading(false);
                    setWebSocketOpen(false);
                    setUserQuery('');
                    setMessages((prevMessages) =>
                        prevMessages.map((message) =>
                            message.type === 'bot' && message.isLoading
                                ? { ...message, isLoading: false }
                                : message
                        )
                    );
                }
            };

            websocketRef.current.onerror = (err) => {
                setError('Error fetching response');
                setLoading(false);
                setWebSocketOpen(false);
                websocketRef.current.close();
            };

            websocketRef.current.onopen = () => {
                websocketRef.current.send(userQuery);
            };
        };

        openWebSocket();  // Initial WebSocket connection
    };

    const handleStop = () => {
        if (websocketRef.current) {
            websocketRef.current.close();
            setWebSocketOpen(false);
            setLoading(false);
            setMessages((prevMessages) =>
                prevMessages.map((message) =>
                    message.type === 'bot' && message.isLoading
                        ? { ...message, isLoading: false }
                        : message
                )
            );
        }
    };

    const handleClearMessages = async () => {
        try {
            await deleteChatHistory();
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            setMessages([]);
        } catch (error) {
            console.error('Error deleting chat history:', error);
            alert('Error deleting chat history');
        }
    };

    return {
        userQuery,
        setUserQuery,
        messages,
        loading,
        error,
        theme,
        textareaRef,
        messagesEndRef,
        handleInputChange,
        handleKeyDown,
        handleSubmit,
        handleStop,
        handleClearMessages,
    };
};

export default useChat;
