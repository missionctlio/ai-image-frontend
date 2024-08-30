import { useState, useRef, useEffect } from 'react';
import { createChatWebSocket, deleteChatHistory } from '../api';
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

    const handleSubmit = async (event) => {
        event.preventDefault();
    
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
    
        // Get the access token from localStorage
        const accessToken = localStorage.getItem('accessToken');
    
        // Create a new WebSocket connection with the access token
        websocketRef.current = createChatWebSocket(accessToken);
    
        // Handle incoming messages
        websocketRef.current.onmessage = (event) => {
            const chunk = event.data;
    
            setMessages((prevMessages) => {
                const lastMessageIndex = prevMessages.length - 1;
                const lastMessage = prevMessages[lastMessageIndex];
    
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
    
        // Handle WebSocket close event
        websocketRef.current.onclose = () => {
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
        };
    
        // Handle WebSocket error
        websocketRef.current.onerror = (err) => {
            setError('Error fetching response');
            setLoading(false);
            setWebSocketOpen(false);
            websocketRef.current.close();
        };
    
        // Send user query after WebSocket connection is established
        websocketRef.current.onopen = () => {
            websocketRef.current.send(userQuery);
        };
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
        handleClearMessages
    };
};

export default useChat;
