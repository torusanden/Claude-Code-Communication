#!/bin/bash
set -e

PROJECT_NAME="habit8"
SESSION_MULTI="multiagent_${PROJECT_NAME}"
SESSION_PRESIDENT="president_${PROJECT_NAME}"
WINDOW1="agents1"
WINDOW2="agents2"
PANE_TITLES1=("${PROJECT_NAME}_boss1" "${PROJECT_NAME}_worker1" "${PROJECT_NAME}_worker2" "${PROJECT_NAME}_worker3")
PANE_TITLES2=("${PROJECT_NAME}_worker4" "${PROJECT_NAME}_worker5" "${PROJECT_NAME}_worker6" "log")

log() { echo -e "\033[1;32m[INFO]\033[0m $1"; }
success() { echo -e "\033[1;34m[SUCCESS]\033[0m $1"; }

echo "🤖 Claude Multi-Agent Setup - ${PROJECT_NAME} (Split Mode)"
echo "========================================================"

log "🧹 セッションをクリーンアップ中..."
tmux kill-session -t "$SESSION_MULTI" 2>/dev/null || true
tmux kill-session -t "$SESSION_PRESIDENT" 2>/dev/null || true
mkdir -p ./tmp ./logs
rm -f ./tmp/*.txt ./logs/*.txt 2>/dev/null || true
success "✅ クリーンアップ完了"

# agents1 window
log "📺 ${WINDOW1} 作成中..."
tmux new-session -d -s "$SESSION_MULTI" -n "$WINDOW1"
tmux split-window -h -t "$SESSION_MULTI:0"
tmux select-pane -t "$SESSION_MULTI:0.0"; tmux split-window -v
tmux select-pane -t "$SESSION_MULTI:0.2"; tmux split-window -v

for i in {0..3}; do
  tmux select-pane -t "$SESSION_MULTI:0.$i" -T "${PANE_TITLES1[$i]}"
  tmux send-keys -t "$SESSION_MULTI:0.$i" "cd $(pwd)" C-m
  COLOR="\[\033[1;34m\]"; [ $i -eq 0 ] && COLOR="\[\033[1;31m\]"
  tmux send-keys -t "$SESSION_MULTI:0.$i" "export PS1='(${COLOR}${PANE_TITLES1[$i]}\[\033[0m\]) \[\033[1;32m\]\w\[\033[0m\]\$ '" C-m
  tmux send-keys -t "$SESSION_MULTI:0.$i" "echo '=== ${PANE_TITLES1[$i]} エージェント ==='" C-m
done

# agents2 window
log "📺 ${WINDOW2} 作成中..."
tmux new-window -t "$SESSION_MULTI" -n "$WINDOW2"
tmux split-window -h -t "$SESSION_MULTI:1"
tmux select-pane -t "$SESSION_MULTI:1.0"; tmux split-window -v
tmux select-pane -t "$SESSION_MULTI:1.2"; tmux split-window -v

for i in {0..3}; do
  tmux select-pane -t "$SESSION_MULTI:1.$i" -T "${PANE_TITLES2[$i]}"
  tmux send-keys -t "$SESSION_MULTI:1.$i" "cd $(pwd)" C-m
  COLOR="\[\033[1;34m\]"
  tmux send-keys -t "$SESSION_MULTI:1.$i" "export PS1='(${COLOR}${PANE_TITLES2[$i]}\[\033[0m\]) \[\033[1;32m\]\w\[\033[0m\]\$ '" C-m
  tmux send-keys -t "$SESSION_MULTI:1.$i" "echo '=== ${PANE_TITLES2[$i]} エージェント ==='" C-m
done

# president
log "👑 president セッション作成中..."
tmux new-session -d -s "$SESSION_PRESIDENT"
tmux send-keys -t "$SESSION_PRESIDENT" "cd $(pwd)" C-m
tmux send-keys -t "$SESSION_PRESIDENT" "export PS1='(\[\033[1;35m\]PRESIDENT_${PROJECT_NAME}\[\033[0m\]) \[\033[1;32m\]\w\[\033[0m\]\$ '" C-m
tmux send-keys -t "$SESSION_PRESIDENT" "echo '=== PRESIDENT_${PROJECT_NAME} セッション ==='" C-m
success "✅ セットアップ完了"

echo ""
log "📋 次のステップ:"
echo "  tmux attach -t $SESSION_MULTI # エージェント確認"
echo "  tmux attach -t $SESSION_PRESIDENT # プレジデント確認"
echo ""
