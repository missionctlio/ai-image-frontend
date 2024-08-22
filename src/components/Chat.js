import React from 'react';
import Markdown from 'https://esm.sh/react-markdown@latest';
import remarkGfm from 'https://esm.sh/remark-gfm@latest';
import CodeBlock from './CodeBlock'; // Import CodeBlock
import useChat from '../hooks/useChat'; // Import the custom hook
import '../styles/Chat.css';
import { AiOutlineSend } from 'react-icons/ai';
import { FaSpinner, FaStop, FaTrash } from 'react-icons/fa'; // Import stop and trash icons
import useTheme from '../hooks/useTheme'; // Import useTheme hook

const Chat = () => {
    const {
        userQuery,
        setUserQuery,
        messages,
        loading,
        error,
        textareaRef,
        messagesEndRef,
        handleInputChange,
        handleKeyDown,
        handleSubmit,
        handleStop,
        handleClearMessages
    } = useChat();
    const { theme } = useTheme();
    return (
        <div className={`chat-container`}>
            <div className={`chat-messages ${theme}-theme`}>
                {messages.slice().reverse().map((message, index) => (
                    <div
                        key={index}
                        className={`message ${message.type}-message ${theme}-theme`}
                    >
                        <Markdown
                            components={{
                                code: ({ node, inline, className, children, ...props }) => {
                                    const match = /language-(\w+)/.exec(className || '');
                                    const language = match ? match[1] : '';
                                    return !inline && language ? (
                                        <CodeBlock
                                            language={language}
                                            value={String(children).replace(/\n$/, '')}
                                        />
                                    ) : (
                                        <code className={className} {...props}>
                                            {children}
                                        </code>
                                    );
                                },
                            }}
                            remarkPlugins={[remarkGfm]}
                            className={`markdown ${theme}-theme`}
                        >
                            {message.text || ''}
                        </Markdown>
                        {message.type === 'bot' && message.isLoading && (
                            <div className="loading-icon">
                                <FaSpinner size={24} className="spinner" />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div ref={messagesEndRef} className={`input-container ${theme}-theme`}>
                <textarea
                    className={`textarea theme-selector ${theme}-theme`}
                    value={userQuery}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    ref={textareaRef}
                    placeholder="Type your message here..."
                />
                {loading ? (
                    <button
                        type="button"
                        onClick={handleStop}
                        className={`stop-button ${theme}-theme`}
                    >
                        <FaStop size={24} />
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`send-button ${theme}-theme`}
                    >
                        <AiOutlineSend size={24} />
                    </button>
                )}
                <button
                    type="button"
                    onClick={handleClearMessages}
                    className={`clear-button ${theme}-theme`}
                >
                    <FaTrash size={24} />
                </button>
            </div>
            {error && <div className={`error ${theme}`}>{error}</div>}
        </div>
    );
};

export default Chat;
