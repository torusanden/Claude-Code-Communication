#!/bin/bash

set -e

PROJECT_NAME="habit"
SESSION_MULTI="multiagent_${PROJECT_NAME}"
SESSION_PRESIDENT="president_${PROJECT_NAME}"
PANE_TITLES=("${PROJECT_NAME}_boss1" "${PROJECT_NAME}_worker1" "${PROJECT_NAME}_worker2" "${PROJECT_NAME}_worker3")

log_info() { echo -e "\033[1;32m[INFO]\033[0m $1"; }
log_success() { echo -e "\033[1;34m[SUCCESS]\033[0m $1"; }

echo "🤖 Multi-Agent Communication Demo 環境構築（${PROJECT_NAME})"
echo "==========================================="
echo ""

log_info "🧹 セッションクリーンアップ開始..."
tmux kill-session -t $SESSION_MULTI 2>/dev/null && log_info "$SESSION_MULTI 削除完了" || log_info "$SESSION_MULTI は存在しません"
tmux kill-session -t $SESSION_PRESIDENT 2>/dev/null && log_info "$SESSION_PRESIDENT 削除完了" || log_info "$SESSION_PRESIDENT は存在しません"
mkdir -p ./tmp
rm -f ./tmp/${PROJECT_NAME}_worker*_done.txt 2>/dev/null && log_info "完了ファイル削除" || true
log_success "✅ クリーンアップ完了"
echo ""

log_info "📺 ${SESSION_MULTI} セッション作成開始 (4ペイン)..."
tmux new-session -d -s "$SESSION_MULTI" -n "agents"
tmux split-window -h -t "$SESSION_MULTI:0"
tmux select-pane -t "$SESSION_MULTI:0.0"
tmux split-window -v
tmux select-pane -t "$SESSION_MULTI:0.2"
tmux split-window -v

log_info "ペインタイトル設定中..."
for i in {0..3}; do
    tmux select-pane -t "$SESSION_MULTI:0.$i" -T "${PANE_TITLES[$i]}"
    tmux send-keys -t "$SESSION_MULTI:0.$i" "cd $(pwd)" C-m
    COLOR="\[\033[1;34m\]" && [ $i -eq 0 ] && COLOR="\[\033[1;31m\]"
    tmux send-keys -t "$SESSION_MULTI:0.$i" "export PS1='(${COLOR}${PANE_TITLES[$i]}\[\033[0m\]) \[\033[1;32m\]\w\[\033[0m\]\$ '" C-m
    tmux send-keys -t "$SESSION_MULTI:0.$i" "echo '=== ${PANE_TITLES[$i]} エージェント ==='" C-m
done
log_success "✅ $SESSION_MULTI セッション作成完了"
echo ""

log_info "👑 ${SESSION_PRESIDENT} セッション作成開始..."
tmux new-session -d -s "$SESSION_PRESIDENT"
tmux send-keys -t "$SESSION_PRESIDENT" "cd $(pwd)" C-m
tmux send-keys -t "$SESSION_PRESIDENT" "export PS1='(\[\033[1;35m\]PRESIDENT_${PROJECT_NAME}\[\033[0m\]) \[\033[1;32m\]\w\[\033[0m\]\$ '" C-m
tmux send-keys -t "$SESSION_PRESIDENT" "echo '=== PRESIDENT_${PROJECT_NAME} セッション ==='" C-m
log_success "✅ ${SESSION_PRESIDENT} セッション作成完了"
echo ""

log_info "🔍 環境確認中..."
echo ""
echo "📊 セットアップ結果:"
echo "==================="
tmux list-sessions
echo ""
echo "📋 ペイン構成:"
for i in {0..3}; do
  echo "  Pane $i: ${PANE_TITLES[$i]}"
done
echo "  President セッション: ${SESSION_PRESIDENT}"
echo ""
log_success "🎉 ${PROJECT_NAME} 環境セットアップ完了！"
echo ""
echo "📋 次のステップ:"
echo "  tmux attach-session -t $SESSION_MULTI      # マルチエージェント確認"
echo "  tmux attach-session -t $SESSION_PRESIDENT  # プレジデント確認"
echo ""
echo "  Claude 起動:"
echo "    tmux send-keys -t $SESSION_PRESIDENT 'claude' C-m"
echo "    for i in {0..3}; do tmux send-keys -t $SESSION_MULTI:0.\$i 'claude' C-m; done"
echo ""
echo "📜 指示書:"
echo "  instructions/${PROJECT_NAME}_boss1.md"
echo "  instructions/${PROJECT_NAME}_worker1.md"
echo "  ..."
echo "  CLAUDE.md（構造定義）"
