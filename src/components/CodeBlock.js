import React, { useState, useEffect } from 'react';
import { AiOutlineCopy } from 'react-icons/ai';
import { Prism as SyntaxHighlighter } from 'https://esm.sh/react-syntax-highlighter@latest';
import { materialDark } from 'https://esm.sh/react-syntax-highlighter@latest/dist/esm/styles/prism';
import '../styles/CodeBlock.css'; // Import the CSS
import { THEME_LOCAL_STORAGE_KEY } from './ThemeSelector';

const CodeBlock = ({ language, value }) => {
    const [theme, setTheme] = useState('dark'); // Default theme

    useEffect(() => {
        const savedTheme = localStorage.getItem(THEME_LOCAL_STORAGE_KEY);
        if (savedTheme) {
            setTheme(savedTheme);
        }
      }, [theme]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(value);
    };

    return (
        <div className="code-block">
            {language && <div className={`code-block-language ${theme}-theme`}>{language}</div>}
            <button className={`codeblock-copy-button theme-selector ${theme}-theme`} onClick={copyToClipboard}>
                <AiOutlineCopy size={16} />
            </button>
            <SyntaxHighlighter language={language} style={materialDark}>
                {value}
            </SyntaxHighlighter>
        </div>
    );
};

export default CodeBlock;
