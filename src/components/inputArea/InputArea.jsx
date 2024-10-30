import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import styles from './InputArea.module.scss';

const InputArea = ({ onInputChange, placeholder, value }) => {
    return (
        <div className={styles.inputAreaContainer}>
            <TextareaAutosize
                className={styles.textarea}
                onChange={onInputChange}
                placeholder={placeholder}
                value={value}
                minRows={3}
                maxRows={6}
            />
        </div>
    );
};

export default InputArea;