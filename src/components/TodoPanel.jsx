/**
 * TodoPanel — 화면 하단 슬라이드업 할일 패널
 *
 * Props:
 *   isOpen          — 패널 열림 여부
 *   onClose         — 닫기 콜백
 *   todos           — Todo 배열 [{ id, text, done, date }]
 *   fertilizers     — 현재 보유 비료 개수 (최대 3)
 *   onComplete(id)  — 할일 완료 처리 (비료 +1)
 *   onAdd(text)     — 할일 추가
 *   onDelete(id)    — 할일 삭제
 *   onUseFertilizer — 비료 사용 (love +20)
 */
import { useState } from 'react'

export default function TodoPanel({
  isOpen,
  onClose,
  todos,
  fertilizers,
  onComplete,
  onAdd,
  onDelete,
  onUseFertilizer,
}) {
  const [inputText, setInputText] = useState('')

  function handleAdd() {
    const text = inputText.trim()
    if (!text) return
    onAdd(text)
    setInputText('')
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleAdd()
  }

  const doneTodos    = todos.filter(t => t.done)
  const pendingTodos = todos.filter(t => !t.done)

  return (
    <>
      {/* 배경 딤 — 탭하면 패널 닫힘 */}
      {isOpen && (
        <div style={styles.backdrop} onClick={onClose} />
      )}

      {/* 패널 본체 — isOpen에 따라 translateY로 슬라이드 */}
      <div style={{
        ...styles.panel,
        transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
      }}>

        {/* ── 핸들 바 (드래그 느낌) ── */}
        <div style={styles.handle}>
          <div style={styles.handleBar} />
        </div>

        {/* ── 비료 섹션 ── */}
        <div style={styles.fertRow}>
          <span style={styles.fertLabel}>
            🌿 비료
            <span style={styles.fertCount}> ×{fertilizers}</span>
          </span>
          <button
            onClick={onUseFertilizer}
            disabled={fertilizers <= 0}
            style={{
              ...styles.fertBtn,
              opacity: fertilizers <= 0 ? 0.4 : 1,
              cursor:  fertilizers <= 0 ? 'not-allowed' : 'pointer',
            }}
          >
            사용 (love +20)
          </button>
        </div>
        <p style={styles.fertHint}>할일을 완료하면 비료를 얻어요 🌱</p>

        <div style={styles.divider} />

        {/* ── 할일 추가 입력 ── */}
        <div style={styles.addRow}>
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="오늘 할 일을 입력하세요"
            style={styles.input}
            maxLength={40}
          />
          <button onClick={handleAdd} style={styles.addBtn}>추가</button>
        </div>

        {/* ── 미완료 할일 목록 ── */}
        <div style={styles.listWrap}>
          {todos.length === 0 && (
            <p style={styles.emptyMsg}>아직 할일이 없어요. 추가해 보세요!</p>
          )}

          {pendingTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onComplete={onComplete}
              onDelete={onDelete}
            />
          ))}

          {/* 완료 목록 — 접어두기 느낌으로 흐리게 표시 */}
          {doneTodos.length > 0 && (
            <>
              <p style={styles.doneHeader}>완료 ({doneTodos.length})</p>
              {doneTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onComplete={onComplete}
                  onDelete={onDelete}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </>
  )
}

// ── 개별 할일 아이템 ──────────────────────────────────────────────

function TodoItem({ todo, onComplete, onDelete }) {
  return (
    <div style={{
      ...styles.item,
      opacity: todo.done ? 0.5 : 1,
    }}>
      {/* 완료 체크박스 */}
      <button
        onClick={() => !todo.done && onComplete(todo.id)}
        disabled={todo.done}
        style={{
          ...styles.checkBtn,
          background: todo.done ? '#4A9E5A' : 'rgba(255,255,255,0.6)',
          cursor: todo.done ? 'default' : 'pointer',
        }}
      >
        {todo.done ? '✓' : ''}
      </button>

      {/* 할일 텍스트 */}
      <span style={{
        ...styles.itemText,
        textDecoration: todo.done ? 'line-through' : 'none',
      }}>
        {todo.text}
      </span>

      {/* 삭제 버튼 */}
      <button
        onClick={() => onDelete(todo.id)}
        style={styles.deleteBtn}
      >
        ✕
      </button>
    </div>
  )
}

// ── 스타일 ───────────────────────────────────────────────────────

const styles = {
  backdrop: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0.3)',
    zIndex: 10,
  },
  panel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    // 화면 높이의 약 65% 차지
    height: '65%',
    background: '#FAFFF7',
    borderRadius: '20px 20px 0 0',
    boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
    display: 'flex',
    flexDirection: 'column',
    padding: '0 16px 16px',
    zIndex: 11,
    // 슬라이드 애니메이션
    transition: 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
  },
  handle: {
    display: 'flex',
    justifyContent: 'center',
    padding: '10px 0 6px',
  },
  handleBar: {
    width: '40px',
    height: '4px',
    background: '#ccc',
    borderRadius: '99px',
  },
  fertRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '4px',
  },
  fertLabel: {
    fontSize: '15px',
    color: '#2d5a1b',
    fontWeight: 'bold',
  },
  fertCount: {
    fontSize: '18px',
    color: '#4A9E5A',
  },
  fertBtn: {
    background: '#4A9E5A',
    color: 'white',
    border: 'none',
    borderRadius: '99px',
    padding: '6px 14px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  fertHint: {
    fontSize: '11px',
    color: '#888',
    margin: '4px 0 0',
  },
  divider: {
    height: '1px',
    background: 'rgba(0,0,0,0.08)',
    margin: '10px 0',
  },
  addRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '10px',
  },
  input: {
    flex: 1,
    padding: '8px 12px',
    border: '1.5px solid #cce5cc',
    borderRadius: '10px',
    fontSize: '13px',
    outline: 'none',
    background: 'white',
    color: '#333',
  },
  addBtn: {
    background: '#4A90D9',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    padding: '8px 14px',
    fontSize: '13px',
    fontWeight: 'bold',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  listWrap: {
    flex: 1,
    overflowY: 'auto',
  },
  emptyMsg: {
    textAlign: 'center',
    color: '#aaa',
    fontSize: '13px',
    marginTop: '24px',
  },
  doneHeader: {
    fontSize: '11px',
    color: '#aaa',
    margin: '12px 0 6px',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 4px',
    borderBottom: '1px solid rgba(0,0,0,0.05)',
  },
  checkBtn: {
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    border: '1.5px solid #4A9E5A',
    color: 'white',
    fontSize: '13px',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },
  itemText: {
    flex: 1,
    fontSize: '13px',
    color: '#333',
    lineHeight: 1.4,
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    color: '#bbb',
    fontSize: '13px',
    cursor: 'pointer',
    padding: '2px 4px',
    flexShrink: 0,
  },
}
