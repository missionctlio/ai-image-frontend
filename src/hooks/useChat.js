import { useState, useRef, useEffect } from 'react';
import { createChatWebSocket } from '../api';
import { v4 as uuidv4 } from 'uuid';
import { THEME_LOCAL_STORAGE_KEY } from '../components/ThemeSelector';

const LOCAL_STORAGE_KEY = 'chatMessages';
const UUID_LOCAL_STORAGE_KEY = 'UserId';

const useChat = () => {
    const [userQuery, setUserQuery] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [theme, setTheme] = useState('dark');
    const [uuid, setUuid] = useState(null);
    const [webSocketOpen, setWebSocketOpen] = useState(false);

    const textareaRef = useRef(null);
    const messagesEndRef = useRef(null);
    const websocketRef = useRef(null);

    useEffect(() => {
        const savedMessages = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
        setMessages(savedMessages);

        let savedUuid = localStorage.getItem(UUID_LOCAL_STORAGE_KEY);
        if (!savedUuid) {
            savedUuid = uuidv4();
            localStorage.setItem(UUID_LOCAL_STORAGE_KEY, savedUuid);
        }
        setUuid(savedUuid);
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

        websocketRef.current = createChatWebSocket(uuid);

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

    const handleClearMessages = () => {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        setMessages([]);
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
