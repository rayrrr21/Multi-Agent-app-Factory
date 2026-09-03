import React from 'react';

export interface AnswerDeckProps {
  optionA: string;
  optionB: string;
  selectedAnswer: 'A' | 'B' | null;
  feedbackState: 'correct' | 'wrong' | null;
  onSelectOption: (option: 'A' | 'B') => void;
}

export const AnswerDeck: React.FC<AnswerDeckProps> = ({
  optionA,
  optionB,
  selectedAnswer,
  feedbackState,
  onSelectOption,
}) => {
  const getButtonStyle = (option: 'A' | 'B') => {
    const isSelected = selectedAnswer === option;

    let bg = '#1E293B';
    let borderColor = '#334155';
    let shadow = '0 6px 16px rgba(0, 0, 0, 0.3)';

    if (feedbackState && isSelected) {
      if (feedbackState === 'correct') {
        bg = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
        borderColor = '#34D399';
        shadow = '0 0 20px rgba(16, 185, 129, 0.6)';
      } else {
        bg = 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)';
        borderColor = '#F87171';
        shadow = '0 0 20px rgba(239, 68, 68, 0.6)';
      }
    }

    return {
      flex: 1,
      padding: '22px 16px',
      fontSize: '18px',
      fontWeight: '800' as const,
      borderRadius: '16px',
      border: `2px solid ${borderColor}`,
      background: bg,
      color: '#FFFFFF',
      cursor: feedbackState !== null ? 'default' : 'pointer',
      boxShadow: shadow,
      transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      outline: 'none',
      userSelect: 'none' as const,
      touchAction: 'manipulation' as const,
    };
  };

  return (
    <div style={{ display: 'flex', gap: '14px', marginTop: '14px' }}>
      <button
        onClick={() => onSelectOption('A')}
        disabled={feedbackState !== null}
        style={getButtonStyle('A')}
      >
        {optionA}
        {feedbackState && selectedAnswer === 'A' ? (
          <span>{feedbackState === 'correct' ? '✓' : '✕'}</span>
        ) : null}
      </button>

      <button
        onClick={() => onSelectOption('B')}
        disabled={feedbackState !== null}
        style={getButtonStyle('B')}
      >
        {optionB}
        {feedbackState && selectedAnswer === 'B' ? (
          <span>{feedbackState === 'correct' ? '✓' : '✕'}</span>
        ) : null}
      </button>
    </div>
  );
};
