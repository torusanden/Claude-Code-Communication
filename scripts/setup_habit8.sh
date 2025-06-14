#!/bin/bash
set -e

# プロジェクト構成
PROJECT_NAME="habit8"
SESSION_MULTI="multiagent_${PROJECT_NAME}"
SESSION_PRESIDENT="president_${PROJECT_NAME}"
PANE_TITLES=(
  "${PROJECT_NAME}_boss1"
  "${PROJECT_NAME}_worker1"
  "${PROJECT_NAME}_worker2"
  "${PROJECT_NAME}_worker3"
  "${PROJECT_NAME}_worker4"
  "${PROJECT_NAME}_worker5"
  "${PROJECT_NAME}_worker6"
)

log_info() { echo -e "\033[1;32m[INFO]\033[0m $1"; }
log_success() { echo -e "\033[1;34m[SUCCESS]\033[0m $1"; }

echo "🤖 Claude Multi-Agent Setup - ${PROJECT_NAME}"
echo "==========================================="

# クリーンアップ処理
log_info "🧹 セッションをクリーンアップ中..."
tmux kill-session -t "$SESSION_MULTI" 2>/dev/null || true
tmux kill-session -t "$SESSION_PRESIDENT" 2>/dev/null || true
mkdir -p ./tmp ./logs
rm -f ./tmp/*.txt ./logs/*.txt 2>/dev/null || true
log_success "✅ クリーンアップ完了"

# multiagent セッション作成（7ペイン）
log_info "📺 ${SESSION_MULTI} セッションを作成..."
tmux new-session -d -s "$SESSION_MULTI" -n "agents"
tmux split-window -h -t "$SESSION_MULTI:0"
tmux select-pane -t "$SESSION_MULTI:0.0"; tmux split-window -v
tmux select-pane -t "$SESSION_MULTI:0.1"; tmux split-window -v
tmux select-pane -t "$SESSION_MULTI:0.2"; tmux split-window -v
tmux select-pane -t "$SESSION_MULTI:0.3"; tmux split-window -v
tmux select-pane -t "$SESSION_MULTI:0.4"; tmux split-window -v

# 各ペイン設定（起動含む）
for i in {0..6}; do
  tmux select-pane -t "$SESSION_MULTI:0.$i" -T "${PANE_TITLES[$i]}"
  tmux send-keys -t "$SESSION_MULTI:0.$i" "cd $(pwd)" C-m
  COLOR="\[\033[1;34m\]" && [ $i -eq 0 ] && COLOR="\[\033[1;31m\]"
  tmux send-keys -t "$SESSION_MULTI:0.$i" "export PS1='(${COLOR}${PANE_TITLES[$i]}\[\033[0m\]) \[\033[1;32m\]\w\[\033[0m\]\$ '" C-m
  tmux send-keys -t "$SESSION_MULTI:0.$i" "echo '=== ${PANE_TITLES[$i]} エージェント ==='" C-m
  tmux send-keys -t "$SESSION_MULTI:0.$i" "claude --dangerously-skip-permissions" C-m
done
log_success "✅ ${SESSION_MULTI} 起動完了"

# president セッション作成 + claude 起動
log_info "👑 ${SESSION_PRESIDENT} セッションを作成..."
tmux new-session -d -s "$SESSION_PRESIDENT"
tmux send-keys -t "$SESSION_PRESIDENT" "cd $(pwd)" C-m
tmux send-keys -t "$SESSION_PRESIDENT" "export PS1='(\[\033[1;35m\]PRESIDENT_${PROJECT_NAME}\[\033[0m\]) \[\033[1;32m\]\w\[\033[0m\]\$ '" C-m
tmux send-keys -t "$SESSION_PRESIDENT" "echo '=== PRESIDENT_${PROJECT_NAME} セッション ==='" C-m
tmux send-keys -t "$SESSION_PRESIDENT" "claude" C-m
log_success "✅ ${SESSION_PRESIDENT} 起動完了"

# /init を各エージェントに送信（少し待ってから）
log_info "📨 /init を自動送信中..."
sleep 5
for i in {0..6}; do
  tmux send-keys -t "$SESSION_MULTI:0.$i" "/init" C-m
done
log_success "✅ /init 自動送信完了"

# 結果表示
echo ""
log_info "🔍 セットアップ結果:"
tmux list-sessions
echo ""
log_success "🎉 ${PROJECT_NAME} 環境セットアップ完了！"

echo ""
echo "次のステップ："
echo "  tmux attach -t $SESSION_MULTI      # エージェント確認"
echo "  tmux attach -t $SESSION_PRESIDENT  # プレジデント確認"
